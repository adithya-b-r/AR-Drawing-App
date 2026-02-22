"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check } from "lucide-react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperModalProps {
  imageUrl: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropperModal({ imageUrl, onCropComplete, onCancel }: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Helper to extract the cropped region as a base64 Data URL
  const getCroppedImg = (image: HTMLImageElement, crop: Crop): string => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return imageUrl;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL("image/png");
  };

  const handleConfirm = () => {
    if (completedCrop && imgRef.current && completedCrop.width > 0 && completedCrop.height > 0) {
      const croppedUrl = getCroppedImg(imgRef.current, completedCrop);
      onCropComplete(croppedUrl);
    } else if (imgRef.current) {
      const fullSizeUrl = getCroppedImg(imgRef.current, {
        unit: 'px',
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
        x: 0,
        y: 0
      });
      onCropComplete(fullSizeUrl);
    } else {
      onCropComplete(imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Crop Sketch</h2>
          <button onClick={onCancel} className="text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-black">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop preview"
              className="max-h-[60vh] object-contain"
              onLoad={(e) => {
                // Set default crop to center or full if needed
                const { width, height } = e.currentTarget;
                setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
              }}
            />
          </ReactCrop>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-white/10 bg-zinc-900 shrink-0">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl font-medium text-white/80 hover:bg-white/10 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Check size={18} />
            Apply Crop
          </button>
        </div>

      </div>
    </div>
  );
}
