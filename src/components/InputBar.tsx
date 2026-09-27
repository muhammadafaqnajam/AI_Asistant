import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Send,
  Square,
  Camera,
  PlusCircle,
  Volume2,
  VolumeX,
  Languages,
} from "lucide-react";
import { AssistantStatus, SupportedLanguage } from "../types/assistant";

interface InputBarProps {
  status: AssistantStatus;
  onSendMessage: (text: string) => void;
  onToggleMic: () => void;
  onStop: () => void;
  onOpenScreenModal: () => void;
  onNewChat: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  language: SupportedLanguage;
  onCycleLanguage: () => void;
  isListening: boolean;
  isSpeaking: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({
  status,
  onSendMessage,
  onToggleMic,
  onStop,
  onOpenScreenModal,
  onNewChat,
  autoSpeak,
  onToggleAutoSpeak,
  language,
  onCycleLanguage,
  isListening,
  isSpeaking,
}) => {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Auto resize
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        140
      )}px`;
    }
  };

  const getLanguageLabel = () => {
    switch (language) {
      case "roman_urdu":
        return "Roman Urdu";
      case "urdu":
        return "اردو";
      case "english":
        return "English";
      default:
        return "Auto Lang";
    }
  };

  return (
    <div className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-3 sm:p-4 z-20">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Main Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 bg-slate-900/90 border border-slate-700/80 focus-within:border-cyan-500/80 rounded-2xl p-2 transition-all shadow-lg"
        >
          {/* Microphone Button */}
          <button
            type="button"
            onClick={onToggleMic}
            className={`p-3 rounded-xl transition-all relative shrink-0 ${
              isListening
                ? "bg-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.8)] animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300"
            }`}
            title={isListening ? "Listening... (Click to stop)" : "Click to speak"}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
              </>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Textarea Input */}
          <textarea
            ref={inputRef}
            rows={1}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Listening to your voice..."
                : language === "urdu"
                ? "یہاں کچھ بھی پوچھیں، اردو، انگریزی یا رومن اردو میں..."
                : "Ask me anything in English, Roman Urdu or Urdu..."
            }
            className={`w-full bg-transparent resize-none outline-none text-slate-100 text-sm placeholder:text-slate-500 py-2.5 px-2 max-h-36 ${
              language === "urdu" ? "font-urdu text-right text-base" : ""
            }`}
          />

          {/* Action Buttons: Stop Speaking & Send */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Stop Speaking / Abort Button */}
            {(isSpeaking || status === "thinking" || isListening) && (
              <button
                type="button"
                onClick={onStop}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-700 transition-colors"
                title="Stop speaking or cancel"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || status === "thinking"}
              className={`p-2.5 rounded-xl transition-all shadow-md ${
                inputText.trim() && status !== "thinking"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Feature Action Bar: Analyze Screen, New Chat, Voice Mode, Language */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          {/* Left quick action buttons */}
          <div className="flex items-center gap-2">
            {/* See My Computer / Screen Analysis */}
            <button
              type="button"
              onClick={onOpenScreenModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/60 transition-all font-medium shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              title="See My Computer: Analyze your screen with Gemini Vision"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>📷 Analyze Screen</span>
            </button>

            {/* New Chat */}
            <button
              type="button"
              onClick={onNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors font-medium"
              title="Start a new conversation"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>🆕 New Chat</span>
            </button>
          </div>

          {/* Right quick options */}
          <div className="flex items-center gap-2">
            {/* Language Cycle */}
            <button
              type="button"
              onClick={onCycleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="Switch language preference: Auto, English, Roman Urdu, Urdu"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">{getLanguageLabel()}</span>
            </button>

            {/* Voice Mode Quick Toggle */}
            <button
              type="button"
              onClick={onToggleAutoSpeak}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all border ${
                autoSpeak
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
              title={autoSpeak ? "Voice feedback is ON" : "Voice feedback is OFF"}
            >
              {autoSpeak ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className="text-[11px]">🔊 Voice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
