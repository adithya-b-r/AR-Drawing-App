"use client";

import { useEffect, useRef, useState } from "react";

interface CameraFeedProps {
  facingMode: "environment" | "user";
  flashlightOn: boolean;
}

export default function CameraFeed({ facingMode, flashlightOn }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  // To keep track of the active track, useful for toggling flashlight
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isActive = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("Camera API not supported in this browser");
          return;
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!isActive) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        activeStream = stream;
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setError(null);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Failed to access camera. Please ensure permissions are granted.");
      }
    }

    startCamera();

    return () => {
      isActive = false;
      if (activeStream) {
        activeStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      streamRef.current = null;
    };
  }, [facingMode]);

  // Handle flashlight toggle
  useEffect(() => {
    const applyFlashlight = async () => {
      if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];

        // Check if torch is supported by the track capabilities
        const capabilities = typeof videoTrack.getCapabilities === "function"
          ? videoTrack.getCapabilities()
          : {};

        // We ts-ignore since TS standard lib sometimes misses latest MediaTrack capabilities
        // @ts-ignore
        if (capabilities.torch) {
          try {
            await videoTrack.applyConstraints({
              advanced: [{ torch: flashlightOn }] as any
            });
          } catch (err) {
            console.error("Failed to toggle flashlight", err);
          }
        } else if (flashlightOn) {
          console.warn("Flashlight (torch) not supported on this device/camera.");
        }
      }
    };

    applyFlashlight();
  }, [flashlightOn, streamRef.current]);

  return (
    <div className="absolute inset-0 z-0 bg-zinc-900 pointer-events-none overflow-hidden">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-red-500/20 text-red-200 p-4 rounded-xl backdrop-blur-md text-center">
            {error}
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-transform duration-300 ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
      />
    </div>
  );
}
