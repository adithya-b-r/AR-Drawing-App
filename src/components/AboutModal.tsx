"use client";

import { X, Github, Linkedin, Star } from "lucide-react";

interface AboutModalProps {
  onClose: () => void;
}

export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center pt-8 pb-6 px-6 relative overflow-hidden text-center">
          {/* Decorative backdrop glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white drop-shadow-sm mb-1 tracking-tight">AR Drawing</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-6">Designed & Developed by Adithya B.R.</p>

          <div className="flex gap-4 mb-8 w-full justify-center">
            <a
              href="https://github.com/adithya-b-r/AR-Drawing-App"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium text-sm flex-1 justify-center"
            >
              <Github size={18} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/adithya-br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0A66C2]/10 text-[#0A66C2] dark:bg-[#0A66C2]/20 dark:text-blue-300 hover:bg-[#0A66C2]/20 dark:hover:bg-[#0A66C2]/30 transition-colors font-medium text-sm flex-1 justify-center"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
          </div>

          <a
            href="https://github.com/adithya-b-r/AR-Drawing-App"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/25 group active:scale-[0.98]"
          >
            <Star size={18} className="text-yellow-400 group-hover:scale-110 transition-transform drop-shadow" fill="currentColor" />
            <span>Star this repo if you like it!</span>
          </a>
        </div>
      </div>
    </div>
  );
}
