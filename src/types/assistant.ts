export type AssistantStatus =
  | "ready"
  | "listening"
  | "thinking"
  | "speaking"
  | "vision";

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  requiresConfirmation: boolean;
  status?: "pending" | "confirmed" | "rejected" | "executed";
  executionResult?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  image?: string;
  toolCalls?: ToolCall[];
  isVisionAnalysis?: boolean;
}

export type SupportedLanguage = "auto" | "english" | "roman_urdu" | "urdu";

export interface AppSettings {
  autoSpeak: boolean;
  voiceSpeed: number;
  voicePitch: number;
  preferredVoiceName: string;
  language: SupportedLanguage;
  memoryEnabled: boolean;
  securityStrictness: "strict" | "normal";
}
