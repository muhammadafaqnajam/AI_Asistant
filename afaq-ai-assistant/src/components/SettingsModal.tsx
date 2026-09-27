import React from "react";
import {
  X,
  Volume2,
  Languages,
  Brain,
  Shield,
  Trash2,
  Sliders,
  Check,
} from "lucide-react";
import { AppSettings, SupportedLanguage } from "../types/assistant";
import { voiceService } from "../services/voiceService";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearMemory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearMemory,
}) => {
  if (!isOpen) return null;

  const voices = voiceService.getAvailableVoices();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Assistant Settings</h2>
              <p className="text-xs text-slate-400">
                Configure voice, language, memory and security preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Section: Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>Language Preference</span>
            </div>
            <p className="text-slate-400">
              Afaq AI automatically detects your language, or you can lock a preferred format:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "auto", label: "Auto Detect" },
                { id: "english", label: "English" },
                { id: "roman_urdu", label: "Roman Urdu" },
                { id: "urdu", label: "اردو (Urdu)" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    onUpdateSettings({ language: item.id as SupportedLanguage })
                  }
                  className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                    settings.language === item.id
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-sm"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Section: Voice & Speech */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Voice & Speech Synthesis</span>
            </div>

            {/* Auto-Speak Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <div>
                <div className="font-semibold text-slate-200">
                  Auto-Speak Responses
                </div>
                <div className="text-[11px] text-slate-400">
                  Read assistant answers aloud automatically
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSpeak}
                onChange={(e) => onUpdateSettings({ autoSpeak: e.target.checked })}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>

            {/* Speech Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Speech Speed:</span>
                <span className="font-mono text-cyan-400">{settings.voiceSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={settings.voiceSpeed}
                onChange={(e) =>
                  onUpdateSettings({ voiceSpeed: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Voice Pitch Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Voice Pitch:</span>
                <span className="font-mono text-cyan-400">{settings.voicePitch}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={settings.voicePitch}
                onChange={(e) =>
                  onUpdateSettings({ voicePitch: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* System Voices Dropdown */}
            {voices.length > 0 && (
              <div className="space-y-1.5">
                <label className="font-medium text-slate-300">
                  Select Output Voice:
                </label>
                <select
                  value={settings.preferredVoiceName}
                  onChange={(e) =>
                    onUpdateSettings({ preferredVoiceName: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-cyan-500"
                >
                  <option value="">Default Recommended Voice</option>
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <hr className="border-slate-800" />

          {/* Section: Memory */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Conversation Memory</span>
            </div>
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <div>
                <div className="font-semibold text-slate-200">
                  Session Memory
                </div>
                <div className="text-[11px] text-slate-400">
                  Remember conversation context across prompts while running
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.memoryEnabled}
                onChange={(e) =>
                  onUpdateSettings({ memoryEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-cyan-500"
              />
            </label>

            <button
              onClick={onClearMemory}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-900/60 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Current Memory & Context</span>
            </button>
          </div>

          <hr className="border-slate-800" />

          {/* Section: Security */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Security & Safety Guardrails</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              All dangerous computer actions (delete file, shutdown, install software, send external message) require strict explicit confirmation ("Are you sure?") with Confirm / Cancel dialog.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
