# Afaq AI Assistant 🤖✨

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

> A professional desktop-style AI personal assistant inspired by Google Assistant, built with a modern dark interface, interactive glowing AI avatar, two-way voice interaction, screen vision analysis ("See My Computer"), safe computer control with security confirmation dialogs, and multilingual intelligence.

---

## 🌟 Key Features

1. **Desktop-Style AI Interface:**
   - Circular AI avatar with dynamic glowing states:
     - 🔵 **Ready:** Gentle ambient blue/cyan aura
     - 🎙️ **Listening:** Reactive multi-ring audio pulse
     - 🧠 **Thinking:** Vortex gradient rotating vortex
     - 🔊 **Speaking:** Audio wave visualizer and glowing halo
     - 👁️ **Computer Vision:** Scanning laser reticle & grid
   - macOS-style window dots, clean status indicators, and responsive dark layout.

2. **Multilingual AI Intelligence:**
   - Fluent conversational responses in **Roman Urdu**, **Urdu script (نستعلیق)**, and **English**.
   - Programming & technical assistance: writes and debugs **Python**, **C++**, **HTML**, **CSS**, and **JavaScript** with code highlighting and one-click copy.
   - Explains complex topics in intuitive, simple language.

3. **Two-Way Voice Assistant:**
   - **Speech-to-Text:** Live microphone transcription with interactive visual feedback.
   - **Text-to-Speech:** Natural audio playback with code-stripping filters so the assistant speaks naturally without reading out brackets or raw code.
   - Instant **⏹ Stop** button to pause speaking at any time.

4. **"See My Computer" (Vision Analysis):**
   - Explicit user-triggered desktop screen capture (`getDisplayMedia`).
   *Zero secret recording:* capture occurs only when the user explicitly clicks **📷 Analyze Screen**.
   - Gemini Vision analyzes visible applications, UI buttons, text, terminal tracebacks, and provides step-by-step troubleshooting recommendations.
   - Includes built-in realistic sample screens for instant offline/browser testing.

5. **Safe Computer Control & Tool Architecture:**
   - Modular tools: `open_website`, `search_google`, `open_application`, `type_text`, `keyboard_shortcut`, `take_screenshot`.
   - **Security Confirmation Gate:** Irreversible commands (`delete_file`, `shutdown_computer`, `install_software`, `send_message`) prompt the user with an **"Are you sure?"** dialog featuring Confirm / Cancel buttons before anything runs.

6. **Centralized AI Brain:**
   - Model configuration is maintained in **one single file** (`server/geminiConfig.ts`).
   - Server-side API key handling keeps credentials secure from the browser.

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── .gitignore                # Protects secrets & node_modules
├── index.html                # App entry point with fonts & metadata
├── metadata.json             # AI Studio frame permissions & capabilities
├── package.json              # Project scripts & dependencies
├── server.ts                 # Full-stack Express server + Vite middleware
├── server/
│   └── geminiConfig.ts       # 🧠 ONE centralized place for MODEL & API config
├── public/
│   └── favicon.svg           # Desktop assistant SVG icon
├── src/
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind v4 styles, scrollbars & keyframes
│   ├── App.tsx               # Main Desktop GUI & assistant state machine
│   ├── types/
│   │   └── assistant.ts      # TypeScript interfaces
│   ├── services/
│   │   ├── geminiService.ts  # Client API calls to backend proxy
│   │   ├── voiceService.ts   # Speech-to-Text & Text-to-Speech service
│   │   └── screenService.ts  # Screen snapshot capture & vision tools
│   └── components/
│       ├── TitleBar.tsx      # Desktop title bar, window controls & quick toggles
│       ├── AvatarOrb.tsx     # Central glowing animated AI avatar
│       ├── ChatArea.tsx       # Conversation view with code blocks & copy buttons
│       ├── InputBar.tsx       # Mic button, input box, send & action chips
│       ├── ScreenCaptureModal.tsx # "See My Computer" explicit snapshot modal
│       ├── SecurityConfirmModal.tsx # "Are you sure?" confirmation dialog
│       ├── SettingsModal.tsx  # Voice, language, memory & security settings
│       ├── BeginnerGuideModal.tsx # Complete 10-step documentation modal
│       ├── ImageViewModal.tsx # Enlarged screenshot viewer
│       └── ActionToast.tsx    # Tool execution status notifications
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite bundler & alias setup
```

---

## 📋 System Requirements

* **Node.js:** v18.0.0 or higher (v20+ recommended)
* **npm:** v9.0.0 or higher
* **Browser:** Google Chrome, Microsoft Edge, or any Chromium browser (for full Web Speech API and screen sharing support)
* **Gemini API Key:** Free key from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/afaq-ai-assistant.git
cd afaq-ai-assistant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Your Gemini API Key

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` in your text editor and add your key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```

> 🔒 **Security Notice:** The `.env` file is excluded by `.gitignore` and will never be committed to GitHub.

### 4. Run the Development Server

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:3000
```

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express full-stack server with Vite middleware in development mode on port 3000 |
| `npm run build` | Compiles client assets into the `dist/` directory for production |
| `npm run start` | Launches the production Express server serving the compiled `dist/` assets |
| `npm run lint` | Runs the TypeScript compiler (`tsc --noEmit`) to check for type errors |
| `npm run clean` | Removes the `dist/` folder |

