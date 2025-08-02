"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt?: string;
  onClose: () => void;
}

export default function ImageModal({
  isOpen,
  imageSrc,
  imageAlt = "Full screen preview",
  onClose,
}: ImageModalProps) {
  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to constrain position within bounds
  const constrainPosition = (
    newPosition: { x: number; y: number },
    currentZoom: number
  ) => {
    if (!containerRef.current || !imageRef.current) return newPosition;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate the scaled image dimensions
    const imageWidth =
      imageRef.current.naturalWidth || imageRef.current.clientWidth;
    const imageHeight =
      imageRef.current.naturalHeight || imageRef.current.clientHeight;

    // Calculate how the image is actually displayed (considering object-contain)
    const imageAspect = imageWidth / imageHeight;
    const containerAspect = containerWidth / containerHeight;

    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayWidth = containerWidth;
      displayHeight = containerWidth / imageAspect;
    } else {
      displayWidth = containerHeight * imageAspect;
      displayHeight = containerHeight;
    }

    const scaledWidth = displayWidth * currentZoom;
    const scaledHeight = displayHeight * currentZoom;

    // Calculate maximum allowed translation
    const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);

    return {
      x: Math.max(-maxX, Math.min(maxX, newPosition.x)),
      y: Math.max(-maxY, Math.min(maxY, newPosition.y)),
    };
  };

  // Reset zoom and position when modal opens/closes
  const handleClose = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setLastTouch(null);
    setIsImageLoading(true);
    setImageLoadError(false);
    onClose();
  };

  // Image load handlers
  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageLoadError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageLoadError(true);
  };

  // Zoom functions
  const handleZoomIn = () => {
    setZoom((prev) => {
      const newZoom = Math.min(prev * 1.5, 5);
      setPosition((current) => constrainPosition(current, newZoom));
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev / 1.5, 0.5);
      setPosition((current) => constrainPosition(current, newZoom));
      return newZoom;
    });
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Touch/Mouse handlers for pan and zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && lastTouch && zoom > 1) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - lastTouch.x;
      const deltaY = e.touches[0].clientY - lastTouch.y;

      setPosition((prev) => {
        const newPosition = {
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        };
        return constrainPosition(newPosition, zoom);
      });

      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouch(null);
  };

  // Double tap to zoom
  const handleDoubleClick = () => {
    if (zoom === 1) {
      setZoom(2);
      setPosition({ x: 0, y: 0 });
    } else {
      resetZoom();
    }
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setLastTouch({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && lastTouch && zoom > 1) {
      e.preventDefault();
      const deltaX = e.clientX - lastTouch.x;
      const deltaY = e.clientY - lastTouch.y;

      setPosition((prev) => {
        const newPosition = {
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        };
        return constrainPosition(newPosition, zoom);
      });

      setLastTouch({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setLastTouch(null);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => {
      const newZoom = Math.min(Math.max(prev * delta, 0.5), 5);
      setPosition((current) => constrainPosition(current, newZoom));
      return newZoom;
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Control buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Button
            onClick={handleZoomIn}
            variant="ghost"
            className="h-10 w-10 p-0 text-white bg-black/50 hover:bg-black/70 rounded-full"
            aria-label="Zoom in"
          >
            <ZoomIn size={20} />
          </Button>
          <Button
            onClick={handleZoomOut}
            variant="ghost"
            className="h-10 w-10 p-0 text-white bg-black/50 hover:bg-black/70 rounded-full"
            aria-label="Zoom out"
          >
            <ZoomOut size={20} />
          </Button>
          <Button
            onClick={resetZoom}
            variant="ghost"
            className="h-10 w-10 p-0 text-white bg-black/50 hover:bg-black/70 rounded-full"
            aria-label="Reset zoom"
          >
            <RotateCcw size={20} />
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            className="h-10 w-10 p-0 text-white bg-black/50 hover:bg-black/70 rounded-full"
            aria-label="Close"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Loading state */}
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-lg font-medium">Please wait...</div>
          </div>
        )}

        {/* Error state */}
        {imageLoadError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-lg font-medium">
              Failed to load image
            </div>
          </div>
        )}

        {/* Zoomable image container */}
        <div className="w-full h-full flex items-center justify-center">
          <Image
            ref={imageRef}
            src={imageSrc}
            alt={imageAlt}
            width={1200}
            height={1200}
            className={`max-w-full max-h-full object-contain transition-transform duration-200 select-none ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            style={{
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "pointer",
              transformOrigin: "center center",
            }}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            onLoad={handleImageLoad}
            onError={handleImageError}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
