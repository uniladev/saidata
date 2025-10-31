import React from 'react';
import { X } from 'lucide-react';

const AddServiceChoiceModal = ({ onClose, onCreateForm, onAddExistingForm }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full flex flex-col animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">Add Service</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" type="button">
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <button
          onClick={onCreateForm}
          className="w-full px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all"
        >
          + Create New Form
        </button>
        <button
          onClick={onAddExistingForm}
          className="w-full px-5 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-sm transition-all"
        >
          + Add Existing Form
        </button>
      </div>
    </div>
  </div>
);

export default AddServiceChoiceModal;