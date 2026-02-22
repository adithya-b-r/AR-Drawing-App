"use client";

import { useState, useRef, useEffect } from "react";
import { useGesture } from "@use-gesture/react";
// @ts-ignore
import createPersp from "perspective-transform";
import { UploadedImage } from "@/app/page";

interface ImageOverlayProps {
  image: UploadedImage;
  isActive: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<UploadedImage>) => void;
  isWarpMode?: boolean;
}

export default function ImageOverlay({ image, isActive, onSelect, onUpdate, isWarpMode }: ImageOverlayProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useGesture(
    {
      onDragStart: () => onSelect(),
      onDrag: ({ offset: [x, y] }) => {
        setPosition({ x, y });
      },
      onPinchStart: () => onSelect(),
      onPinch: ({ offset: [scale, angle] }) => {
        // useGesture pinch provides scale factor and rotation angle
        onUpdate({ scale: scale, rotation: angle });
      }
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
      drag: { from: () => [position.x, position.y] },
      pinch: {
        from: () => [image.scale, image.rotation]
      },
      enabled: !isWarpMode // Disable global drag/pinch while warping corners
    }
  );

  let transformMatrix = "";
  if (image.warpCorners && naturalSize.w > 0 && naturalSize.h > 0) {
    const { tl, tr, br, bl } = image.warpCorners;
    const srcPts = [0, 0, naturalSize.w, 0, naturalSize.w, naturalSize.h, 0, naturalSize.h];
    const dstPts = [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y];
    try {
      const transform = createPersp(srcPts, dstPts);
      const [t0, t1, t2, t3, t4, t5, t6, t7, t8] = transform.coeffs;
      transformMatrix = `matrix3d(${t0}, ${t3}, 0, ${t6}, ${t1}, ${t4}, 0, ${t7}, 0, 0, 1, 0, ${t2}, ${t5}, 0, ${t8})`;
    } catch (e) {
      console.error("Warp error", e);
    }
  }

  const corners = image.warpCorners || {
    tl: { x: 0, y: 0 },
    tr: { x: naturalSize.w, y: 0 },
    br: { x: naturalSize.w, y: naturalSize.h },
    bl: { x: 0, y: naturalSize.h }
  };

  const updateCorner = (corner: 'tl' | 'tr' | 'br' | 'bl', dx: number, dy: number) => {
    onUpdate({
      warpCorners: {
        ...corners,
        [corner]: { x: corners[corner].x + dx, y: corners[corner].y + dy }
      }
    });
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none">
      <div
        ref={containerRef}
        className={`relative pointer-events-auto touch-none animate-in zoom-in-75 fade-in duration-300 ease-out ${isActive ? 'ring-2 ring-blue-500 rounded-lg ring-offset-2 ring-offset-transparent' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${image.scale}) rotate(${image.rotation}deg)`,
          opacity: image.opacity,
          transition: isActive ? "none" : "opacity 0.2s ease-in-out, transform-origin 0.2s" // Disable transition during active pinch/drag for smoothness
        }}
      >
        <div className="relative">
          <img
            src={image.url}
            alt="Uploaded Overlay"
            className="max-w-none pointer-events-none"
            style={{
              filter: image.grayscale ? 'grayscale(100%)' : 'none',
              transition: 'filter 0.2s ease-in-out',
              transform: transformMatrix ? transformMatrix : 'none',
              transformOrigin: '0 0'
            }}
            onLoad={(e) => {
              setNaturalSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
            }}
          />
          {isWarpMode && naturalSize.w > 0 && (
            <>
              <WarpHandle x={corners.tl.x} y={corners.tl.y} onDrag={(dx, dy) => updateCorner('tl', dx, dy)} />
              <WarpHandle x={corners.tr.x} y={corners.tr.y} onDrag={(dx, dy) => updateCorner('tr', dx, dy)} />
              <WarpHandle x={corners.br.x} y={corners.br.y} onDrag={(dx, dy) => updateCorner('br', dx, dy)} />
              <WarpHandle x={corners.bl.x} y={corners.bl.y} onDrag={(dx, dy) => updateCorner('bl', dx, dy)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const WarpHandle = ({ x, y, onDrag }: { x: number, y: number, onDrag: (dx: number, dy: number) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useGesture({
    onDrag: ({ delta: [dx, dy] }) => onDrag(dx, dy)
  }, { target: ref, eventOptions: { passive: false } });

  return (
    <div
      ref={ref}
      className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white pointer-events-auto touch-none shadow-[0_0_10px_rgba(0,0,0,0.5)] z-50 transform -translate-x-1/2 -translate-y-1/2 cursor-move"
      style={{ left: x, top: y }}
    />
  );
}
