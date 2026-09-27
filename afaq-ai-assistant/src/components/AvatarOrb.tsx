import React from "react";
import { AssistantStatus } from "../types/assistant";
import { Sparkles, Mic, BrainCircuit, Volume2, Scan } from "lucide-react";

interface AvatarOrbProps {
  status: AssistantStatus;
  onClick?: () => void;
  statusText?: string;
}

export const AvatarOrb: React.FC<AvatarOrbProps> = ({
  status,
  onClick,
  statusText,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "listening":
        return {
          label: "Listening...",
          sublabel: "Speak now, I'm hearing you",
          colorScheme: "from-blue-500 via-indigo-500 to-cyan-400",
          glowColor: "rgba(59, 130, 246, 0.65)",
          icon: <Mic className="w-9 h-9 text-cyan-200 animate-pulse" />,
          borderColor: "border-cyan-400/80",
          pulseSpeed: "duration-700",
        };
      case "thinking":
        return {
          label: "Thinking...",
          sublabel: "Processing with Gemini",
          colorScheme: "from-purple-600 via-pink-600 to-indigo-600",
          glowColor: "rgba(168, 85, 247, 0.7)",
          icon: <BrainCircuit className="w-9 h-9 text-purple-200 animate-spin" />,
          borderColor: "border-purple-400/80",
          pulseSpeed: "duration-1000",
        };
      case "speaking":
        return {
          label: "Speaking...",
          sublabel: "Click Stop to pause speech",
          colorScheme: "from-emerald-500 via-teal-400 to-cyan-500",
          glowColor: "rgba(16, 185, 129, 0.7)",
          icon: <Volume2 className="w-9 h-9 text-emerald-200 animate-bounce" />,
          borderColor: "border-emerald-400/80",
          pulseSpeed: "duration-500",
        };
      case "vision":
        return {
          label: "Computer Vision",
          sublabel: "Analyzing your desktop screen",
          colorScheme: "from-amber-500 via-rose-500 to-orange-500",
          glowColor: "rgba(245, 158, 11, 0.7)",
          icon: <Scan className="w-9 h-9 text-amber-200 animate-pulse" />,
          borderColor: "border-amber-400/80",
          pulseSpeed: "duration-800",
        };
      case "ready":
      default:
        return {
          label: "Ready",
          sublabel: "How can I help you today?",
          colorScheme: "from-cyan-500 via-blue-600 to-indigo-700",
          glowColor: "rgba(6, 182, 212, 0.45)",
          icon: <Sparkles className="w-9 h-9 text-cyan-200" />,
          borderColor: "border-cyan-500/50",
          pulseSpeed: "duration-2000",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex flex-col items-center justify-center py-4 select-none relative">
      {/* Outer ambient glow */}
      <div
        className="absolute w-56 h-56 rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-10"
        style={{
          background: config.glowColor,
          opacity: status === "ready" ? 0.35 : 0.75,
          transform: status === "listening" || status === "speaking" ? "scale(1.2)" : "scale(1)",
        }}
      />

      {/* Main Avatar Container */}
      <div className="relative group cursor-pointer" onClick={onClick} title="Click to interact">
        {/* Animated Outer Orbit Ring 1 */}
        <div
          className={`absolute -inset-4 rounded-full border border-dashed ${
            status === "thinking"
              ? "border-purple-400 animate-spin-slow opacity-80"
              : status === "listening"
              ? "border-cyan-400 animate-ping opacity-40"
              : status === "vision"
              ? "border-amber-400 animate-pulse opacity-80"
              : "border-cyan-500/30 animate-spin-slow opacity-40"
          }`}
        />

        {/* Animated Orbit Ring 2 */}
        <div
          className={`absolute -inset-2 rounded-full border ${
            status === "speaking"
              ? "border-emerald-400 animate-pulse-ring opacity-90"
              : "border-indigo-400/40 animate-spin-reverse opacity-40"
          }`}
        />

        {/* Dynamic Glowing Rings when Active */}
        {(status === "listening" || status === "speaking" || status === "thinking") && (
          <>
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-500 opacity-70 blur-md animate-pulse" />
            <span className="absolute -inset-3 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 opacity-40 blur-lg animate-ping" />
          </>
        )}

        {/* Central Orb */}
        <div
          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${config.colorScheme} p-1 shadow-2xl transition-all duration-500 transform group-hover:scale-105 flex items-center justify-center`}
          style={{
            boxShadow: `0 0 35px ${config.glowColor}, inset 0 0 20px rgba(255,255,255,0.2)`,
          }}
        >
          {/* Inner glass sphere */}
          <div className="w-full h-full rounded-full bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden border border-white/20">
            {/* Holographic light sweep */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent transform -rotate-45 translate-y-[-100%] animate-pulse" />

            {/* Central Icon */}
            <div className="relative z-10 transition-transform duration-300">
              {config.icon}
            </div>

            {/* Speaking audio wave bars */}
            {status === "speaking" && (
              <div className="absolute bottom-3 flex items-center gap-1 z-10">
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                <span className="w-1 h-5 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                <span className="w-1 h-4 bg-emerald-200 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
              </div>
            )}

            {/* Vision scan line */}
            {status === "vision" && (
              <div className="absolute inset-x-0 h-1 bg-amber-300 shadow-[0_0_8px_#f59e0b] animate-bounce" />
            )}
          </div>
        </div>
      </div>

      {/* Status Badges */}
      <div className="mt-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-md backdrop-blur-md">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              status === "ready"
                ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                : status === "listening"
                ? "bg-blue-400 animate-ping"
                : status === "thinking"
                ? "bg-purple-400 animate-pulse"
                : status === "speaking"
                ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                : "bg-amber-400 animate-ping"
            }`}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            {config.label}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">
          {statusText || config.sublabel}
        </p>
      </div>
    </div>
  );
};
