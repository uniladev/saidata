// ===== 1. FormBuilderHeader Component =====
// frontend/src/components/formBuilder/FormBuilderHeader.jsx
import React from 'react';
import { Eye, Code, Save } from 'lucide-react';

const FormBuilderHeader = ({
  formSettings,
  setFormSettings,
  showPreview,
  setShowPreview,
  showJson,
  setShowJson,
  onSave,
}) => {
  return (
    <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Form Builder</h1>
        <input
          type="text"
          value={formSettings.title}
          onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
          className="px-3 py-1 border rounded-lg"
          placeholder="Form Title"
        />
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
        <button
          onClick={() => setShowJson(!showJson)}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            showJson ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>JSON</span>
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700"
        >
          <Save className="w-4 h-4" />
          <span>Save Form</span>
        </button>
      </div>
    </div>
  );
};

export default FormBuilderHeader;