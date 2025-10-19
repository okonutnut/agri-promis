import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const supabase = await createClient(cookies());
    const form = await req.formData();

    const files = form.getAll("files") as File[];
    const labelsRaw = form.getAll("labels[]") as string[];
    const labelsMeta = form.get("labelsMeta") as string | null;

    const bucket = "ml-examples";
    const modelPath = `crop-examples/${Date.now()}`;

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const label = labelsRaw[i] ?? "-1";
      const dest = `${modelPath}/${label}/${f.name}`;
      const { error } = await supabase.storage.from(bucket).upload(dest, f, {
        contentType: f.type || "application/octet-stream",
        upsert: true,
      });
      if (error) console.error("upload example error", error.message);
    }

    // store labelsMeta as metadata file for later reference
    if (labelsMeta) {
      const blob = new Blob([labelsMeta], { type: "application/json" });
      await supabase.storage.from(bucket).upload(`${modelPath}/labels.json`, blob, {
        contentType: "application/json",
        upsert: true,
      });
    }

    return NextResponse.json({ ok: true, path: modelPath });
  } catch (err: any) {
    console.error("upload-training-examples error", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
