import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const supabase = await createClient(cookies());
    const formData = await req.formData();

    const modelJson = formData.get("modelJson") as File; // Blob with topology + manifest
    const weights = formData.get("weights") as File;
    const metadata = formData.get("metadata") as string;

    const metadataBlob = new Blob([metadata], { type: "application/json" });
    const bucket = "ml-models";

    const { error: modelError } = await supabase.storage
      .from(bucket)
      .upload("models/crop-model/model.json", modelJson as File, {
        contentType: "application/json",
        upsert: true,
      });
    if (modelError) throw modelError;

    const { error: weightsError } = await supabase.storage
      .from(bucket)
      .upload("models/crop-model/weights.bin", weights as File, {
        contentType: "application/octet-stream",
        upsert: true,
      });
    if (weightsError) throw weightsError;

    const { error: metaError } = await supabase.storage
      .from(bucket)
      .upload("models/crop-model/metadata.json", metadataBlob, {
        contentType: "application/json",
        upsert: true,
      });
    if (metaError) throw metaError;

    console.log("Model files saved successfully.", {
      modelJson,
      weights,
      metadata,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Save model error:", err.message);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
