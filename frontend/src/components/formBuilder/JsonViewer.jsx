// ===== 5. JsonViewer Component =====
// frontend/src/components/formBuilder/JsonViewer.jsx
import React from 'react';

const JsonViewer = ({ formJson }) => {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
        {JSON.stringify(formJson, null, 2)}
      </pre>
    </div>
  );
};

export default JsonViewer;