// ===== FormActions Component =====
// frontend/src/components/formTaker/FormActions.jsx
import React from 'react';
import { Save, Download, RotateCcw } from 'lucide-react';

const FormActions = ({ submitText, onExport, onReset, hasData }) => {
  return (
    <div className="mt-8 pt-6 border-t space-y-3">
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
      >
        <Save className="w-5 h-5 mr-2" />
        {submitText || 'Submit Form'}
      </button>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          type="button"
          onClick={onExport}
          disabled={!hasData}
          className="bg-gray-700 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </button>
        
        <button 
          type="button"
          onClick={onReset}
          className="bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Form
        </button>
      </div>
    </div>
  );
};

export default FormActions;
