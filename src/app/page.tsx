"use client";

import { useState } from "react";
import CameraFeed from "@/components/CameraFeed";
import ImageOverlay from "@/components/ImageOverlay";
import BottomControls from "@/components/BottomControls";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.5);
  const [scale, setScale] = useState(1.0);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [flashlightOn, setFlashlightOn] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden">
      {/* Background Camera Feed */}
      <CameraFeed facingMode={facingMode} flashlightOn={flashlightOn} />

      {/* Overlay Image */}
      {uploadedImage && (
        <ImageOverlay imageUrl={uploadedImage} opacity={opacity} scale={scale} />
      )}

      {/* Intro/Upload overlay when no image */}
      {!uploadedImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-md">AR Drawing</h1>
          <p className="text-white drop-shadow-md">Upload a sketch to begin</p>
        </div>
      )}

      {/* Bottom Controls */}
      <BottomControls
        opacity={opacity}
        setOpacity={setOpacity}
        scale={scale}
        setScale={setScale}
        facingMode={facingMode}
        setFacingMode={setFacingMode}
        flashlightOn={flashlightOn}
        setFlashlightOn={setFlashlightOn}
        onImageUpload={(file) => {
          const url = URL.createObjectURL(file);
          setUploadedImage(url);
        }}
      />
    </main>
  );
}
