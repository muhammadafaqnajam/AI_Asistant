import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  AssistantStatus,
  Message,
  ToolCall,
  AppSettings,
  SupportedLanguage,
} from "./types/assistant";
import { geminiService } from "./services/geminiService";
import { voiceService } from "./services/voiceService";
import { TitleBar } from "./components/TitleBar";
import { AvatarOrb } from "./components/AvatarOrb";
import { ChatArea } from "./components/ChatArea";
import { InputBar } from "./components/InputBar";
import { SecurityConfirmModal } from "./components/SecurityConfirmModal";
import { ScreenCaptureModal } from "./components/ScreenCaptureModal";
import { SettingsModal } from "./components/SettingsModal";
import { BeginnerGuideModal } from "./components/BeginnerGuideModal";
import { ImageViewModal } from "./components/ImageViewModal";
import { ActionToast } from "./components/ActionToast";

const INITIAL_GREETING: Message = {
  id: "welcome-greeting",
  role: "assistant",
  content:
    "Salam & Hello! I am **Afaq AI Assistant** — your personal desktop assistant.\n\nI can answer questions, write and debug code in Python, C++, HTML/CSS and JavaScript, recognize your voice, analyze your computer screen, and safely assist with desktop actions.\n\nHow can I help you today?",
  timestamp: Date.now(),
};

const DEFAULT_SETTINGS: AppSettings = {
  autoSpeak: true,
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  preferredVoiceName: "",
  language: "auto",
  memoryEnabled: true,
  securityStrictness: "strict",
};

