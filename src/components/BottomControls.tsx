"use client";

import { useState, useRef } from "react";
import { SlidersHorizontal, Maximize, Camera, ImagePlus, Flashlight, RotateCw, Palette } from "lucide-react";

import { UploadedImage } from "@/app/page";

interface BottomControlsProps {
  activeImage: UploadedImage | null;
  onUpdateImage: (id: string, updates: Partial<UploadedImage>) => void;
  facingMode: "environment" | "user";
  setFacingMode: (val: "environment" | "user") => void;
  flashlightOn: boolean;
  setFlashlightOn: (val: boolean) => void;
  onImageUpload: (files: FileList) => void;
}

type ActivePanel = "opacity" | "scale" | "rotate" | null;

export default function BottomControls({
  activeImage,
  onUpdateImage,
  facingMode,
  setFacingMode,
  flashlightOn,
  setFlashlightOn,
  onImageUpload
}: BottomControlsProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files);
    }
    // reset input so the same files can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 w-[90%] max-w-sm">

      {/* Dynamic Floating Panel for Sliders */}
      {activePanel && (
        <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white animate-in slide-in-from-bottom-2 fade-in duration-200 transition-all">

          {activePanel === "opacity" && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Opacity</span>
                <span className="text-white/60">
                  {activeImage ? `${Math.round(activeImage.opacity * 100)}%` : "N/A"}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={activeImage ? activeImage.opacity : 0.5}
                disabled={!activeImage}
                onChange={(e) => activeImage && onUpdateImage(activeImage.id, { opacity: parseFloat(e.target.value) })}
                className="w-full accent-white h-2 bg-white/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>
          )}

          {activePanel === "scale" && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Scale</span>
                <span className="text-white/60">
                  {activeImage ? `${activeImage.scale.toFixed(1)}x` : "N/A"}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={activeImage ? activeImage.scale : 1.0}
                disabled={!activeImage}
                onChange={(e) => activeImage && onUpdateImage(activeImage.id, { scale: parseFloat(e.target.value) })}
                className="w-full accent-white h-2 bg-white/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>
          )}

          {activePanel === "rotate" && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Rotation</span>
                <span className="text-white/60">
                  {activeImage ? `${activeImage.rotation}°` : "N/A"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={activeImage ? activeImage.rotation : 0}
                disabled={!activeImage}
                onChange={(e) => activeImage && onUpdateImage(activeImage.id, { rotation: parseInt(e.target.value) })}
                className="w-full accent-white h-2 bg-white/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Control Pill - Make it horizontally scrollable on smallest screens if needed */}
      <div className="w-full max-w-full overflow-x-auto no-scrollbar mask-edges">
        <div className="flex gap-2 w-max mx-auto bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl rounded-full p-2 items-center shadow-lg border border-white/20 dark:border-white/10">

          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <ControlButton
            icon={<ImagePlus size={22} />}
            label="Gallery"
            onClick={() => fileInputRef.current?.click()}
          />

          <ControlButton
            icon={<SlidersHorizontal size={22} />}
            label="Opacity"
            isActive={activePanel === "opacity"}
            onClick={() => togglePanel("opacity")}
          />

          <ControlButton
            icon={<Maximize size={22} />}
            label="Scaling"
            isActive={activePanel === "scale"}
            onClick={() => togglePanel("scale")}
          />

          <ControlButton
            icon={<RotateCw size={22} />}
            label="Rotate"
            isActive={activePanel === "rotate"}
            onClick={() => togglePanel("rotate")}
          />

          <ControlButton
            icon={<Palette size={22} />}
            label="B&W"
            isActive={activeImage ? activeImage.grayscale : false}
            onClick={() => activeImage && onUpdateImage(activeImage.id, { grayscale: !activeImage.grayscale })}
          />

          <div className="w-[1px] h-8 bg-black/10 dark:bg-white/10 mx-1"></div>

          <ControlButton
            icon={<Camera size={22} />}
            label="Lens"
            onClick={() => setFacingMode(facingMode === "environment" ? "user" : "environment")}
          />

          <ControlButton
            icon={<Flashlight size={22} />}
            label="Flash"
            isActive={flashlightOn}
            onClick={() => setFlashlightOn(!flashlightOn)}
          />

        </div>
      </div>
    </div>
  );
}

// Helper component for individual buttons
function ControlButton({
  icon,
  label,
  onClick,
  isActive = false
}: {
  icon: React.ReactNode,
  label: string,
  onClick: () => void,
  isActive?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-full transition-all duration-200 active:scale-95 ${isActive
        ? "bg-black text-white dark:bg-white dark:text-black"
        : "text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
        }`}
    >
      <div className={`${isActive ? "" : "text-black dark:text-white"}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-tight">
        {label}
      </span>
    </button>
  );
}
