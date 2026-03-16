import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

type ReportType = "post-travel" | "monitoring";

type SummarizeRequestBody = {
  reportType?: ReportType;
  reportId?: string;
};

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item)))
      .filter(Boolean)
      .join("; ");
  }
  if (typeof value === "string") return value.trim();
  return String(value);
}

function truncate(input: string, max = 1200): string {
  if (!input) return "";
  return input.length > max ? `${input.slice(0, max)}…` : input;
}

function buildPrompt(reportType: ReportType, fields: Record<string, string>) {
  const header =
    reportType === "post-travel"
      ? "You are writing a polished, human narrative summary of a post-travel report."
      : "You are writing a polished, human narrative summary of a monitoring report.";

  const contextLines = Object.entries(fields)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => `- ${key}: ${truncate(value)}`)
    .join("\n");

  return `${header}
Write the output with these strict rules:
1) Exactly 1 sentence (maximum 45 words).
2) Match this narrative tone and flow: "<Uploader Name> attended the ... in <Location>, participating in ... alongside ..., where they ... and presented ...".
3) Start with the uploader/reporter name when available.
4) Use warm, natural, polished wording that sounds like a human field narrative.
5) Keep it concise, specific, and easy to scan.
6) Prefer concrete activity words like attended, participated, completed, presented when supported by the details.
7) Plain text only, no markdown, no bullet points, no quotation marks.
8) Do not include chain-of-thought, analysis, or tags like <think>.
9) Use only provided details. Do not invent facts, names, counts, locations, or phases.
10) If details are too limited, respond with: "Insufficient report details for a clear summary."

Report details:
${contextLines || "- No meaningful fields provided."}
`;
}

async function fetchPostTravelSummaryContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reportId: string,
) {
  const { data, error } = await supabase
    .from("post_travel_with_order")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error || !data) {
    throw new Error("Post-travel report not found.");
  }

  return {
    title: normalizeText(data.project_title_activity),
    location: normalizeText(data.icc_fca_lgu_name),
    placesVisited: normalizeText(data.projects_places_visited),
    activities: normalizeText(data.activities_undertaken),
    issues: normalizeText(data.issues_concern),
    remarks: normalizeText(data.remarks),
    travelOrderNo: normalizeText(data.travel_order_no),
    reporterName: normalizeText(data.fullname),
    date: normalizeText(data.date),
  };
}

async function fetchMonitoringSummaryContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reportId: string,
) {
  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `
      id,
      purpose,
      findings,
      issues_concern,
      remarks,
      observation,
      created_at,
      travel_order:travel_order(travel_order_no),
      reporter:user_profile!monitoring_reporter_id_fkey(fullname),
      project_location:project_location(name, barangay, municipality, province)
    `,
    )
    .eq("id", reportId)
    .single();

  if (error || !data) {
    throw new Error("Monitoring report not found.");
  }

  const projectLocation = Array.isArray(data.project_location)
    ? data.project_location[0]
    : data.project_location;

  const reporter = Array.isArray(data.reporter)
    ? data.reporter[0]
    : data.reporter;

  const travelOrder = Array.isArray(data.travel_order)
    ? data.travel_order[0]
    : data.travel_order;

  const locationText = [
    normalizeText(projectLocation?.name),
    normalizeText(projectLocation?.barangay),
    normalizeText(projectLocation?.municipality),
    normalizeText(projectLocation?.province),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    purpose: normalizeText(data.purpose),
    findings: normalizeText(data.findings),
    issues: normalizeText(data.issues_concern),
    remarks: normalizeText(data.remarks),
    observation: normalizeText(data.observation),
    reporterName: normalizeText(reporter?.fullname),
    travelOrderNo: normalizeText(travelOrder?.travel_order_no),
    location: locationText,
    submittedAt: normalizeText(data.created_at),
  };
}

async function summarizeWithNvidiaMinimax(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });

  const completion = await client.chat.completions.create({
    model: "deepseek-ai/deepseek-v3.1-terminus",
    messages: [
      {
        role: "system",
        content:
          "You summarize field reports in one polished narrative sentence. Lead with the uploader/reporter name when available. Keep the tone warm, natural, and specific, mirroring a concise accomplishment-focused field update. Use only given facts and never invent details.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 300,

    stream: false,
  });

  const rawText = completion.choices?.[0]?.message?.content?.trim();
  if (!rawText) {
    throw new Error("NVIDIA DeepSeek returned an empty summary.");
  }

  const withoutThinkBlocks = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .trim();

  const firstLine = withoutThinkBlocks
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");

  const cleaned = firstLine
    .replace(/\s+/g, " ")
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!cleaned) {
    throw new Error("NVIDIA DeepSeek returned an unusable summary.");
  }

  return cleaned;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SummarizeRequestBody;
    const reportType = body?.reportType;
    const reportId = body?.reportId;

    if (!reportType || !reportId) {
      return NextResponse.json(
        { error: "reportType and reportId are required." },
        { status: 400 },
      );
    }

    if (reportType !== "post-travel" && reportType !== "monitoring") {
      return NextResponse.json(
        { error: "Invalid reportType. Use 'post-travel' or 'monitoring'." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const context =
      reportType === "post-travel"
        ? await fetchPostTravelSummaryContext(supabase, reportId)
        : await fetchMonitoringSummaryContext(supabase, reportId);

    const prompt = buildPrompt(reportType, context);
    const summary = await summarizeWithNvidiaMinimax(prompt);

    return NextResponse.json({ summary });
  } catch (error: unknown) {
    console.error("summarize route error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate summary. Please try again later.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
