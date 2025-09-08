"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
// import type { io } from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import type { CropDiseaseData } from "@/components/interfaces";
import { createClient } from "@/utils/supabase/client";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";

type TrainingData = { xs: number[][]; ys: number[] };

export default function Page() {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [mobilenetModel, setMobilenetModel] = useState<any | null>(null);
  const [classifierModel, setClassifierModel] = useState<tf.LayersModel | null>(
    null
  );
  const [labels, setLabels] = useState<string[]>([]);
  const [trainingData, setTrainingData] = useState<TrainingData>({
    xs: [],
    ys: [],
  });
  const [status, setStatus] = useState<string>("idle");
  const [prediction, setPrediction] = useState<{
    label: string;
    prob: number;
  } | null>(null);
  const [metadataResult, setMetadataResult] = useState<any | null>(null);
  const [metadataForSave, setMetadataForSave] = useState<CropDiseaseData[]>([]); // one per label
  const [showTrainModal, setShowTrainModal] = useState(false);
  const [editMetaIdx, setEditMetaIdx] = useState<number | null>(null);
  const [editMetaDesc, setEditMetaDesc] = useState("");
  const [editMetaSols, setEditMetaSols] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatus("loading mobilenet...");
      const m = await mobilenet.load({ version: 2, alpha: 1.0 });
      if (!mounted) return;
      setMobilenetModel(m);
      setStatus("mobilenet ready");
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function loadClassifierFromSupabase(basePath = "models/crop-model") {
    try {
      setStatus("fetching model urls...");
      const res = await fetch(
        `/api/get-model-url?basePath=${encodeURIComponent(basePath)}`
      );
      const { modelUrl, weightsUrl, metadataUrl } = await res.json();

      if (!modelUrl || !weightsUrl) {
        setStatus("no model found");
        return;
      }

      // Fetch model JSON
      const modelJson = await (await fetch(modelUrl)).json();

      // Patch weights manifest to use signed weights URL
      modelJson.weightsManifest[0].paths = [weightsUrl];

      const ioHandler: tf.io.IOHandler = {
        load: async () => modelJson,
      };

      setStatus("loading classifier...");
      const m = await tf.loadLayersModel(ioHandler);
      setClassifierModel(m);

      // Fetch metadata
      if (metadataUrl) {
        const metaRes = await fetch(metadataUrl);
        const metaJson = await metaRes.json();
        setMetadataForSave(metaJson); // restore metadata
        setLabels(metaJson.map((m: any) => m.title)); // restore labels
      }

      setStatus("classifier loaded");
    } catch (e: any) {
      console.error("loadClassifier error:", e);
      setStatus("failed loading model");
    }
  }

  useEffect(() => {
    // try to load existing model on mount (optional)
    loadClassifierFromSupabase().catch(() => {});
  }, []);

  async function imageToElement(file: File) {
    return await new Promise<HTMLImageElement>((resolve) => {
      const img = document.createElement("img");
      img.onload = () => resolve(img);
      img.src = URL.createObjectURL(file);
    });
  }

  async function mobileEmbedding(imageEl: HTMLImageElement) {
    if (!mobilenetModel) throw new Error("mobilenet not ready");
    // inference to get embeddings
    const activation = mobilenetModel.infer(imageEl, true) as tf.Tensor;
    const flat = activation.reshape([1, activation.size]);
    activation.dispose();
    return flat;
  }

  async function handlePredictFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file)); // Add this line
    setStatus("predicting...");
    setPrediction(null);
    setMetadataResult(null);

    const imgEl = await imageToElement(file);
    const emb = await mobileEmbedding(imgEl);

    if (!classifierModel) {
      setStatus("no classifier — please train or upload a model");
      emb.dispose();
      return;
    }

    const pred = classifierModel.predict(emb) as tf.Tensor as tf.Tensor;
    const arr = await pred.data();
    const arrList = Array.from(arr);
    const bestIdx = arrList.indexOf(Math.max(...arrList));
    const bestProb = arrList[bestIdx];
    const label = labels[bestIdx] ?? `class_${bestIdx}`;
    setPrediction({ label, prob: bestProb });
    setStatus("predicted");

    // If you want to load metadata from Supabase by title:
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
  }

  function addLabel(newLabel: string) {
    if (!newLabel) return;
    setLabels((p) => [...p, newLabel]);
    // prepare metadata placeholder for this label
    setMetadataForSave((p) => [
      ...p,
      { title: newLabel, description: "", possibleSolution: [] },
    ]);
  }

  async function collectExampleForLabel(labelIndex: number) {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const imgEl = await imageToElement(file);
    const emb = await mobileEmbedding(imgEl);
    const arr = (await emb.array()) as number[][];
    const flat = arr[0];
    setTrainingData((p) => ({
      xs: [...p.xs, flat],
      ys: [...p.ys, labelIndex],
    }));
    emb.dispose();
  }

  async function trainClassifier(epochs = 12) {
    if (trainingData.xs.length === 0) return;
    setStatus("building classifier...");
    const inputDim = trainingData.xs[0].length;
    const numClasses = Math.max(...trainingData.ys) + 1;
    const xs = tf.tensor2d(trainingData.xs);
    const ys = tf.oneHot(tf.tensor1d(trainingData.ys, "int32"), numClasses);

    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        inputShape: [inputDim],
        units: 128,
        activation: "relu",
      })
    );
    model.add(tf.layers.dropout({ rate: 0.25 }));
    model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));

    model.compile({
      optimizer: tf.train.adam(0.0005),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    setStatus("training...");
    await model.fit(xs, ys, {
      epochs,
      batchSize: Math.min(32, trainingData.xs.length),
    });

    setClassifierModel(model);
    setStatus("trained");
    xs.dispose();
    ys.dispose();
  }

  async function saveModelToSupabase() {
    if (!classifierModel) return;
    setStatus("saving model to supabase...");

    const metadataPayload = metadataForSave.map((m, idx) => ({
      ...m,
      title: m.title || labels[idx] || `class_${idx}`,
    }));

    const saveHandler = async (
      artifacts: tf.io.ModelArtifacts
    ): Promise<tf.io.SaveResult> => {
      const form = new FormData();

      // model.json contains topology + weights manifest
      const modelJson = JSON.stringify({
        format: "layers-model",
        generatedBy: `TensorFlow.js v${tf.version.tfjs}`,
        convertedBy: null,
        modelTopology: artifacts.modelTopology,
        weightsManifest: [
          { paths: ["weights.bin"], weights: artifacts.weightSpecs || [] },
        ],
      });

      form.append(
        "modelJson",
        new Blob([modelJson], { type: "application/json" }),
        "model.json"
      );

      // weights.bin is raw ArrayBuffer from TFJS
      const weightData = artifacts.weightData;
      if (!weightData) throw new Error("No weight data found");

      form.append(
        "weights",
        new Blob([weightData as ArrayBuffer], {
          type: "application/octet-stream",
        }),
        "weights.bin"
      );

      // Optional metadata
      form.append("metadata", JSON.stringify(metadataPayload));

      await fetch("/api/save-model", { method: "POST", body: form });

      return {
        modelArtifactsInfo: {
          dateSaved: new Date(),
          modelTopologyType: "JSON",
          weightDataBytes: (artifacts.weightData as ArrayBuffer).byteLength,
        },
        responses: [],
      };
    };

    await classifierModel.save(tf.io.withSaveHandler(saveHandler));
    setStatus("saved");
  }

  async function reloadClassifierFrom(path?: string) {
    await loadClassifierFromSupabase(path);
  }

  // Move trainClassifier call to a handler
  const handleTrainConfirm = async () => {
    setShowTrainModal(false);
    await trainClassifier(15);
  };

  // Open modal and load current metadata
  const handleEditMetaOpen = useCallback(
    (idx: number) => {
      setEditMetaIdx(idx);
      setEditMetaDesc(metadataForSave[idx]?.description || "");
      setEditMetaSols(
        (metadataForSave[idx]?.possibleSolution || []).join(", ")
      );
    },
    [metadataForSave]
  );

  // Save metadata changes
  const handleEditMetaSave = useCallback(() => {
    if (editMetaIdx === null) return;
    setMetadataForSave((prev) => {
      const copy = [...prev];
      copy[editMetaIdx] = {
        ...copy[editMetaIdx],
        description: editMetaDesc,
        possibleSolution: editMetaSols
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      return copy;
    });
    setEditMetaIdx(null);
  }, [editMetaIdx, editMetaDesc, editMetaSols]);

  return (
    <CustomPageLayout
      pageTitle="Crop Detector"
      navItems={getDashboardNavItems()}
    >
      <span className="text-xl">
        Crop Disease — TFJS + Next (App Router) + Supabase (TS)
      </span>
      <br />
      <span className="text-md">Status: {status}</span>

      <div className="mt-4">
        <div className="bg-white border rounded-lg shadow-sm p-6 flex flex-col items-center max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose image to predict / collect examples:
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePredictFile}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Preview"
              style={{ marginTop: 12, maxWidth: 220, borderRadius: 8 }}
            />
          )}
        </div>
      </div>

      {prediction && (
        <div style={{ marginTop: 12 }}>
          <h3>Prediction</h3>
          <p>
            {prediction.label} — {(prediction.prob * 100).toFixed(2)}%
          </p>
          {metadataResult && (
            <div>
              <h4>Metadata</h4>
              <p>{metadataResult.description}</p>
              <ul>
                {(metadataResult.possible_solution || []).map(
                  (s: string, i: number) => (
                    <li key={i}>{s}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      <hr style={{ marginTop: 20, marginBottom: 20 }} />

      <div className="p-2">
        <span className="text-lg">Labels & Training</span>
        <div className="flex gap-2 items-center">
          <Input
            id="new-label"
            className="max-w-sm"
            placeholder="New label name"
          />
          <Button
            onClick={() => {
              const el = document.getElementById(
                "new-label"
              ) as HTMLInputElement | null;
              if (!el) return;
              addLabel(el.value.trim());
              el.value = "";
            }}
          >
            Add label
          </Button>
        </div>

        <div style={{ marginTop: 12 }}>
          <span className="text-xl">Labels</span>
          {labels.map((lab, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <strong>{lab}</strong>
              <Button
                onClick={() => collectExampleForLabel(idx)}
                variant={"outline"}
              >
                Collect example from selected image
              </Button>
              <Button
                onClick={() => handleEditMetaOpen(idx)}
                variant={"outline"}
              >
                Edit metadata
              </Button>
            </div>
          ))}
        </div>

        {/* Edit Metadata Modal */}
        <Dialog
          open={editMetaIdx !== null}
          onOpenChange={() => setEditMetaIdx(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit Metadata for{" "}
                {editMetaIdx !== null ? labels[editMetaIdx] : ""}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <label className="block text-sm font-medium">Description</label>
              <Input
                value={editMetaDesc}
                onChange={(e) => setEditMetaDesc(e.target.value)}
                placeholder="Description for this label"
              />
              <label className="block text-sm font-medium">
                Possible Solutions (comma separated)
              </label>
              <Input
                value={editMetaSols}
                onChange={(e) => setEditMetaSols(e.target.value)}
                placeholder="e.g. Solution 1, Solution 2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditMetaIdx(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditMetaSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div style={{ marginTop: 12 }}>
          <p>Collected examples: {trainingData.xs.length}</p>
          <Button onClick={() => setShowTrainModal(true)} variant={"outline"}>
            Train classifier (15 epochs)
          </Button>
          <Button
            onClick={saveModelToSupabase}
            variant={"outline"}
            style={{ marginLeft: 8 }}
          >
            Save model to Supabase
          </Button>
          <Button
            onClick={() => reloadClassifierFrom()}
            variant={"outline"}
            style={{ marginLeft: 8 }}
          >
            Reload classifier from Supabase
          </Button>
        </div>
      </div>

      {/* Training Modal */}
      <Dialog open={showTrainModal} onOpenChange={setShowTrainModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Train Classifier</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to train the classifier with{" "}
            {trainingData.xs.length} examples? This may take a few seconds.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTrainModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleTrainConfirm}>Confirm & Train</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CustomPageLayout>
  );
}
