// ===== 1. FormBuilderHeader Component =====
// in src/components/formBuilder/FormBuilderHeader.jsx
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
    <div className="bg-white border-b px-6 py-3">
      {/* Top row for Title and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-700">Form Builder</h1>
          <input
            type="text"
            value={formSettings.title}
            onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
            className="px-3 py-1 border rounded-lg text-lg font-semibold"
            placeholder="Form Title"
          />
        </div>
        <div className="flex items-center space-x-2">
          {/* Action Buttons */}
          <button
            onClick={() => {
              setShowPreview(!showPreview);
              setShowJson(false);
            }}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => {
              setShowJson(!showJson);
              setShowPreview(false);
            }}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              showJson ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
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
      
      {/* Bottom row for Description and Submit Text */}
      <div className="flex items-center space-x-4 mt-3">
        <input
          type="text"
          value={formSettings.description}
          onChange={(e) => setFormSettings({ ...formSettings, description: e.target.value })}
          className="flex-1 px-3 py-1 border rounded-lg text-sm"
          placeholder="Form Description"
        />
        <input
          type="text"
          value={formSettings.submitText}
          onChange={(e) => setFormSettings({ ...formSettings, submitText: e.target.value })}
          className="w-48 px-3 py-1 border rounded-lg text-sm"
          placeholder="Submit Button Text"
        />
      </div>
    </div>
  );
};

export default FormBuilderHeader;