import React, { useState } from "react";
import {
  X,
  BookOpen,
  Terminal,
  Key,
  Play,
  MessageSquare,
  Mic,
  Camera,
  Cpu,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const steps = [
    {
      id: 1,
      title: "STEP 1: Folder Structure",
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">
            Afaq AI Assistant is built as a production-grade full-stack TypeScript application with Express server and React Vite:
          </p>
          <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
{`/
├── .env.example              # Environment variables template
├── metadata.json             # App capabilities & frame permissions
├── package.json              # Express, @google/genai, React, Tailwind
├── server.ts                 # Express full-stack server & Vite middleware
├── server/
│   └── geminiConfig.ts       # ONE centralized place for MODEL & API config
├── src/
│   ├── main.tsx              # React DOM entry point
│   ├── index.css             # Tailwind v4 styles, fonts & keyframes
│   ├── App.tsx               # Main Desktop GUI & state machine
│   ├── types/
│   │   └── assistant.ts      # TypeScript interfaces for chat & tools
│   ├── services/
│   │   ├── geminiService.ts  # Client API proxy calls to Express server
│   │   ├── voiceService.ts   # Speech-to-Text & Text-to-Speech engine
│   │   └── screenService.ts  # Screen snapshot capture & vision tools
│   └── components/
│       ├── TitleBar.tsx      # Desktop window title & control bar
│       ├── AvatarOrb.tsx     # Central glowing animated AI avatar
│       ├── ChatArea.tsx       # Conversation area with code blocks
│       ├── InputBar.tsx       # Mic, text box, send & action chips
│       ├── ScreenCaptureModal.tsx # "See My Computer" modal
│       ├── SecurityConfirmModal.tsx # "Are you sure?" confirmation
│       ├── SettingsModal.tsx  # Voice, language & memory settings
│       └── BeginnerGuideModal.tsx # Complete 10-step guide
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite build & alias setup`}
          </pre>
        </div>
      ),
    },
    {
      id: 2,
      title: "STEP 2: Centralized AI Brain",
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">
            As requested, the model configuration is kept in <strong>ONE clearly marked place</strong> on the server in <code className="text-cyan-400">/server/geminiConfig.ts</code>:
          </p>
          <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
{`// /server/geminiConfig.ts
export const MODEL = "gemini-3.8-flash";

export function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}`}
          </pre>
          <p className="text-xs text-slate-400">
            All API keys stay safely on the backend server. The client browser never touches your secret key.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: "STEP 3: Installation",
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">
            Run the following command in your terminal inside the project directory to install all dependencies:
          </p>
          <div className="relative group">
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
npm install
            </pre>
            <button
              onClick={() => handleCopy("npm install", "install")}
              className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {copiedText === "install" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "STEP 4: Gemini API Key Setup",
      icon: <Key className="w-4 h-4 text-amber-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">
            In Google AI Studio or your local environment, set the <code className="text-amber-300">GEMINI_API_KEY</code> variable:
          </p>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Create or edit .env:</span>
            <div className="relative">
              <pre className="p-2.5 bg-slate-900 rounded font-mono text-xs text-amber-300">
GEMINI_API_KEY="your_actual_gemini_api_key_here"
              </pre>
              <button
                onClick={() => handleCopy('GEMINI_API_KEY="your_actual_gemini_api_key_here"', "apikey")}
                className="absolute right-2 top-2 p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                {copiedText === "apikey" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            When running in Google AI Studio, the platform injects this automatically via the Secrets panel.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: "STEP 5: Single Start Command",
      icon: <Play className="w-4 h-4 text-emerald-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300 font-semibold">
            To start the full-stack Afaq AI Assistant in development mode:
          </p>
          <div className="relative group">
            <pre className="p-4 bg-slate-950 rounded-xl border border-emerald-500/60 font-mono text-sm text-emerald-300 overflow-x-auto">
npm run dev
            </pre>
            <button
              onClick={() => handleCopy("npm run dev", "rundev")}
              className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {copiedText === "rundev" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Open <code className="text-cyan-400">http://localhost:3000</code> in your browser (Google Chrome or Edge recommended for speech).
          </p>
        </div>
      ),
    },
    {
      id: 6,
      title: "STEP 6: How to Test Chat",
      icon: <MessageSquare className="w-4 h-4 text-blue-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">Try these prompts to test multilingual and coding capabilities:</p>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li><strong>English:</strong> <em>"Explain quantum computing simply like I am 10."</em></li>
            <li><strong>Roman Urdu:</strong> <em>"Aap kaise hain? Mujhe Python me web scraper banana sikhayein."</em></li>
            <li><strong>Urdu Script:</strong> <em>"مجھے بتائیں کہ مصنوعی ذہانت کیسے کام کرتی ہے؟"</em></li>
            <li><strong>Coding & Debugging:</strong> <em>"Write a C++ program for binary search with comments."</em></li>
          </ul>
        </div>
      ),
    },
    {
      id: 7,
      title: "STEP 7: How to Test Voice",
      icon: <Mic className="w-4 h-4 text-rose-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">Afaq AI supports two-way voice interaction:</p>
          <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
            <li>Click the <strong>🎤 Microphone button</strong> or the <strong>central Avatar</strong>.</li>
            <li>Allow microphone permission in your browser prompt.</li>
            <li>Speak your query clearly. The avatar pulses and changes to <strong>Listening...</strong></li>
            <li>Afaq AI responds, and if <strong>Voice Mode</strong> is ON, reads the answer aloud!</li>
            <li>Click <strong>⏹ Stop</strong> to pause speech at any time.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 8,
      title: "STEP 8: How to Test 'See My Computer'",
      icon: <Camera className="w-4 h-4 text-amber-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">
            Computer vision requires explicit single-snapshot user permission (zero secret monitoring):
          </p>
          <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
            <li>Click <strong>📷 Analyze Screen</strong> in the action bar.</li>
            <li>Choose <strong>Capture My Live Screen</strong> (select your window) or pick one of the built-in <strong>Sample Screens</strong> (e.g. Python IndexError).</li>
            <li>Click <strong>Analyze Screen with Gemini</strong>.</li>
            <li>Gemini Vision will break down visible apps, buttons, text, errors, and recommended next steps!</li>
          </ol>
        </div>
      ),
    },
    {
      id: 9,
      title: "STEP 9: Safe Computer Control",
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">
            To test safe computer actions vs dangerous actions:
          </p>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li><strong>Safe Action:</strong> Say <em>"Search Google for React 19 documentation"</em> &rarr; Opens directly.</li>
            <li><strong>Dangerous Action:</strong> Say <em>"Delete the file temp_logs.txt"</em> or <em>"Shutdown the computer"</em> &rarr; The <strong>"Are you sure?"</strong> modal will appear with Confirm / Cancel buttons!</li>
          </ul>
        </div>
      ),
    },
    {
      id: 10,
      title: "STEP 10: Troubleshooting",
      icon: <HelpCircle className="w-4 h-4 text-yellow-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">Microphone not working:</span>
            <p className="text-slate-400">
              Ensure you are using Google Chrome or Microsoft Edge and that you clicked "Allow" on the microphone browser prompt.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">Screen sharing error:</span>
            <p className="text-slate-400">
              If running in an embedded frame with display-capture restrictions, use the "Upload Screenshot" or "Sample Desktop Screens" option in the See My Computer modal.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">API Key Error:</span>
            <p className="text-slate-400">
              Confirm your GEMINI_API_KEY is configured in your .env or AI Studio Secrets panel.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Beginner Guide & Architecture Manual
              </h2>
              <p className="text-xs text-slate-400">
                10-Step comprehensive guide to run, test, and expand Afaq AI Assistant
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

        {/* Tab Selector */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2 flex items-center gap-1.5 overflow-x-auto">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeStep === step.id
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {step.icon}
              <span>Step {step.id}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              {steps[activeStep - 1].title}
            </span>
          </div>
          {steps[activeStep - 1].content}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            disabled={activeStep === 1}
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            &larr; Previous Step
          </button>

          <span className="text-xs text-slate-500 font-mono">
            {activeStep} of {steps.length}
          </span>

          <button
            disabled={activeStep === steps.length}
            onClick={() => setActiveStep((prev) => Math.min(steps.length, prev + 1))}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-500"
          >
            Next Step &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
