import React from "react";
import { X, ZoomIn } from "lucide-react";

interface ImageViewModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageViewModal: React.FC<ImageViewModalProps> = ({
  imageUrl,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <ZoomIn className="w-4 h-4 text-cyan-400" />
            <span>Screen Snapshot Preview</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-2 overflow-auto flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Expanded Screenshot"
            className="max-h-[80vh] w-auto object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
