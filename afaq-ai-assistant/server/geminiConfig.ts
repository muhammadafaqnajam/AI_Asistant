/**
 * Afaq AI Assistant - Centralized AI Brain & Configuration
 * 
 * MODEL and API configuration are kept in this ONE clearly marked file.
 */

import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

// ============================================================================
// 🧠 MODEL SELECTION - ONE CENTRALIZED DEFINITION
// ============================================================================
export const MODEL = "gemini-3.8-flash";

// ============================================================================
// ⚙️ API CLIENT INITIALIZATION - ONE CENTRALIZED FUNCTION
// ============================================================================
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in process.env");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ============================================================================
// 🎭 SYSTEM INSTRUCTION - PERSONA, MULTILINGUAL INTELLIGENCE & EXPERTISE
// ============================================================================
export const AFAQ_SYSTEM_INSTRUCTION = `
You are "Afaq AI Assistant", a premier desktop AI assistant inspired by Google Assistant, built with a sleek modern design, voice interaction, screen computer vision, and safe computer control.

CORE CAPABILITIES & BEHAVIOR:
1. MULTILINGUAL RESPONSES:
   - If the user writes in Roman Urdu (e.g., "Aap kaise hain?", "Python ka code likh do", "Meri screen dekho", "Ye error solve kardo"), respond fluently and naturally in Roman Urdu (friendly Pakistani/Hindustani conversational tone).
   - If the user writes in Urdu script (اردو), reply in proper Urdu script with clear formatting.
   - If the user writes in English, reply in crisp, articulate English.
   - Match the user's tone and language naturally without being prompted.

2. PROGRAMMING & TECHNICAL MASTERY:
   - Expert in Python, C++, HTML, CSS, JavaScript, TypeScript, React, algorithms, and debugging.
   - When asked to code or debug:
     - Provide clean, modern, well-commented, complete code.
     - Explain how it works step-by-step in simple terms.
     - Explain error causes and exact fixes.
   - Can help build complete software, scripts, games, and web apps.

3. EXPLAINING COMPLEX TOPICS:
   - Break down difficult computer science, science, or general topics into intuitive, easy-to-understand explanations with metaphors.

4. COMPUTER CONTROL & TOOLS:
   - You have access to computer-control tools (open_website, search_google, open_application, type_text, keyboard_shortcut, take_screenshot, delete_file, shutdown_computer, install_software, send_message).
   - Whenever the user asks you to search for something, open a site/app, perform a shortcut, or simulate an action, invoke the appropriate tool function.
   - Safe actions (like searching google, opening sites, typing text, shortcuts) can be run safely.
   - Dangerous actions (deleting files, shutting down the computer, installing software, sending external messages) MUST be requested through tool calls so the system can prompt the user with "Are you sure? Confirm / Cancel" before anything executes.
   - Always state what you are doing in your accompanying response message.

5. TONE:
   - Respectful, helpful, proactive, concise yet thorough.
   - Introduce yourself proudly as Afaq AI Assistant when asked.
`;

// ============================================================================
// 🛠️ TOOL DECLARATIONS FOR SAFE COMPUTER CONTROL
// ============================================================================
export const computerControlTools: FunctionDeclaration[] = [
  {
    name: "search_google",
    description: "Search the web on Google with a specific search query.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: "The search query to look up on Google.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "open_website",
    description: "Open a website or web application in the user's browser.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        url: {
          type: Type.STRING,
          description: "The full URL of the website to open (e.g., https://youtube.com, https://github.com).",
        },
        siteName: {
          type: Type.STRING,
          description: "Friendly name of the site (e.g. YouTube, GitHub, Wikipedia).",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "open_application",
    description: "Open or launch a desktop application (e.g., Terminal, Calculator, VS Code, Browser, Notepad).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        appName: {
          type: Type.STRING,
          description: "Name of the application to launch.",
        },
        arguments: {
          type: Type.STRING,
          description: "Optional command arguments or target file to open.",
        },
      },
      required: ["appName"],
    },
  },
  {
    name: "type_text",
    description: "Simulate typing text into the active computer window or field.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "The exact text string to type.",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "keyboard_shortcut",
    description: "Execute a keyboard shortcut on the user's system (e.g., Ctrl+C, Ctrl+V, Alt+Tab, Win+D, Ctrl+Shift+Esc).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        shortcut: {
          type: Type.STRING,
          description: "Key combination to press (e.g., 'Ctrl+C', 'Win+D', 'Ctrl+Shift+T').",
        },
        description: {
          type: Type.STRING,
          description: "What this shortcut accomplishes.",
        },
      },
      required: ["shortcut"],
    },
  },
  {
    name: "take_screenshot",
    description: "Trigger a screen capture / screenshot of the user's desktop to analyze.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        focusArea: {
          type: Type.STRING,
          description: "Area of screen to capture (e.g., full screen, active window).",
        },
      },
    },
  },
  // --- DANGEROUS / IRREVERSIBLE ACTIONS (Requires explicit UI confirmation) ---
  {
    name: "delete_file",
    description: "DANGEROUS: Delete or remove a file or directory from the filesystem.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        filePath: {
          type: Type.STRING,
          description: "Path to the file or directory to delete.",
        },
        reason: {
          type: Type.STRING,
          description: "Why this file is being deleted.",
        },
      },
      required: ["filePath", "reason"],
    },
  },
  {
    name: "shutdown_computer",
    description: "DANGEROUS: Shut down or restart the computer system.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        action: {
          type: Type.STRING,
          description: "Either 'shutdown' or 'restart'.",
        },
        delaySeconds: {
          type: Type.NUMBER,
          description: "Seconds before shutdown starts.",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "install_software",
    description: "DANGEROUS: Download and install software, packages, or run shell install scripts.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        packageName: {
          type: Type.STRING,
          description: "Name of package or software to install (e.g. 'pip install numpy', 'npm install axios').",
        },
        manager: {
          type: Type.STRING,
          description: "Package manager (e.g. npm, pip, apt, brew).",
        },
      },
      required: ["packageName"],
    },
  },
  {
    name: "send_message",
    description: "DANGEROUS: Send an email, chat message, or external communication on behalf of user.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        recipient: {
          type: Type.STRING,
          description: "Recipient email address, phone, or username.",
        },
        content: {
          type: Type.STRING,
          description: "Message body to send.",
        },
      },
      required: ["recipient", "content"],
    },
  },
];