export default function App() {
  const [status, setStatus] = useState<AssistantStatus>("ready");
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem("afaq_settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [statusSubtext, setStatusSubtext] = useState<string | undefined>(undefined);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [pendingToolForConfirm, setPendingToolForConfirm] = useState<ToolCall | null>(null);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState<string | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{
    id: string;
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

  const toastTimerRef = useRef<any>(null);

  const showToast = useCallback((message: string, type: "info" | "success" | "error" = "info") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ id: String(Date.now()), message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("afaq_settings", JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Initial health check
  useEffect(() => {
    geminiService.checkHealth().then((health) => {
      if (!health.configured) {
        showToast("Notice: GEMINI_API_KEY is not configured yet. Set it in .env or Secrets.", "error");
      }
    });
  }, [showToast]);

  // Handle stop button
  const handleStopAll = useCallback(() => {
    voiceService.stopListening();
    voiceService.stopSpeaking();
    setIsListening(false);
    setIsSpeaking(false);
    setStatus("ready");
    setStatusSubtext(undefined);
  }, []);

  // Speak assistant text
  const speakText = useCallback(
    (text: string) => {
      if (!settings.autoSpeak) return;
      voiceService.speak(
        text,
        {
          rate: settings.voiceSpeed,
          pitch: settings.voicePitch,
          voiceName: settings.preferredVoiceName,
        },
        () => {
          setIsSpeaking(true);
          setStatus("speaking");
          setStatusSubtext("Speaking response...");
        },
        () => {
          setIsSpeaking(false);
          setStatus("ready");
          setStatusSubtext(undefined);
        },
        (err) => {
          setIsSpeaking(false);
          setStatus("ready");
          setStatusSubtext(undefined);
          console.warn("Speech error:", err);
        }
      );
    },
    [settings]
  );

  // Safe Tool Execution
  const executeToolSafely = useCallback(
    async (tool: ToolCall, confirmedByUser: boolean = false) => {
      try {
        const result = await geminiService.executeTool(
          tool.name,
          tool.args,
          confirmedByUser
        );

        // Update message with execution result
        setMessages((prev) =>
          prev.map((msg) => {
            if (!msg.toolCalls) return msg;
            return {
              ...msg,
              toolCalls: msg.toolCalls.map((t) =>
                t.id === tool.id
                  ? {
                      ...t,
                      status: "confirmed",
                      executionResult: result.message,
                    }
                  : t
              ),
            };
          })
        );

        showToast(result.message, "success");

        // Action side-effects (e.g. open URL in browser)
        if (result.data?.action === "open_url" && result.data.url) {
          window.open(result.data.url, "_blank", "noopener,noreferrer");
        } else if (result.data?.action === "trigger_screenshot") {
          setIsScreenModalOpen(true);
        }
      } catch (err: any) {
        showToast(`Failed to execute ${tool.name}: ${err.message}`, "error");
        setMessages((prev) =>
          prev.map((msg) => {
            if (!msg.toolCalls) return msg;
            return {
              ...msg,
              toolCalls: msg.toolCalls.map((t) =>
                t.id === tool.id
                  ? {
                      ...t,
                      status: "rejected",
                      executionResult: `Failed: ${err.message}`,
                    }
                  : t
              ),
            };
          })
        );
      }
    },
    [showToast]
  );

  // Send message to Gemini chat
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      handleStopAll();

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      const updatedHistory = [...messages, userMsg];
      setMessages(updatedHistory);
      setStatus("thinking");
      setStatusSubtext("Gemini is reasoning...");

      try {
        // Prepare context for Gemini
        const chatPayload = settings.memoryEnabled
          ? updatedHistory.map((m) => ({ role: m.role, content: m.content }))
          : [{ role: "user", content: text }];

        const data = await geminiService.sendChatMessage(
          chatPayload,
          settings.language
        );

        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.text || "I have processed your request.",
          timestamp: Date.now(),
          toolCalls: data.toolCalls,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setStatus("ready");
        setStatusSubtext(undefined);

        // Auto speak if enabled
        if (assistantMsg.content) {
          speakText(assistantMsg.content);
        }

        // Process any non-dangerous tool calls automatically
        if (data.toolCalls && data.toolCalls.length > 0) {
          for (const tool of data.toolCalls) {
            if (!tool.requiresConfirmation) {
              await executeToolSafely(tool, true);
            } else {
              // Trigger confirmation modal for dangerous actions
              setPendingToolForConfirm(tool);
            }
          }
        }
      } catch (err: any) {
        setStatus("ready");
        setStatusSubtext(undefined);
        const errMsg = err.message || "Failed to communicate with Afaq AI Assistant.";
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: `⚠️ **Error encountered:** ${errMsg}\n\nPlease verify your network connection and that \`GEMINI_API_KEY\` is configured.`,
            timestamp: Date.now(),
          },
        ]);
        showToast(errMsg, "error");
      }
    },
    [
      messages,
      settings.memoryEnabled,
      settings.language,
      handleStopAll,
      speakText,
      executeToolSafely,
      showToast,
    ]
  );

  // Toggle Microphone / Speech-to-Text
  const handleToggleMic = useCallback(() => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      setStatus("ready");
      setStatusSubtext(undefined);
      return;
    }

    handleStopAll();

    const langCode =
      settings.language === "urdu"
        ? "ur-PK"
        : settings.language === "roman_urdu"
        ? "en-IN"
        : "en-US";

    const started = voiceService.startListening(
      langCode,
      (recognizedText, isFinal) => {
        if (isFinal) {
          setIsListening(false);
          setStatus("ready");
          setStatusSubtext(undefined);
          handleSendMessage(recognizedText);
        } else {
          setStatusSubtext(`Hearing: "${recognizedText}..."`);
        }
      },
      (errorMsg) => {
        setIsListening(false);
        setStatus("ready");
        setStatusSubtext(undefined);
        showToast(errorMsg, "error");
      },
      () => {
        setIsListening(true);
        setStatus("listening");
        setStatusSubtext("Listening... Speak clearly into your mic");
      },
      () => {
        setIsListening(false);
        if (status === "listening") {
          setStatus("ready");
          setStatusSubtext(undefined);
        }
      }
    );

    if (!started) {
      setIsListening(false);
    }
  }, [isListening, handleStopAll, settings.language, handleSendMessage, showToast, status]);

  // Screen Analysis ("See My Computer")
  const handleAnalyzeScreen = useCallback(
    async (imageBase64: string, userQuery: string) => {
      handleStopAll();
      setStatus("vision");
      setStatusSubtext("Analyzing desktop screenshot with Gemini Vision...");

      const userVisionMsg: Message = {
        id: `vision-req-${Date.now()}`,
        role: "user",
        content: `📷 **See My Computer Request:** ${userQuery}`,
        timestamp: Date.now(),
        image: imageBase64,
      };

      setMessages((prev) => [...prev, userVisionMsg]);

      try {
        const visionData = await geminiService.analyzeScreen(
          imageBase64,
          userQuery,
          settings.language
        );

        const assistantVisionMsg: Message = {
          id: `vision-res-${Date.now()}`,
          role: "assistant",
          content: visionData.analysis,
          timestamp: Date.now(),
          isVisionAnalysis: true,
        };

        setMessages((prev) => [...prev, assistantVisionMsg]);
        setStatus("ready");
        setStatusSubtext(undefined);

        if (assistantVisionMsg.content) {
          speakText(
            "Screen analysis complete. I have identified the visible applications and recommended next steps."
          );
        }
      } catch (err: any) {
        setStatus("ready");
        setStatusSubtext(undefined);
        const errMsg = err.message || "Failed to analyze screen capture.";
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: `⚠️ **Computer Vision Error:** ${errMsg}`,
            timestamp: Date.now(),
          },
        ]);
        showToast(errMsg, "error");
      }
    },
    [handleStopAll, settings.language, speakText, showToast]
  );

  // New Chat action
  const handleNewChat = useCallback(() => {
    handleStopAll();
    setMessages([INITIAL_GREETING]);
    showToast("Started a new conversation session", "info");
  }, [handleStopAll, showToast]);

  // Clear Chat action
  const handleClearChat = useCallback(() => {
    handleStopAll();
    setMessages([]);
    showToast("Conversation cleared", "info");
  }, [handleStopAll, showToast]);

  // Language cycling
  const handleCycleLanguage = useCallback(() => {
    const list: SupportedLanguage[] = ["auto", "english", "roman_urdu", "urdu"];
    const nextIdx = (list.indexOf(settings.language) + 1) % list.length;
    const newLang = list[nextIdx];
    setSettings((prev) => ({ ...prev, language: newLang }));
    const labels: Record<SupportedLanguage, string> = {
      auto: "Auto Language Detection",
      english: "English Mode",
      roman_urdu: "Roman Urdu Mode",
      urdu: "اردو (Urdu) Mode",
    };
    showToast(`Switched language: ${labels[newLang]}`, "info");
  }, [settings.language, showToast]);

  // Confirm dangerous tool
  const handleConfirmTool = useCallback(
    (tool: ToolCall) => {
      setPendingToolForConfirm(null);
      executeToolSafely(tool, true);
    },
    [executeToolSafely]
  );

  // Cancel dangerous tool
  const handleCancelTool = useCallback(() => {
    if (pendingToolForConfirm) {
      const toolId = pendingToolForConfirm.id;
      setMessages((prev) =>
        prev.map((msg) => {
          if (!msg.toolCalls) return msg;
          return {
            ...msg,
            toolCalls: msg.toolCalls.map((t) =>
              t.id === toolId ? { ...t, status: "rejected" } : t
            ),
          };
        })
      );
      showToast("Computer action cancelled by user", "info");
    }
    setPendingToolForConfirm(null);
  }, [pendingToolForConfirm, showToast]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden relative font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Titlebar */}
      <TitleBar
        status={status}
        autoSpeak={settings.autoSpeak}
        onToggleAutoSpeak={() =>
          setSettings((prev) => ({ ...prev, autoSpeak: !prev.autoSpeak }))
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onClearChat={handleClearChat}
        messageCount={messages.length}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Center Circular Animated AI Avatar */}
        <div className="shrink-0 pt-2 pb-1 border-b border-slate-900/60 bg-gradient-to-b from-slate-950/40 to-slate-950/90 backdrop-blur-md">
          <AvatarOrb
            status={status}
            statusText={statusSubtext}
            onClick={handleToggleMic}
          />
        </div>

        {/* Scrollable Conversation Area */}
        <ChatArea
          messages={messages}
          isThinking={status === "thinking"}
          onSelectPrompt={handleSendMessage}
          onRequestConfirmTool={(tool) => setPendingToolForConfirm(tool)}
          onViewImage={(url) => setEnlargedImageUrl(url)}
        />

        {/* Bottom Input & Action Bar */}
        <InputBar
          status={status}
          onSendMessage={handleSendMessage}
          onToggleMic={handleToggleMic}
          onStop={handleStopAll}
          onOpenScreenModal={() => setIsScreenModalOpen(true)}
          onNewChat={handleNewChat}
          autoSpeak={settings.autoSpeak}
          onToggleAutoSpeak={() =>
            setSettings((prev) => ({ ...prev, autoSpeak: !prev.autoSpeak }))
          }
          language={settings.language}
          onCycleLanguage={handleCycleLanguage}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />
      </main>

      {/* Modals & Overlays */}
      <ScreenCaptureModal
        isOpen={isScreenModalOpen}
        onClose={() => setIsScreenModalOpen(false)}
        onAnalyze={handleAnalyzeScreen}
      />

      <SecurityConfirmModal
        isOpen={Boolean(pendingToolForConfirm)}
        tool={pendingToolForConfirm}
        onConfirm={handleConfirmTool}
        onCancel={handleCancelTool}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) =>
          setSettings((prev) => ({ ...prev, ...newVals }))
        }
        onClearMemory={handleClearChat}
      />

      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <ImageViewModal
        imageUrl={enlargedImageUrl}
        onClose={() => setEnlargedImageUrl(null)}
      />

      <ActionToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
