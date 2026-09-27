import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {
  MODEL,
  getGeminiClient,
  AFAQ_SYSTEM_INSTRUCTION,
  computerControlTools,
} from "./server/geminiConfig.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON with generous limit for screen analysis images
app.use(express.json({ limit: "25mb" }));

// ============================================================================
// 🏥 HEALTH CHECK ENDPOINT
// ============================================================================
app.get("/api/health", (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    model: MODEL,
    configured: hasKey,
    assistant: "Afaq AI Assistant",
    version: "1.0.0",
  });
});

// ============================================================================
// 💬 CHAT & TOOLS ENDPOINT
// ============================================================================
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, languagePreference } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on the server. Please check your environment variables.",
      });
    }

    const ai = getGeminiClient();

    // Map conversation history to Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content || "" }],
    }));

    let systemPrompt = AFAQ_SYSTEM_INSTRUCTION;
    if (languagePreference && languagePreference !== "auto") {
      if (languagePreference === "roman_urdu") {
        systemPrompt += "\n\nCRITICAL USER OVERRIDE: The user specifically requested all responses to be in natural, conversational Roman Urdu (Urdu written in English alphabet).";
      } else if (languagePreference === "urdu") {
        systemPrompt += "\n\nCRITICAL USER OVERRIDE: The user specifically requested all responses to be in written Urdu script (اردو).";
      } else if (languagePreference === "english") {
        systemPrompt += "\n\nCRITICAL USER OVERRIDE: The user specifically requested all responses to be in English.";
      }
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        tools: [{ functionDeclarations: computerControlTools }],
      },
    });

    const candidate = response.candidates?.[0];
    const textPart = response.text || "";

    // Check for tool calls returned by Gemini
    const functionCalls = response.functionCalls || [];
    const dangerousTools = new Set([
      "delete_file",
      "shutdown_computer",
      "install_software",
      "send_message",
    ]);

    const formattedToolCalls = functionCalls.map((fc) => {
      const toolName = fc.name || "unknown_tool";
      const isDangerous = dangerousTools.has(toolName);
      return {
        id: (fc as any).id || `tool-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: toolName,
        args: fc.args || {},
        requiresConfirmation: isDangerous,
      };
    });

    return res.json({
      text: textPart,
      toolCalls: formattedToolCalls,
      model: MODEL,
    });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    const errorMessage = error?.message || "Unknown error occurred while contacting Gemini API.";
    return res.status(500).json({ error: errorMessage });
  }
});

// ============================================================================
// 👁️ COMPUTER VISION / SCREEN ANALYSIS ENDPOINT ("See My Computer")
// ============================================================================
app.post("/api/analyze-screen", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", userQuery, languagePreference } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required for screen analysis." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on the server.",
      });
    }

    const ai = getGeminiClient();

    // Strip data URL header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const screenVisionPrompt = `
You are Afaq AI Assistant analyzing a screenshot explicitly shared by the user using the "See My Computer" feature.

User's Question / Prompt: "${userQuery || "Please analyze my computer screen and guide me on what's visible, any errors, and what I should do next."}"

Please provide a detailed, clear, and highly practical desktop analysis formatted with crisp markdown headings:

### 🖥️ 1. Visible Applications & Context
- Identify all visible windows, open software, browsers, code editors, command lines, or background desktop apps.
- What appears to be the user's primary active task or workflow?

### 🔘 2. Key UI Elements & Text Detected
- Notable buttons, menu bars, active tabs, breadcrumbs, or highlighted input fields.
- Important readable text or filenames visible on screen.

### ⚠️ 3. Errors, Warnings & Issues (If Any)
- Are there any visible compiler errors, syntax mistakes, terminal warnings, crash dialogs, red error squiggles, or misconfigurations?
- If no errors are present, clearly state: "No visible errors or warnings detected."

### 🎯 4. Recommended Next Action
- Exactly what button, link, menu, or command the user should click or type next.
- Precise step-by-step guidance on how to accomplish their task or solve any visible dilemma.

Keep your response friendly, concise, and direct. ${
      languagePreference === "roman_urdu"
        ? "Jawab Roman Urdu me dein taake user asani se samajh sake."
        : languagePreference === "urdu"
        ? "جواب صاف اردو رسم الخط میں دیں۔"
        : ""
    }
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          {
            text: screenVisionPrompt,
          },
        ],
      },
      config: {
        systemInstruction: AFAQ_SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    const analysisText = response.text || "Screen analyzed successfully, but no response text was generated.";

    return res.json({
      analysis: analysisText,
      model: MODEL,
    });
  } catch (error: any) {
    console.error("Gemini Vision API Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to analyze screen capture.",
    });
  }
});

