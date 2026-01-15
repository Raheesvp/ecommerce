import React from "react";
import { Save, X, RotateCcw } from "lucide-react";

const SaveCancelButtons = ({ onSave, onCancel, saving = false }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-8">
      {/* --- SAVE CHANGES (Primary Tactical Action) --- */}
      <button
        onClick={onSave}
        disabled={saving}
        className="group relative flex-1 flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-red-900/20 overflow-hidden"
      >
        {/* Shine Animation Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        <Save size={18} strokeWidth={2.5} className="relative z-10" />
        <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em] italic">
          {saving ? "Deploying..." : "Commit Changes"}
        </span>
      </button>

      {/* --- CANCEL (Secondary Ghost Action) --- */}
      <button
        onClick={onCancel}
        disabled={saving}
        className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-xl transition-all active:scale-[0.98]"
      >
        <RotateCcw size={18} strokeWidth={2.5} />
        <span className="text-xs font-black uppercase tracking-[0.2em] italic">
          Cancel
        </span>
      </button>
    </div>
  );
};

export default SaveCancelButtons;