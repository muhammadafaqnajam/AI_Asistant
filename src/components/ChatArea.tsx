import React, { useRef, useEffect, useState } from "react";
import {
  Message,
  ToolCall,
} from "../types/assistant";
import {
  Sparkles,
  User,
  Copy,
  Check,
  ExternalLink,
  Search,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Monitor,
} from "lucide-react";

interface ChatAreaProps {
  messages: Message[];
  isThinking: boolean;
  onSelectPrompt: (prompt: string) => void;
  onRequestConfirmTool: (tool: ToolCall) => void;
  onViewImage: (imageUrl: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isThinking,
  onSelectPrompt,
  onRequestConfirmTool,
  onViewImage,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to parse markdown code blocks into highlighted UI components
  const renderMessageContent = (content: string, messageId: string) => {
    const parts: React.ReactNode[] = [];
    const codeBlockRegex = /```([a-zA-Z0-9_\-+]*)\n([\s\S]*?)```/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let blockCounter = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const textBefore = content.substring(lastIndex, match.index);
      if (textBefore) {
        parts.push(
          <div key={`text-${lastIndex}`} className="whitespace-pre-wrap leading-relaxed">
            {textBefore}
          </div>
        );
      }

      const language = match[1] || "code";
      const codeSnippet = match[2];
      const snippetId = `${messageId}-code-${blockCounter++}`;

      parts.push(
        <div
          key={snippetId}
          className="my-3 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 font-code text-xs shadow-lg"
        >
          {/* Code block header */}
          <div className="bg-slate-900/90 px-3.5 py-1.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
            <span className="uppercase text-[11px] font-semibold text-cyan-400 tracking-wider">
              {language}
            </span>
            <button
              onClick={() => copyToClipboard(codeSnippet, snippetId)}
              className="flex items-center gap-1 text-[11px] hover:text-white px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              {copiedIndex === snippetId ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-sans">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="font-sans">Copy</span>
                </>
              )}
            </button>
          </div>
          {/* Code body */}
          <pre className="p-3.5 overflow-x-auto text-slate-200 leading-normal font-normal">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <div key={`text-${lastIndex}`} className="whitespace-pre-wrap leading-relaxed">
          {content.substring(lastIndex)}
        </div>
      );
    }

    return parts;
  };

  const samplePrompts = [
    {
      title: "Write Python Script",
      desc: "Web scraper with error handling & comments",
      prompt: "Can you write a clean, well-commented Python script for web scraping that handles network errors gracefully?",
    },
    {
      title: "Explain Simply",
      desc: "How does quantum computing work?",
      prompt: "Can you explain how quantum computing works simply, like I'm 12 years old?",
    },
    {
      title: "Roman Urdu Chat",
      desc: "Mujhe C++ pointer samjha dein",
      prompt: "Mujhe Roman Urdu me samjha dein ke C++ me pointers kya hotay hain aur unhe kahan use kartay hain?",
    },
    {
      title: "See My Computer",
      desc: "Analyze my screen for issues & next steps",
      prompt: "Please analyze my computer screen and explain what you see and what I should do next.",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-4xl mx-auto w-full">
      {/* Empty State / Welcome Screen */}
      {messages.length === 0 && (
        <div className="py-6 flex flex-col items-center text-center">
          <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            Welcome to Afaq AI Assistant
          </h2>
          <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
            Your personal desktop AI powered by Gemini. Ask questions, dictate with your voice, analyze your screen, or control your computer safely.
          </p>

          {/* Quick Starter Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 w-full max-w-xl text-left">
            {samplePrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt(item.prompt)}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 transition-all text-left group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {item.desc}
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-cyan-400/80 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Try this &rarr;
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Stream */}
      {messages.map((message) => {
        const isUser = message.role === "user";

        return (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              isUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                isUser
                  ? "bg-slate-800 text-slate-300 border border-slate-700"
                  : "bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]"
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Bubble Container */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-md ${
                isUser
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none"
              }`}
            >
              {/* Screen capture attachment if present */}
              {message.image && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300 mb-1.5">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Captured Computer Screen</span>
                  </div>
                  <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-black cursor-pointer max-w-sm">
                    <img
                      src={message.image}
                      alt="Screen capture"
                      className="w-full h-auto object-cover max-h-48 group-hover:opacity-90 transition-opacity"
                      onClick={() => onViewImage(message.image!)}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="px-2.5 py-1 rounded bg-slate-900/80 text-white text-xs flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Click to enlarge
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Message text content */}
              <div className="text-sm select-text">
                {renderMessageContent(message.content, message.id)}
              </div>

              {/* Computer Tool Actions */}
              {message.toolCalls && message.toolCalls.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-slate-800/80 pt-3">
                  <div className="text-[11px] font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Assistant Computer Action</span>
                  </div>

                  {message.toolCalls.map((tool) => (
                    <div
                      key={tool.id}
                      className={`p-3 rounded-lg border text-xs ${
                        tool.requiresConfirmation && tool.status !== "confirmed"
                          ? "bg-amber-950/30 border-amber-800/80 text-amber-200"
                          : "bg-slate-950/70 border-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-mono font-medium text-cyan-300 flex items-center gap-1.5">
                          {tool.name === "search_google" && <Search className="w-3.5 h-3.5 text-blue-400" />}
                          {tool.name === "open_website" && <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />}
                          {tool.requiresConfirmation && (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          )}
                          <span>{tool.name}</span>
                        </div>

                        {/* Status Pill */}
                        <div>
                          {tool.status === "confirmed" && (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Executed
                            </span>
                          )}
                          {tool.status === "rejected" && (
                            <span className="flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                              <XCircle className="w-3 h-3" /> Cancelled
                            </span>
                          )}
                          {tool.status !== "confirmed" && tool.status !== "rejected" && tool.requiresConfirmation && (
                            <button
                              onClick={() => onRequestConfirmTool(tool)}
                              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm transition-colors"
                            >
                              Review & Confirm
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Tool Parameters details */}
                      <div className="mt-1.5 text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded border border-slate-800/50">
                        {JSON.stringify(tool.args, null, 2)}
                      </div>

                      {tool.executionResult && (
                        <div className="mt-1 text-[11px] text-emerald-300 font-sans">
                          {tool.executionResult}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-[10px] mt-2 text-right ${
                  isUser ? "text-blue-200" : "text-slate-500"
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Thinking Indicator */}
      {isThinking && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center shrink-0 text-white shadow-md animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-medium text-slate-300">
              Afaq AI is thinking & crafting response...
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
