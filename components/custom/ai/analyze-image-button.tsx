"use client";

import { Button } from "@/components/ui/button";
import { Sparkle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { createClient } from "@/utils/supabase/client";

type AnalyzeImageButtonProps = {
  imageSrc?: string;
};

export default function AnalyzeImageButton({
  imageSrc,
}: AnalyzeImageButtonProps) {
  const [isAIFeatureEnabled] = useState(navigator.onLine);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobilenetModel, setMobilenetModel] = useState<any | null>(null);
  const [classifierModel, setClassifierModel] = useState<tf.LayersModel | null>(
    null
  );
  const [labels, setLabels] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<{
    label: string;
    prob: number;
  } | null>(null);
  const [metadataResult, setMetadataResult] = useState<any | null>(null);

  const supabase = createClient();

  // Load mobilenet on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const m = await mobilenet.load({ version: 2, alpha: 1.0 });
      if (!mounted) return;
      setMobilenetModel(m);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load classifier model and metadata from Supabase
  async function loadClassifierFromSupabase(basePath = "models/crop-model") {
    try {
      const res = await fetch(
        `/api/get-model-url?basePath=${encodeURIComponent(basePath)}`
      );
      const { modelUrl, weightsUrl, metadataUrl } = await res.json();

      if (!modelUrl || !weightsUrl) return;

      const modelJson = await (await fetch(modelUrl)).json();
      modelJson.weightsManifest[0].paths = [weightsUrl];

      const ioHandler: tf.io.IOHandler = {
        load: async () => modelJson,
      };

      const m = await tf.loadLayersModel(ioHandler);
      setClassifierModel(m);

      // Fetch metadata
      if (metadataUrl) {
        const metaRes = await fetch(metadataUrl);
        const metaJson = await metaRes.json();
        setLabels(metaJson.map((m: any) => m.title));
      }
    } catch (e) {
      // handle error
    }
  }

  useEffect(() => {
    loadClassifierFromSupabase().catch(() => {});
  }, []);

  // Helper: convert imageSrc to HTMLImageElement
  async function imageSrcToElement(src: string): Promise<HTMLImageElement> {
    return await new Promise<HTMLImageElement>((resolve) => {
      const img = document.createElement("img");
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

  // Helper: get mobilenet embedding
  async function mobileEmbedding(imageEl: HTMLImageElement) {
    if (!mobilenetModel) throw new Error("mobilenet not ready");
    const activation = mobilenetModel.infer(imageEl, true) as tf.Tensor;
    const flat = activation.reshape([1, activation.size]);
    activation.dispose();
    return flat;
  }

  // Main: Predict image
  async function predictImage(src?: string) {
    if (!src) return;
    setIsAnalyzing(true);
    setPrediction(null);
    setMetadataResult(null);

    try {
      const imgEl = await imageSrcToElement(src);
      const emb = await mobileEmbedding(imgEl);

      if (!classifierModel) {
        setIsAnalyzing(false);
        return;
      }

      const pred = classifierModel.predict(emb) as tf.Tensor;
      const arr = await pred.data();
      const arrList = Array.from(arr);
      const bestIdx = arrList.indexOf(Math.max(...arrList));
      const bestProb = arrList[bestIdx];
      const label = labels[bestIdx] ?? `class_${bestIdx}`;
      setPrediction({ label, prob: bestProb });

      // Fetch metadata from Supabase if confident
      if (bestProb > 0.35) {
        const { data, error } = await supabase
          .from("disease_models")
          .select("*")
          .eq("title", label)
          .order("version", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!error && data) setMetadataResult(data);
      }

      emb.dispose();
      pred.dispose();
    } catch (e) {
      // handle error
      console.log(e);
    }
    setIsAnalyzing(false);
    setIsDrawerOpen(true);
  }

  return (
    <>
      {isAIFeatureEnabled && (
        <Button
          onClick={() => predictImage(imageSrc)}
          variant="ghost"
          className="h-10 w-10 p-0 text-white bg-black/50 hover:bg-black/70 rounded-full"
          aria-label="Analyze Image"
          disabled={isAnalyzing || !imageSrc}
        >
          {isAnalyzing ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Sparkle size={20} />
          )}
        </Button>
      )}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild></DrawerTrigger>
        <DrawerContent className="min-h-[300px] text-center">
          <DrawerHeader>
            <DrawerTitle className="text-lg">
              {prediction ? prediction.label : "Analyzing..."}
            </DrawerTitle>
            <DrawerDescription>
              {metadataResult
                ? metadataResult.description
                : "No metadata found or prediction confidence too low."}
            </DrawerDescription>
          </DrawerHeader>
          {metadataResult && (
            <>
              <strong>Possible Solution:</strong>
              <ul>
                {(metadataResult.possible_solution || []).map(
                  (s: string, i: number) => (
                    <li key={i}>{s}</li>
                  )
                )}
              </ul>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
