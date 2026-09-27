import React, { useState } from "react";
import {
  Camera,
  X,
  Upload,
  Sparkles,
  AlertCircle,
  Monitor,
  CheckCircle,
  FileCode,
} from "lucide-react";
import { screenService, sampleScreens, SampleScreenOption } from "../services/screenService";

interface ScreenCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (imageBase64: string, userQuery: string) => void;
}

export const ScreenCaptureModal: React.FC<ScreenCaptureModalProps> = ({
  isOpen,
  onClose,
  onAnalyze,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLiveCapture = async () => {
    setIsCapturing(true);
    setCaptureError(null);
    try {
      const dataUrl = await screenService.captureLiveScreen();
      setSelectedImage(dataUrl);
    } catch (err: any) {
      setCaptureError(
        err.message ||
          "Could not capture screen. You can select one of the realistic sample screens below or upload an image."
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCaptureError(null);
    try {
      const dataUrl = await screenService.readFileAsBase64(file);
      setSelectedImage(dataUrl);
    } catch {
      setCaptureError("Failed to read image file.");
    }
  };

  const handleSelectSample = (sample: SampleScreenOption) => {
    setSelectedImage(sample.imageDataUrl);
    setCaptureError(null);
  };

  const handleConfirmAnalyze = () => {
    if (!selectedImage) return;
    onAnalyze(
      selectedImage,
      userQuery.trim() ||
        "Please analyze this screen: list visible applications, buttons, text, errors, what I am doing, and recommended next steps."
    );
    setSelectedImage(null);
    setUserQuery("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>See My Computer</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  Vision Mode
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Explicit single-frame snapshot sent directly to Gemini Vision
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

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Security & Privacy Banner */}
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 flex items-start gap-2.5 text-xs text-blue-200">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong>Privacy Guaranteed:</strong> Afaq AI never secretly records or monitors your computer. Screen access requires this explicit single snapshot trigger.
            </p>
          </div>

          {captureError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
              {captureError}
            </div>
          )}

          {/* Action Trigger Buttons */}
          {!selectedImage ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Live Screen Share Button */}
                <button
                  onClick={handleLiveCapture}
                  disabled={isCapturing}
                  className="p-4 rounded-xl border border-amber-600/50 bg-gradient-to-br from-amber-950/40 to-slate-900 hover:border-amber-500 hover:from-amber-950/60 transition-all text-left group shadow-lg flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Monitor className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                      Live Desktop
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-200">
                      📷 Capture My Live Screen
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Pick any screen, window, or app tab to snapshot.
                    </p>
                  </div>
                </button>

                {/* Upload Screenshot File Button */}
                <label className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 transition-all text-left cursor-pointer group flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <Upload className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                      File Upload
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-200">
                      Upload Screenshot File
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose a PNG or JPG file from your drive.
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Realistic Sample Screens Section */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Or Test Instantly With Sample Desktop Screens:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sampleScreens.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 transition-all text-left group flex items-start gap-2.5"
                    >
                      <FileCode className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                          {sample.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {sample.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Screenshot Preview & Query Input */
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video max-h-64 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Captured Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-xs text-white border border-slate-700 shadow"
                >
                  Change Image
                </button>
              </div>

              {/* Specific Question Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  What should Afaq AI focus on? (Optional)
                </label>
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g., Why is my code failing? What button should I click?"
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          {selectedImage && (
            <button
              onClick={handleConfirmAnalyze}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/50 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Screen with Gemini</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
