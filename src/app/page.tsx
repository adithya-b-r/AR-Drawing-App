"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CameraFeed from "@/components/CameraFeed";
import ImageOverlay from "@/components/ImageOverlay";
import BottomControls from "@/components/BottomControls";
import ImageCropperModal from "@/components/ImageCropperModal";
import { toPng } from "html-to-image";

export interface UploadedImage {
  id: string;
  url: string;
  opacity: number;
  scale: number;
  rotation: number;
  grayscale: boolean;
  warpCorners?: {
    tl: { x: number, y: number },
    tr: { x: number, y: number },
    br: { x: number, y: number },
    bl: { x: number, y: number }
  };
}

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const [isWarpMode, setIsWarpMode] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Cropper State
  const [pendingImagesToCrop, setPendingImagesToCrop] = useState<File[]>([]);
  const [currentCropUrl, setCurrentCropUrl] = useState<string | null>(null);

  // Splash Screen Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2 seconds splash
    return () => clearTimeout(timer);
  }, []);

  // Local Storage Hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ar-drawing-state");
      if (stored) {
        setUploadedImages(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
    setIsHydrated(true);
  }, []);

  // Local Storage Saving
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ar-drawing-state", JSON.stringify(uploadedImages));
    } catch (e) {
      console.warn("Could not save to local storage (quota exceeded?)", e);
    }
  }, [uploadedImages, isHydrated]);

  // Effect to generate URL for current crop
  useEffect(() => {
    if (pendingImagesToCrop.length > 0 && !currentCropUrl) {
      setCurrentCropUrl(URL.createObjectURL(pendingImagesToCrop[0]));
    }
  }, [pendingImagesToCrop, currentCropUrl]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDrop(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDrop(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDrop(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    // Only accept image files
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    // Queue files for cropping
    setPendingImagesToCrop(prev => [...prev, ...imageFiles]);
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    const newImage: UploadedImage = {
      id: Math.random().toString(36).substring(2, 9),
      url: croppedDataUrl,
      opacity: 0.5,
      scale: 1.0,
      rotation: 0,
      grayscale: false,
    };

    setUploadedImages((prev) => [...prev, newImage]);
    setActiveImageId(newImage.id);

    if (currentCropUrl && currentCropUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentCropUrl);
    }
    setCurrentCropUrl(null);
    setPendingImagesToCrop(prev => prev.slice(1));
  };

  const handleCancelCrop = () => {
    if (currentCropUrl && currentCropUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentCropUrl);
    }
    setCurrentCropUrl(null);
    setPendingImagesToCrop(prev => prev.slice(1));
  };

  const handleSnapshot = async () => {
    if (!mainRef.current) return;
    try {
      const controls = mainRef.current.querySelector('.bottom-controls-bar');
      const splashOverlay = mainRef.current.querySelector('.splash-overlay');
      if (controls) (controls as HTMLElement).style.opacity = '0';
      if (splashOverlay) (splashOverlay as HTMLElement).style.opacity = '0';

      const dataUrl = await toPng(mainRef.current, {
        cacheBust: true,
        backgroundColor: '#000000',
      });

      if (controls) (controls as HTMLElement).style.opacity = '1';
      if (splashOverlay) (splashOverlay as HTMLElement).style.opacity = '1';

      const link = document.createElement("a");
      link.download = `ar-drawing-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Snapshot failed", e);
    }
  };

  if (showSplash) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700 ease-out">
          <Image src="/logo.png" alt="AR Drawing Logo" width={120} height={120} className="drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse" />
          <h1 className="mt-6 text-2xl font-semibold tracking-wide text-zinc-900 dark:text-white drop-shadow-lg opacity-90 transition-colors duration-300">AR Drawing</h1>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={mainRef}
      className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-100 dark:bg-black overflow-hidden transition-colors duration-300"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Background Camera Feed */}
      <CameraFeed facingMode={facingMode} flashlightOn={flashlightOn} />

      {/* Overlay Images */}
      {uploadedImages.map((img) => (
        <ImageOverlay
          key={img.id}
          image={img}
          isActive={activeImageId === img.id}
          onSelect={() => {
            setActiveImageId(img.id);
            if (!isWarpMode) setIsWarpMode(false);
          }}
          onUpdate={(updates) => setUploadedImages(prev => prev.map(i => i.id === img.id ? { ...i, ...updates } : i))}
          isWarpMode={isWarpMode && activeImageId === img.id}
        />
      ))}

      {/* Intro/Upload overlay when no images */}
      {uploadedImages.length === 0 && (
        <div className="splash-overlay absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none transition-opacity">
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md px-8 py-6 rounded-3xl border border-black/10 dark:border-white/10 flex flex-col items-center transition-colors duration-300">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 drop-shadow-md tracking-tight">AR Drawing</h1>
            <p className="text-zinc-600 dark:text-white/80 drop-shadow-md text-sm text-center">Tap the gallery icon <br /> or drop a sketch here</p>
          </div>
        </div>
      )}

      {/* Drag & Drop Visual Indication */}
      {isHoveringDrop && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-500/20 backdrop-blur-[2px] pointer-events-none transition-all duration-300">
          <div className="bg-black/60 backdrop-blur-xl border border-blue-400/50 rounded-2xl p-8 flex flex-col items-center animate-in zoom-in-95 duration-200">
            <Image src="/logo.png" alt="Upload" width={64} height={64} className="mb-4 opacity-80 mix-blend-screen" />
            <p className="text-white font-medium tracking-wide text-lg">Drop sketch to add</p>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <BottomControls
        activeImage={uploadedImages.find(img => img.id === activeImageId) || null}
        onUpdateImage={(id: string, updates: Partial<UploadedImage>) => {
          setUploadedImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img));
        }}
        onDeleteImage={(id: string) => {
          setUploadedImages(prev => {
            const next = prev.filter(img => img.id !== id);
            if (activeImageId === id) {
              setActiveImageId(next.length > 0 ? next[next.length - 1].id : null);
            }
            return next;
          });
        }}
        facingMode={facingMode}
        setFacingMode={setFacingMode}
        flashlightOn={flashlightOn}
        setFlashlightOn={setFlashlightOn}
        isWarpMode={isWarpMode}
        setIsWarpMode={setIsWarpMode}
        onImageUpload={(files: FileList) => handleFiles(Array.from(files))}
        onSnapshot={handleSnapshot}
      />

      {/* Cropper Modal */}
      {currentCropUrl && (
        <ImageCropperModal
          imageUrl={currentCropUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop} // Abort cropping and discard image
        />
      )}
    </main>
  );
}
