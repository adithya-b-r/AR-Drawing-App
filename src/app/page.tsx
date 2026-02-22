"use client";

import { useState } from "react";
import CameraFeed from "@/components/CameraFeed";
import ImageOverlay from "@/components/ImageOverlay";
import BottomControls from "@/components/BottomControls";

export interface UploadedImage {
  id: string;
  url: string;
  opacity: number;
  scale: number;
  rotation: number;
  grayscale: boolean;
}

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [flashlightOn, setFlashlightOn] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden">
      {/* Background Camera Feed */}
      <CameraFeed facingMode={facingMode} flashlightOn={flashlightOn} />

      {/* Overlay Images */}
      {uploadedImages.map((img) => (
        <ImageOverlay
          key={img.id}
          image={img}
          isActive={activeImageId === img.id}
          onSelect={() => setActiveImageId(img.id)}
        />
      ))}

      {/* Intro/Upload overlay when no images */}
      {uploadedImages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-md">AR Drawing</h1>
          <p className="text-white drop-shadow-md">Upload sketch(es) to begin</p>
        </div>
      )}

      {/* Bottom Controls */}
      <BottomControls
        activeImage={uploadedImages.find(img => img.id === activeImageId) || null}
        onUpdateImage={(id: string, updates: Partial<UploadedImage>) => {
          setUploadedImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img));
        }}
        facingMode={facingMode}
        setFacingMode={setFacingMode}
        flashlightOn={flashlightOn}
        setFlashlightOn={setFlashlightOn}
        onImageUpload={(files: FileList) => {
          const newImages: UploadedImage[] = Array.from(files).map((f) => ({
            id: Math.random().toString(36).substring(2, 9),
            url: URL.createObjectURL(f),
            opacity: 0.5,
            scale: 1.0,
            rotation: 0,
            grayscale: false,
          }));

          setUploadedImages(prev => [...prev, ...newImages]);

          if (newImages.length > 0) {
            setActiveImageId(newImages[newImages.length - 1].id);
          }
        }}
      />
    </main>
  );
}
