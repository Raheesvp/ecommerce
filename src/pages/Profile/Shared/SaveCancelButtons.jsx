import React from "react";
import { Save, X } from "lucide-react";

const SaveCancelButtons = ({ onSave, onCancel, saving = false }) => {
  return (
    <div className="flex gap-3 pt-6">
      <button
        onClick={onSave}
        disabled={saving}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl transition-all font-medium"
      >
        <Save size={18} />
        Save Changes
      </button>

      <button
        onClick={onCancel}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all font-medium"
      >
        <X size={18} />
        Cancel
      </button>
    </div>
  );
};

export default SaveCancelButtons;
