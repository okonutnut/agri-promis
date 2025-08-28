"use client";

import { Button } from "@/components/ui/button";
import { Sparkle, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type AnalyzeImageButtonProps = {
  imageSrc?: string;
};
export default function AnalyzeImageButton({
  imageSrc,
}: AnalyzeImageButtonProps) {
  const [isAIFeatureEnabled] = useState(navigator.onLine);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  console.log("Image Source:", imageSrc);

  // 2. function for showing drawer with delay
  const showDrawer = async () => {
    setIsAnalyzing(true);

    // Simulate 2-second delay for AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsAnalyzing(false);
    setIsDrawerOpen(true);
  };

  return (
    <>
      {isAIFeatureEnabled && (
        <Button
          onClick={showDrawer}
          variant="ghost"
          className="h-10 w-10 p-0 text-white bg-black/50 hover:bg-black/70 rounded-full"
          aria-label="Analyze Image"
          disabled={isAnalyzing}
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
            <DrawerTitle className="text-lg">Fall Armyworm</DrawerTitle>
            <DrawerDescription>
              Caterpillar pest that feeds on many crops, but corn is its
              favorite.
            </DrawerDescription>
          </DrawerHeader>
          <strong>Possible Solution:</strong>
          Apply biopesticides like Bacillus thuringiensis (Bt) or neem-based
          extracts.
        </DrawerContent>
      </Drawer>
    </>
  );
}
