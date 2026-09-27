// Voice Service for Speech-to-Text and Text-to-Speech

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export interface VoiceOption {
  name: string;
  lang: string;
  default: boolean;
}

class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (err) {
        console.warn("Speech recognition initialization failed:", err);
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public isSpeechSynthesisSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  public getAvailableVoices(): VoiceOption[] {
    if (!this.isSpeechSynthesisSupported()) return [];
    const voices = window.speechSynthesis.getVoices();
    return voices.map((v) => ({
      name: v.name,
      lang: v.lang,
      default: v.default,
    }));
  }

  public startListening(
    lang: string = "en-US",
    onResult: (text: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      this.initSpeechRecognition();
    }

    if (!this.recognition) {
      onError("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = lang;

    this.recognition.onstart = () => {
      this.isListening = true;
      onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let message = "Speech recognition error occurred.";
      if (event.error === "not-allowed") {
        message = "Microphone access was denied. Please allow microphone permissions.";
      } else if (event.error === "no-speech") {
        message = "No speech detected. Please try speaking closer to the microphone.";
      } else if (event.error === "network") {
        message = "Network error during speech recognition.";
      }
      onError(message);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    try {
      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      onError("Could not start microphone: " + (err.message || "Unknown error"));
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore already stopped
      }
      this.isListening = false;
    }
  }

  /**
   * Clean text for spoken audio so it doesn't pronounce markdown, code blocks, or raw JSON
   */
  public cleanTextForSpeech(text: string): string {
    return text
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, " Here is the code snippet. ")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove URLs
      .replace(/https?:\/\/\S+/g, "link")
      // Remove markdown headings and formatting
      .replace(/[#*_~`>-]/g, " ")
      // Remove extra spaces
      .replace(/\s+/g, " ")
      .trim();
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      voiceName?: string;
      lang?: string;
    } = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: string) => void
  ) {
    if (!this.isSpeechSynthesisSupported()) {
      onError?.("Text-to-speech is not supported in this browser.");
      return;
    }

    this.stopSpeaking();

    const spokenText = this.cleanTextForSpeech(text);
    if (!spokenText) {
      onEnd?.();
      return;
    }

    // Limit length to avoid synthesis timeout
    const utterance = new SpeechSynthesisUtterance(spokenText.slice(0, 1000));
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (options.voiceName) {
      const selected = voices.find((v) => v.name === options.voiceName);
      if (selected) utterance.voice = selected;
    } else {
      // Prioritize natural English or Urdu voices
      const natural = voices.find(
        (v) =>
          v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("Zira")
      );
      if (natural) utterance.voice = natural;
    }

    utterance.onstart = () => {
      this.currentUtterance = utterance;
      onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (e.error !== "canceled" && e.error !== "interrupted") {
        onError?.("Speech error: " + e.error);
      }
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (!this.isSpeechSynthesisSupported()) return false;
    return window.speechSynthesis.speaking;
  }
}

export const voiceService = new VoiceService();
