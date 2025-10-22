// frontend/src/components/formBuilder/FormBuilderHeader.jsx
import React from 'react';
import { Eye, Code, Save, History, Loader } from 'lucide-react';

const FormBuilderHeader = ({
  formSettings,
  setFormSettings,
  showPreview,
  setShowPreview,
  showJson,
  setShowJson,
  onSave,
  isEditMode = false,
  currentVersion = null,
  onShowVersionHistory = null,
  loading = false,
}) => {
  return (
    <div className="bg-white border-b px-6 py-3">
      {/* Top row for Title and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-bold text-gray-700">
              {isEditMode ? 'Edit Form' : 'Form Builder'}
            </h1>
            {isEditMode && currentVersion && (
              <p className="text-xs text-gray-500 mt-1">
                Version {currentVersion}
              </p>
            )}
          </div>
          <input
            type="text"
            value={formSettings.title}
            onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
            className="px-3 py-1 border rounded-lg text-lg font-semibold min-w-[300px]"
            placeholder="Form Title"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Version History Button (only in edit mode) */}
          {isEditMode && onShowVersionHistory && (
            <button
              onClick={onShowVersionHistory}
              className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              title="View version history"
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>
          )}
          
          {/* Preview Button */}
          <button
            onClick={() => {
              setShowPreview(!showPreview);
              setShowJson(false);
            }}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          
          {/* JSON Button */}
          <button
            onClick={() => {
              setShowJson(!showJson);
              setShowPreview(false);
            }}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              showJson ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>JSON</span>
          </button>
          
          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={loading}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Form' : 'Save Form'}</span>
              </>
            )}
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
        <input
          type="text"
          value={formSettings.successMessage}
          onChange={(e) => setFormSettings({ ...formSettings, successMessage: e.target.value })}
          className="w-64 px-3 py-1 border rounded-lg text-sm"
          placeholder="Success Message"
        />
      </div>
    </div>
  );
};

export default FormBuilderHeader;