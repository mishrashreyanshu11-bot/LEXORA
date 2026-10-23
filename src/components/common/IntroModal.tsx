import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vellum Introduction"
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 cursor-pointer ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Dimmed backdrop with ethereal cyan tint */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity" />

      {/* Intro Graphic Container: Dedicated presentation of the user's intro asset */}
      <div
        onClick={(e) => {
          // Allow clicking the card itself to enter as well
          e.stopPropagation();
          onClose();
        }}
        className={`relative w-full max-w-lg md:max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-cyan-200/60 transition-all duration-300 transform select-none cursor-pointer group ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-3'
        }`}
      >
        {/* Subtle ambient cyan glow behind the image */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#26f7db]/20 via-cyan-100/30 to-[#26f7db]/20 blur-xl pointer-events-none" />

        {/* Minimal close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Enter Vellum"
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 hover:text-slate-950 flex items-center justify-center backdrop-blur-sm transition-all duration-150"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Pure Intro Graphic: Vellum with cyan dot and cyan underline on cloudy backdrop */}
        <div className="relative p-2 sm:p-3 bg-gradient-to-b from-[#e8faf8] via-[#f4fcfa] to-white flex flex-col items-center justify-center">
          <img
            src="/assets/aistudio/IMG_6030_ebc65a86.jpeg"
            alt="Vellum"
            className="w-full h-auto rounded-2xl object-contain shadow-xs transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Minimal unobtrusive entry cue */}
          <div className="pt-2 pb-1.5 flex items-center justify-center gap-1.5 text-[11px] font-medium tracking-widest uppercase text-slate-400 group-hover:text-slate-700 transition-colors">
            <span>Click anywhere to enter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
