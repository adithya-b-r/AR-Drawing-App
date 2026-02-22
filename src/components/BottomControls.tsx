"use client";

import { useState, useRef } from "react";
import { SlidersHorizontal, Maximize, Camera, ImagePlus, Flashlight } from "lucide-react";

interface BottomControlsProps {
  opacity: number;
  setOpacity: (val: number) => void;
  scale: number;
  setScale: (val: number) => void;
  facingMode: "environment" | "user";
  setFacingMode: (val: "environment" | "user") => void;
  flashlightOn: boolean;
  setFlashlightOn: (val: boolean) => void;
  onImageUpload: (files: FileList) => void;
}

type ActivePanel = "opacity" | "scale" | null;

export default function BottomControls({
  opacity,
  setOpacity,
  scale,
  setScale,
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
                <span className="text-white/60">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-white h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {activePanel === "scale" && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Scale</span>
                <span className="text-white/60">{scale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-white h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Control Pill */}
      <div className="w-full bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl rounded-full p-2 flex justify-between items-center shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">

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
          icon={<Camera size={22} />}
          label="Toggle"
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
