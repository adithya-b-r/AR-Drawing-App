"use client";

import { useState, useRef } from "react";

interface ImageOverlayProps {
  imageUrl: string;
  opacity: number;
  scale: number;
}

export default function ImageOverlay({ imageUrl, opacity, scale }: ImageOverlayProps) {
  // Allow the user to drag the image around to align it with their paper
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    // Capture pointer events so we keep dragging even if pointer leaves the image
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none">
      <div
        className="relative pointer-events-auto touch-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          opacity: opacity,
          transition: "opacity 0.2s ease-in-out, transform-origin 0.2s"
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          src={imageUrl}
          alt="Overlay sketch"
          className="max-w-[80vw] max-h-[70vh] object-contain drop-shadow-2xl rounded-lg"
          draggable="false"
        />

        {/* Subtle grid lines could go here to aid perspective matching, omitting for now */}
      </div>
    </div>
  );
}