---

## 🧪 Testing the Features

### 1. Test Multilingual Chat
* Type in **English:** *"Explain how async/await works in JavaScript."*
* Type in **Roman Urdu:** *"Python me binary search ka function likh dein aur samjhayein."*
* Type in **Urdu script:** *"مجھے بتائیں کہ کمپیوٹر وژن کیا ہوتا ہے؟"*

### 2. Test Voice Interaction
* Click the **🎤 Microphone** button or the **Central Avatar**.
* Speak your query into your microphone.
* Afaq AI will transcribe your speech and read the response back aloud.
* Click **⏹ Stop** at any time to pause or cancel speech.

### 3. Test "See My Computer"
* Click **📷 Analyze Screen** in the bottom action bar.
* Choose **Capture My Live Screen** (or pick one of the built-in sample screens like *Python IndexError in Terminal*).
* Click **Analyze Screen with Gemini**.
* Receive a structured breakdown of visible applications, buttons, text, errors, and recommended next steps.

### 4. Test Safe Computer Control
* **Safe command:** *"Search Google for Vite documentation"* &rarr; Opens a Google search safely in a new tab.
* **Risky command:** *"Delete the file database.sqlite"* &rarr; Intercepted by the **"Are you sure?"** confirmation modal before anything is executed.

---

## 🔒 Security & Privacy

* **Zero Key Leakage:** `GEMINI_API_KEY` is kept exclusively on the server (`server/geminiConfig.ts`) and is never sent to the browser.
* **Explicit Screen Capture:** Screen capture requires an active user click per capture. No continuous or background recording is ever performed.
* **Confirmation Gate:** Dangerous or irreversible operations always require explicit confirmation (`Confirm / Cancel`).

---

## 🌐 Deployment

### Deploying to Render / Railway / Cloud Run

1. Connect your GitHub repository to your hosting provider.
2. Set the build and start commands:
   * **Build Command:** `npm run build`
   * **Start Command:** `npm run start`
3. Add the environment variable:
   * `GEMINI_API_KEY` = *your Google AI Studio key*
   * `NODE_ENV` = `production`
4. Set the port to `3000` (or allow the host's `$PORT` environment variable to be picked up).

---

## ❓ Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Microphone not working** | Browser permissions blocked | Click the padlock or settings icon in your browser address bar and enable Microphone access. Use Google Chrome or Edge. |
| **Screen capture error** | Browser display-capture denied | Select a specific application window or use the built-in **Sample Desktop Screens** option in the modal. |
| **API Error 500** | Missing or invalid `GEMINI_API_KEY` | Ensure `.env` contains a valid key from Google AI Studio and restart the server (`npm run dev`). |
| **Port 3000 in use** | Another service using port 3000 | Set `PORT=3001` in your `.env` file or kill the existing process. |

---

## 📄 License

This project is licensed under the Apache 2.0 License.
