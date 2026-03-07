import { NextResponse } from "next/server";
import OpenAI from "openai";
import knowledgeBase from "@/data/crop-disease-knowledge.json";
import { z } from "zod";

const modelName = process.env.OPENAI_MODEL || "gpt-4.1-mini";

type DetectRequestBody = {
  crop?: string;
  imageSrc?: string; // signed URL
  imageBase64?: string; // fallback for blob/local images
};

type Category = "pest" | "disease";

type KnowledgeEntry = {
  name: string;
  scientific_name?: string;
  type?: string;
  causal_agent?: string;
  symptoms?: string[];
  control?: string[];
};

type CropKnowledge = {
  crop: string;
  pests: KnowledgeEntry[];
  diseases: KnowledgeEntry[];
};

const modelOutputSchema = z.object({
  category: z.enum(["pest", "disease", "unknown"]),
  name: z.string(),
  confidence: z.number().min(0).max(1),
});

function extractFirstJsonObject(raw: string) {
  const trimmed = raw.trim();
  const markdownJsonMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/i);
  if (markdownJsonMatch?.[1]) return markdownJsonMatch[1].trim();

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function normalizeName(target: string) {
  return target
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = (await req.json()) as DetectRequestBody;
    const crop = (body.crop || "corn").toLowerCase().trim();

    const cropData = (knowledgeBase.crops as CropKnowledge[]).find(
      (c) => c.crop.toLowerCase() === crop,
    );
    if (!cropData) {
      return NextResponse.json({ error: "Unsupported crop" }, { status: 400 });
    }

    if (!body.imageSrc && !body.imageBase64) {
      return NextResponse.json(
        { error: "Missing image input" },
        { status: 400 },
      );
    }

    const candidates = [
      ...cropData.pests.map((p) => ({ category: "pest", name: p.name })),
      ...cropData.diseases.map((d) => ({ category: "disease", name: d.name })),
    ];

    const inputImageContent = body.imageBase64
      ? {
          type: "input_image" as const,
          image_url: `data:image/jpeg;base64,${body.imageBase64}`,
          detail: "auto" as const,
        }
      : {
          type: "input_image" as const,
          image_url: body.imageSrc!,
          detail: "auto" as const,
        };

    const response = await openai.responses.create({
      model: modelName,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are an agricultural image classifier. Choose only from provided candidates. " +
                "If uncertain, return unknown with low confidence. Return only valid JSON.",
            },
          ],
        },
        {
          role: "user",
          content: [
            { type: "input_text", text: `Crop: ${crop}` },
            {
              type: "input_text",
              text: `Candidates: ${JSON.stringify(candidates)}`,
            },
            inputImageContent,
            {
              type: "input_text",
              text: 'Return JSON only: {"category":"pest|disease|unknown","name":"string","confidence":0-1}',
            },
          ],
        },
      ],
    });

    const rawText =
      response.output_text ||
      '{"category":"unknown","name":"unknown","confidence":0.4}';
    const jsonText = extractFirstJsonObject(rawText);
    const parsed = modelOutputSchema.safeParse(JSON.parse(jsonText));

    if (!parsed.success) {
      return NextResponse.json({
        crop,
        category: "disease",
        name: "Unknown",
        scientificName: null,
        prevention: [
          "Unable to confidently identify the issue from this image. Please retake a clearer photo.",
        ],
        confidence: 0.4,
        lowConfidence: true,
        source: "model",
      });
    }

    const modelResult = parsed.data;

    if (modelResult.category === "unknown") {
      return NextResponse.json({
        crop,
        category: "disease",
        name: "Unknown",
        scientificName: null,
        prevention: [
          "Retake a clearer image and consult an agriculture technician.",
        ],
        confidence: modelResult.confidence ?? 0.4,
        lowConfidence: true,
        source: "model",
      });
    }

    const sourceList =
      modelResult.category === "pest" ? cropData.pests : cropData.diseases;
    const normalizedPrediction = normalizeName(modelResult.name);
    const matched = sourceList.find(
      (x) => normalizeName(x.name) === normalizedPrediction,
    );

    if (!matched) {
      return NextResponse.json({
        crop,
        category: "disease",
        name: "Unknown",
        scientificName: null,
        prevention: ["No canonical match found. Please verify manually."],
        confidence: modelResult.confidence ?? 0.4,
        lowConfidence: true,
        source: "hybrid",
      });
    }

    return NextResponse.json({
      crop,
      category: modelResult.category as Category,
      name: matched.name,
      scientificName: matched.scientific_name ?? null,
      causalAgent:
        "causal_agent" in matched ? (matched.causal_agent ?? null) : null,
      type: matched.type ?? null,
      symptoms: matched.symptoms ?? [],
      prevention: matched.control ?? [],
      confidence: modelResult.confidence ?? 0.7,
      lowConfidence: (modelResult.confidence ?? 0.7) < 0.65,
      source: "hybrid",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Detection failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
