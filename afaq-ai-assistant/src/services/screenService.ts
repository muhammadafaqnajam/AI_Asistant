// Screen Service for capturing user's computer screen securely

export interface SampleScreenOption {
  id: string;
  name: string;
  description: string;
  category: string;
  imageDataUrl: string;
}

/**
 * Creates SVG-based high-res realistic screenshots for instant testing
 */
function createMockScreenSvg(title: string, app: string, codeOrError: string, subtitle: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
    </defs>
    <!-- Desktop Background -->
    <rect width="1280" height="720" fill="url(#bg)"/>
    
    <!-- Top Bar -->
    <rect width="1280" height="32" fill="#1e293b"/>
    <text x="20" y="21" fill="#94a3b8" font-family="sans-serif" font-size="13">Desktop &gt; ${app} &gt; Active Window</text>
    <text x="1200" y="21" fill="#cbd5e1" font-family="sans-serif" font-size="13">10:45 AM</text>

    <!-- App Window Frame -->
    <rect x="80" y="60" width="1120" height="600" rx="8" fill="#111827" stroke="#334155" stroke-width="2"/>
    <!-- Titlebar -->
    <rect x="80" y="60" width="1120" height="40" rx="8" fill="#1f2937"/>
    <circle cx="106" cy="80" r="6" fill="#ef4444"/>
    <circle cx="126" cy="80" r="6" fill="#f59e0b"/>
    <circle cx="146" cy="80" r="6" fill="#10b981"/>
    <text x="560" y="85" fill="#e2e8f0" font-family="sans-serif" font-size="14" font-weight="bold">${title}</text>

    <!-- Main Content Area -->
    <rect x="96" y="112" width="1088" height="532" rx="4" fill="#030712"/>
    
    <!-- Code / Error Content -->
    <text x="120" y="150" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">// File: app.py - Python 3.11 Runtime</text>
    <text x="120" y="180" fill="#94a3b8" font-family="monospace" font-size="14">${subtitle}</text>
    
    <rect x="120" y="210" width="1040" height="300" rx="6" fill="#18181b" stroke="#ef4444" stroke-width="1.5"/>
    <text x="140" y="245" fill="#f87171" font-family="monospace" font-size="15" font-weight="bold">Traceback (most recent call last):</text>
    <text x="140" y="275" fill="#e4e4e7" font-family="monospace" font-size="14">  File "/workspace/src/app.py", line 42, in process_data</text>
    <text x="160" y="300" fill="#a1a1aa" font-family="monospace" font-size="14">    result = calculate_metrics(items[idx])</text>
    <text x="140" y="335" fill="#f87171" font-family="monospace" font-size="15" font-weight="bold">IndexError: list index out of range</text>
    <text x="140" y="370" fill="#60a5fa" font-family="monospace" font-size="14">  Details: Attempted access at idx = 5, but len(items) is only 4.</text>
    <text x="140" y="405" fill="#34d399" font-family="monospace" font-size="14">  [SUGGESTION] Check loop boundary or add if idx &lt; len(items): guard.</text>
    <text x="140" y="450" fill="#9ca3af" font-family="monospace" font-size="13">Terminal Status: Process exited with exit code 1 (Press any key to debug)</text>

    <!-- Buttons -->
    <rect x="140" y="550" width="120" height="36" rx="6" fill="#3b82f6"/>
    <text x="175" y="573" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">Run Debug</text>

    <rect x="276" y="550" width="120" height="36" rx="6" fill="#374151"/>
    <text x="312" y="573" fill="#e5e7eb" font-family="sans-serif" font-size="13">Clear Log</text>
  </svg>`;
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

function createReactMockScreen(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <rect width="1280" height="720" fill="#090d16"/>
    <rect width="1280" height="36" fill="#1e293b"/>
    <text x="20" y="23" fill="#94a3b8" font-family="sans-serif" font-size="13">VS Code — Afaq Desktop Project [Workspace]</text>
    <rect x="60" y="56" width="1160" height="610" rx="8" fill="#0d1117" stroke="#30363d" stroke-width="1.5"/>
    <rect x="60" y="56" width="1160" height="36" rx="8" fill="#161b22"/>
    <circle cx="85" cy="74" r="6" fill="#ff5f56"/>
    <circle cx="105" cy="74" r="6" fill="#ffbd2e"/>
    <circle cx="125" cy="74" r="6" fill="#27c93f"/>
    <text x="150" y="78" fill="#c9d1d9" font-family="sans-serif" font-size="13">src/components/Dashboard.tsx</text>
    <text x="100" y="140" fill="#ff7b72" font-family="monospace" font-size="14">import</text>
    <text x="155" y="140" fill="#79c0ff" font-family="monospace" font-size="14">React, { useState, useEffect }</text>
    <text x="380" y="140" fill="#ff7b72" font-family="monospace" font-size="14">from</text>
    <text x="425" y="140" fill="#a5d6ff" font-family="monospace" font-size="14">'react';</text>
    <text x="100" y="180" fill="#d2a8ff" font-family="monospace" font-size="14">export default function Dashboard() {</text>
    <text x="130" y="210" fill="#79c0ff" font-family="monospace" font-size="14">  const [data, setData] = useState&lt;Item[]&gt;([]);</text>
    <text x="130" y="240" fill="#ffa657" font-family="monospace" font-size="14">  // ERROR ON LINE 24:</text>
    <text x="130" y="270" fill="#f85149" font-family="monospace" font-size="14">  TypeError: Cannot read properties of undefined (reading 'map')</text>
    <text x="130" y="310" fill="#8b949e" font-family="monospace" font-size="14">  return &lt;div&gt;{data.items.map(i =&gt; &lt;span&gt;{i.name}&lt;/span&gt;)}&lt;/div&gt;;</text>
    <text x="100" y="340" fill="#d2a8ff" font-family="monospace" font-size="14">}</text>
    <rect x="100" y="420" width="1080" height="180" rx="4" fill="#040d21" stroke="#f85149" stroke-width="1"/>
    <text x="120" y="455" fill="#f85149" font-family="sans-serif" font-size="14" font-weight="bold">🚨 Unhandled Runtime Error: TypeError</text>
    <text x="120" y="485" fill="#c9d1d9" font-family="sans-serif" font-size="13">Cannot read properties of undefined (reading 'map')</text>
    <text x="120" y="520" fill="#58a6ff" font-family="sans-serif" font-size="13">Solution: Use optional chaining (data?.items?.map) or initialize data state with default items: []</text>
  </svg>`;
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

export const sampleScreens: SampleScreenOption[] = [
  {
    id: "python_error",
    name: "Python IndexError in Terminal",
    description: "Desktop terminal showing Python traceback 'IndexError: list index out of range'.",
    category: "Code & Terminal",
    imageDataUrl: createMockScreenSvg(
      "VS Code — Python Debugger",
      "Terminal",
      "IndexError: list index out of range",
      "Running data processing pipeline on local machine..."
    ),
  },
  {
    id: "react_typeerror",
    name: "React TypeError in Browser",
    description: "Browser & code editor displaying 'Cannot read properties of undefined (reading map)'.",
    category: "Web Development",
    imageDataUrl: createReactMockScreen(),
  },
];

export const screenService = {
  /**
   * Captures screen explicitly via browser getDisplayMedia.
   * Stops tracks immediately right after grabbing the frame for zero secret monitoring.
   */
  async captureLiveScreen(): Promise<string> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      throw new Error("Display capture API is not supported in this browser.");
    }

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
        },
        audio: false,
      });

      const track = stream.getVideoTracks()[0];
      if (!track) {
        throw new Error("No video track found in screen capture stream.");
      }

      // Create video element to read frame
      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;

      await video.play();

      // Wait a moment for frame to stabilize
      await new Promise((resolve) => setTimeout(resolve, 350));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to create canvas context.");
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Clean up track immediately - NO persistent background recording
      stream.getTracks().forEach((t) => t.stop());
      video.pause();
      video.srcObject = null;

      // Convert to high-quality JPEG
      const base64Data = canvas.toDataURL("image/jpeg", 0.85);
      return base64Data;
    } catch (err: any) {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (err.name === "NotAllowedError" || err.message?.includes("Permission denied")) {
        throw new Error("Screen capture permission was cancelled or denied by user.");
      }
      throw err;
    }
  },

  /**
   * Read image file uploaded by user
   */
  async readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read image file."));
      };
      reader.readAsDataURL(file);
    });
  },
};
