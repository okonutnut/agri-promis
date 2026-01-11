"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState, useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import dynamic from "next/dynamic";
const ImageModal = dynamic(() => import("@/components/ui/image-modal"), {
  ssr: false,
});

type ImageCarouselProps = {
  images: string[]; // Array of image URLs
};

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Added a fallback card for when there are no images in the carousel
  return (
    <>
      {images && images.length > 0 ? (
        <Carousel className="mx-auto p-1 my-0" setApi={setApi}>
          {/* Progress indicator lines */}
          {images.length > 1 && (
            <div className="flex gap-1 mb-2 px-4">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                    index <= current ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
          <CarouselContent className="relative h-full">
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity h-[20vh] flex items-center justify-center"
                  onClick={() => handleImageClick(image)}
                >
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-[20vh] w-auto object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="min-w-[128px] max-w-[200px] h-50 mx-auto mt-2">
          <div className="h-full w-full flex flex-col items-center justify-center border-2 border-dashed shadow-none">
            <p className="text-xs text-gray-500 text-center">
              No Photo Documentation Attached
            </p>
          </div>
        </div>
      )}
      {selectedImage && (
        <ImageModal
          imageSrc={selectedImage}
          isOpen={!!selectedImage}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
