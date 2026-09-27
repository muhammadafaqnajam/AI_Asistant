import React from "react";
import {
  Settings,
  BookOpen,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { AssistantStatus } from "../types/assistant";

interface TitleBarProps {
  status: AssistantStatus;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  onClearChat: () => void;
  messageCount: number;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  status,
  autoSpeak,
  onToggleAutoSpeak,
  onOpenSettings,
  onOpenGuide,
  onClearChat,
  messageCount,
}) => {
  return (
    <header className="h-14 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between px-4 select-none z-20">
      {/* Left: Window Dots & App Title */}
      <div className="flex items-center gap-3">
        {/* macOS / Desktop Style Traffic Dots */}
        <div className="flex items-center gap-1.5 mr-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors shadow-sm" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Afaq AI Assistant</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-mono">
                v1.0
              </span>
            </h1>
          </div>
        </div>

        {/* Security & Brain Pill */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 border-l border-slate-800 pl-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] text-slate-400">Gemini Brain</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Voice Auto-Speak Toggle */}
        <button
          onClick={onToggleAutoSpeak}
          title={autoSpeak ? "Voice output enabled (Click to mute)" : "Voice output muted (Click to enable)"}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            autoSpeak
              ? "bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
          }`}
        >
          {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{autoSpeak ? "Voice On" : "Muted"}</span>
        </button>

        {/* Beginner Guide / Documentation Button */}
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/60 text-xs font-semibold transition-all shadow-sm"
          title="Beginner Guide: Setup, Commands & How to run"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Beginner Guide</span>
        </button>

        {/* Clear Conversation */}
        {messageCount > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-900/50 text-xs font-medium transition-all"
            title="Clear Chat Conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          title="Open Settings"
        >
          <Settings className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </header>
  );
};