// ============================================================================
// ⚡ TOOL EXECUTION HANDLER (SAFE EXECUTION & AUDITING)
// ============================================================================
app.post("/api/execute-tool", async (req, res) => {
  try {
    const { toolName, args, userConfirmed } = req.body;

    const dangerousTools = new Set([
      "delete_file",
      "shutdown_computer",
      "install_software",
      "send_message",
    ]);

    if (dangerousTools.has(toolName) && !userConfirmed) {
      return res.status(403).json({
        error: "Action rejected. Dangerous actions require explicit user confirmation.",
      });
    }

    let resultMessage = "";
    let executionData: any = {};

    switch (toolName) {
      case "search_google": {
        const query = args.query || "";
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        resultMessage = `Searched Google for: "${query}"`;
        executionData = { action: "open_url", url: searchUrl, query };
        break;
      }

      case "open_website": {
        let url = args.url || "";
        if (!/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
        }
        resultMessage = `Opened website: ${url}`;
        executionData = { action: "open_url", url, siteName: args.siteName || url };
        break;
      }

      case "open_application": {
        const appName = args.appName || "Application";
        resultMessage = `Launched application: ${appName}`;
        executionData = { action: "app_launch", appName, status: "simulated_success" };
        break;
      }

      case "type_text": {
        const text = args.text || "";
        resultMessage = `Typed text: "${text}"`;
        executionData = { action: "keyboard_type", text, length: text.length };
        break;
      }

      case "keyboard_shortcut": {
        const shortcut = args.shortcut || "";
        resultMessage = `Triggered shortcut: [${shortcut}] (${args.description || "Shortcut executed"})`;
        executionData = { action: "shortcut", shortcut };
        break;
      }

      case "take_screenshot": {
        resultMessage = `Screenshot capture request initiated.`;
        executionData = { action: "trigger_screenshot" };
        break;
      }

      case "delete_file": {
        resultMessage = `[CONFIRMED] File deletion simulated safely for: ${args.filePath}. (Reason: ${args.reason})`;
        executionData = { action: "file_delete", filePath: args.filePath, confirmed: true };
        break;
      }

      case "shutdown_computer": {
        resultMessage = `[CONFIRMED] System ${args.action || "shutdown"} command acknowledged with safety delay.`;
        executionData = { action: "system_power", powerAction: args.action, confirmed: true };
        break;
      }

      case "install_software": {
        resultMessage = `[CONFIRMED] Software package installation verified: ${args.packageName}`;
        executionData = { action: "package_install", package: args.packageName, confirmed: true };
        break;
      }

      case "send_message": {
        resultMessage = `[CONFIRMED] Message dispatched to: ${args.recipient}`;
        executionData = { action: "message_dispatch", recipient: args.recipient, confirmed: true };
        break;
      }

      default:
        resultMessage = `Executed tool: ${toolName}`;
        executionData = { action: toolName, args };
    }

    return res.json({
      success: true,
      message: resultMessage,
      data: executionData,
    });
  } catch (error: any) {
    console.error("Execute Tool Error:", error);
    return res.status(500).json({ error: error?.message || "Tool execution failed." });
  }
});

// ============================================================================
// 🚀 VITE INTEGRATION (DEV & PROD)
// ============================================================================
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    // Development mode with Vite middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`🤖 Afaq AI Assistant server running on port ${PORT}`);
    console.log(`🧠 Centralized Brain Model: ${MODEL}`);
  });
}

startServer();
