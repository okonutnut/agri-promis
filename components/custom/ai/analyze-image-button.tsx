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
  const [metadata, setMetadata] = useState<any[]>([]);
  const [metadataResult, setMetadataResult] = useState<any | null>(null);

  // Retraining form states
  const [showTrainForm, setShowTrainForm] = useState(false);
  const [trainLabel, setTrainLabel] = useState("");
  const [trainDescription, setTrainDescription] = useState("");
  const [trainPossibleSolutions, setTrainPossibleSolutions] = useState("");
  const [trainingData, setTrainingData] = useState<Record<string, tf.Tensor[]>>(
    {}
  );

  const supabase = createClient();

  // Load mobilenet
  useEffect(() => {
    let mounted = true;
    (async () => {
      const m = await mobilenet.load({ version: 2, alpha: 1.0 });
      if (mounted) setMobilenetModel(m);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load classifier + metadata
  async function loadClassifierFromSupabase(basePath = "models/crop-model") {
    try {
      const res = await fetch(
        `/api/get-model-url?basePath=${encodeURIComponent(basePath)}`
      );
      const { modelUrl, weightsUrl, metadataUrl } = await res.json();

      if (!modelUrl || !weightsUrl) return;

      const modelJson = await (await fetch(modelUrl)).json();
      modelJson.weightsManifest[0].paths = [weightsUrl];

      const ioHandler: tf.io.IOHandler = { load: async () => modelJson };
      const m = await tf.loadLayersModel(ioHandler);
      setClassifierModel(m);

      if (metadataUrl) {
        const metaRes = await fetch(metadataUrl);
        const metaJson = await metaRes.json();
        setLabels(metaJson.map((m: any) => m.title));
        setMetadata(metaJson);
      }
    } catch (e) {
      console.error("Error loading classifier:", e);
    }
  }

  useEffect(() => {
    loadClassifierFromSupabase().catch(() => {});
  }, []);

  // Helpers
  async function imageSrcToElement(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  }

  async function mobileEmbedding(imageEl: HTMLImageElement) {
    if (!mobilenetModel) throw new Error("mobilenet not ready");
    const activation = mobilenetModel.infer(imageEl, true) as tf.Tensor;
    const flat = activation.reshape([1, activation.size]);
    activation.dispose();
    return flat;
  }

  // Predict image
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

      if (bestProb >= 0.4) {
        setPrediction({ label, prob: bestProb });
        const meta = metadata.find((m) => m.title === label);
        if (meta) setMetadataResult(meta);
      } else {
        setPrediction({ label: "Can't analyze", prob: bestProb });
      }

      emb.dispose();
      pred.dispose();
    } catch (e) {
      console.error("Prediction error:", e);
    }
    setIsAnalyzing(false);
    setIsDrawerOpen(true);
  }

  // Save new label + retrain + upload
  async function saveNewTraining() {
    if (!imageSrc || !mobilenetModel || !trainLabel) return;

    // Collect example
    const imgEl = await imageSrcToElement(imageSrc);
    const emb = await mobileEmbedding(imgEl);
    setTrainingData((prev) => {
      const arr = prev[trainLabel] || [];
      return { ...prev, [trainLabel]: [...arr, emb] };
    });

    const xs: tf.Tensor[] = [];
    const ys: number[] = [];
    const labelList = Object.keys(trainingData);

    labelList.forEach((label, i) => {
      trainingData[label].forEach((emb) => {
        xs.push(emb);
        ys.push(i);
      });
    });

    // include current collected embedding
    xs.push(emb);
    ys.push(labelList.length);

    const xsTensor = tf.concat(xs);
    const ysTensor = tf.tensor1d(ys, "int32");
    const ysOneHot = tf.oneHot(ysTensor, labelList.length + 1);

    // Train new classifier
    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        inputShape: [xsTensor.shape[1] || null],
        units: 100,
        activation: "relu",
      })
    );
    model.add(
      tf.layers.dense({ units: labelList.length + 1, activation: "softmax" })
    );

    model.compile({
      optimizer: "adam",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
    await model.fit(xsTensor, ysOneHot, { epochs: 20 });

    setClassifierModel(model);
    setLabels([...labelList, trainLabel]);

    // Save to Supabase
    const saveHandler: tf.io.IOHandler = {
      save: async (modelArtifacts) => {
        // model.json
        const modelBlob = new Blob(
          [JSON.stringify(modelArtifacts.modelTopology)],
          {
            type: "application/json",
          }
        );

        // weights.bin
        const weightsBlob = new Blob(
          [new Uint8Array(modelArtifacts.weightData as ArrayBuffer)],
          { type: "application/octet-stream" }
        );

        // Upload files
        await supabase.storage
          .from("models")
          .upload("crop-model/model.json", modelBlob, { upsert: true });
        await supabase.storage
          .from("models")
          .upload("crop-model/weights.bin", weightsBlob, { upsert: true });

        // metadata.json
        const newEntry = {
          title: trainLabel,
          description: trainDescription,
          possible_solution: trainPossibleSolutions
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        };

        const updatedMeta = [...metadata, newEntry];
        const metaBlob = new Blob([JSON.stringify(updatedMeta, null, 2)], {
          type: "application/json",
        });

        await supabase.storage
          .from("models")
          .upload("crop-model/metadata.json", metaBlob, { upsert: true });

        setMetadata(updatedMeta);
        alert("Model retrained and saved!");

        return {
          modelArtifactsInfo: {
            dateSaved: new Date(),
            modelTopologyType: "JSON",
            modelTopologyBytes: modelBlob.size,
            weightDataBytes: weightsBlob.size,
          },
        };
      },
    };

    await model.save(saveHandler);

    xsTensor.dispose();
    ysTensor.dispose();
    ysOneHot.dispose();
    emb.dispose();

    setShowTrainForm(false);
    setTrainLabel("");
    setTrainDescription("");
    setTrainPossibleSolutions("");
  }

  return (
    <>
      {isAIFeatureEnabled && mobilenetModel != null && (
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
        <DrawerTrigger asChild />
        <DrawerContent className="min-h-[400px] text-center pb-4">
          {!showTrainForm ? (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-lg">
                  Issue Analysis:
                  <br />
                  <span className="text-md font-semibold">
                    {prediction ? prediction.label : "Analyzing..."}
                  </span>
                </DrawerTitle>
                <DrawerDescription>
                  {metadataResult
                    ? metadataResult.description
                    : prediction?.label === "Can't analyze"
                    ? "Confidence too low to analyze."
                    : "No metadata found."}
                </DrawerDescription>
              </DrawerHeader>

              {metadataResult && (
                <>
                  <strong>Possible Solution:</strong>
                  <ul className="list-disc list-inside text-left max-w-sm mx-auto">
                    {(metadataResult.possibleSolution || []).map(
                      (s: string, i: number) => (
                        <li key={i}>{s}</li>
                      )
                    )}
                  </ul>
                  <div className="my-2" />
                </>
              )}
            </>
          ) : (
            <center>
              <div className="max-w-sm mt-4 p-4 space-y-2">
                <h2 className="text-lg font-semibold">
                  Retrain Model with New Label
                </h2>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Correct Label"
                  value={trainLabel}
                  onChange={(e) => setTrainLabel(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Description"
                  value={trainDescription}
                  onChange={(e) => setTrainDescription(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Possible Solutions (one per line)"
                  value={trainPossibleSolutions}
                  onChange={(e) => setTrainPossibleSolutions(e.target.value)}
                />

                <div className="flex gap-2">
                  <Button className="w-full" onClick={saveNewTraining}>
                    Save
                  </Button>
                </div>
              </div>
            </center>
          )}
          {prediction && (
            <div>
              <Button
                variant="outline"
                onClick={() => setShowTrainForm((p) => !p)}
              >
                {showTrainForm ? "Cancel" : "Retrain with new label"}
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
