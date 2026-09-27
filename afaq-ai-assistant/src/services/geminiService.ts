import { Message, SupportedLanguage, ToolCall } from "../types/assistant";

export interface ChatResponse {
  text: string;
  toolCalls: ToolCall[];
  model: string;
}

export interface VisionResponse {
  analysis: string;
  model: string;
}

export const geminiService = {
  async checkHealth(): Promise<{ status: string; configured: boolean; model: string }> {
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error("Health check failed");
      return await res.json();
    } catch {
      return { status: "offline", configured: false, model: "unknown" };
    }
  },

  async sendChatMessage(
    messages: { role: string; content: string }[],
    languagePreference: SupportedLanguage
  ): Promise<ChatResponse> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, languagePreference }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Server error" }));
      throw new Error(err.error || `HTTP ${res.status}: Failed to generate response`);
    }

    return await res.json();
  },

  async analyzeScreen(
    imageBase64: string,
    userQuery: string,
    languagePreference: SupportedLanguage
  ): Promise<VisionResponse> {
    const res = await fetch("/api/analyze-screen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64,
        userQuery,
        languagePreference,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Vision error" }));
      throw new Error(err.error || `HTTP ${res.status}: Screen analysis failed`);
    }

    return await res.json();
  },

  async executeTool(
    toolName: string,
    args: Record<string, any>,
    userConfirmed: boolean
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const res = await fetch("/api/execute-tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolName, args, userConfirmed }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Tool execution failed" }));
      throw new Error(err.error || `HTTP ${res.status}: Execution error`);
    }

    return await res.json();
  },
};
