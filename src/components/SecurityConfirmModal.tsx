import React from "react";
import { AlertTriangle, ShieldAlert, Check, X } from "lucide-react";
import { ToolCall } from "../types/assistant";

interface SecurityConfirmModalProps {
  tool: ToolCall | null;
  isOpen: boolean;
  onConfirm: (tool: ToolCall) => void;
  onCancel: () => void;
}

export const SecurityConfirmModal: React.FC<SecurityConfirmModalProps> = ({
  tool,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !tool) return null;

  const getActionImpactExplanation = (name: string, args: Record<string, any>) => {
    switch (name) {
      case "delete_file":
        return {
          title: "Delete File or Directory",
          warning: "This will permanently remove the specified file from the system storage. Irreversible data loss may occur.",
          details: `Target File: ${args.filePath || "Unknown"} (Reason: ${args.reason || "Not specified"})`,
          severity: "high",
        };
      case "shutdown_computer":
        return {
          title: "Computer Power Action",
          warning: `This will trigger an immediate ${args.action || "shutdown"} command. Unsaved desktop work will be lost.`,
          details: `Action: ${args.action || "shutdown"}, Delay: ${args.delaySeconds || 0}s`,
          severity: "critical",
        };
      case "install_software":
        return {
          title: "Install Software / Package",
          warning: "Installing software will modify your system environment and download external binaries or dependencies.",
          details: `Package: ${args.packageName || "Unknown"} (Manager: ${args.manager || "default"})`,
          severity: "medium",
        };
      case "send_message":
        return {
          title: "Send External Communication",
          warning: "This will transmit an outbound email or chat message to a third-party recipient.",
          details: `Recipient: ${args.recipient || "Unknown"}, Content: "${args.content || ""}"`,
          severity: "high",
        };
      default:
        return {
          title: "Elevated Computer Action",
          warning: "This action could modify your system configuration or external data.",
          details: JSON.stringify(args, null, 2),
          severity: "medium",
        };
    }
  };

  const impact = getActionImpactExplanation(tool.name, tool.args);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-amber-950/60 border-b border-amber-800/80 px-6 py-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-200">
              Security Confirmation Required
            </h3>
            <p className="text-xs text-amber-300/80">
              Afaq AI Safety Protocol: Review potential risk before execution
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="text-center py-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Are you sure?
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mt-1">
              Action: {impact.title}
            </p>
          </div>

          {/* Warning Card */}
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-200 leading-relaxed">
              {impact.warning}
            </p>
          </div>

          {/* Command Parameters */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Command Parameters:
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              {impact.details}
            </div>
          </div>
        </div>

        {/* Modal Footer with Confirm & Cancel Buttons */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <button
            onClick={() => onConfirm(tool)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-950/50 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Execute</span>
          </button>
        </div>
      </div>
    </div>
  );
};
