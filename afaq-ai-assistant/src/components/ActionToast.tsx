import React from "react";
import { Terminal, CheckCircle2, AlertCircle } from "lucide-react";

interface ActionToastProps {
  toast: {
    id: string;
    message: string;
    type?: "info" | "success" | "error";
  } | null;
  onDismiss: () => void;
}

export const ActionToast: React.FC<ActionToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div
        onClick={onDismiss}
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md cursor-pointer transition-transform hover:scale-105 ${
          toast.type === "error"
            ? "bg-rose-950/90 border-rose-700/80 text-rose-200"
            : toast.type === "success"
            ? "bg-emerald-950/90 border-emerald-700/80 text-emerald-200"
            : "bg-slate-900/90 border-cyan-500/60 text-cyan-200"
        }`}
      >
        {toast.type === "error" ? (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        ) : toast.type === "success" ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
        )}
        <span className="text-xs font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
