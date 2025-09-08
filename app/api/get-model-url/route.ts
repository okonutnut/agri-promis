import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const basePath = searchParams.get("basePath"); // e.g. models/crop-model

    if (!basePath) {
      return NextResponse.json(
        { error: "Missing basePath parameter" },
        { status: 400 }
      );
    }

    const supabase = await createClient(cookies());

    // Sign both files
    const { data: model, error: modelErr } = await supabase.storage
      .from("ml-models")
      .createSignedUrl(`${basePath}/model.json`, 60 * 60);

    const { data: weights, error: weightsErr } = await supabase.storage
      .from("ml-models")
      .createSignedUrl(`${basePath}/weights.bin`, 60 * 60);

    const { data: metadata, error: metaErr } = await supabase.storage
      .from("ml-models")
      .createSignedUrl(`${basePath}/metadata.json`, 60 * 60);

    if (modelErr || weightsErr || metaErr) {
      console.error("Supabase storage error:", {
        modelErr,
        weightsErr,
        metaErr,
      });
      return NextResponse.json(
        { error: "Error generating signed URLs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      modelUrl: model?.signedUrl,
      weightsUrl: weights?.signedUrl,
      metadataUrl: metadata?.signedUrl,
    });
  } catch (err: any) {
    console.error("get-model-url error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
