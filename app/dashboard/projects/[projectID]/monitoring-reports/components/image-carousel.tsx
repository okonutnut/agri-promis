import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState, useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import ImageModal from "@/components/ui/image-modal";

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

  return (
    <>
      <Carousel className="mx-auto" setApi={setApi}>
        {/* Progress indicator lines */}
        <div className="flex gap-1 mb-4 px-4">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                index <= current ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="object-contain mx-auto"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

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
