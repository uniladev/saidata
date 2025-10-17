// ===== 2. FieldTypeSidebar Component =====
// frontend/src/components/formBuilder/FieldTypeSidebar.jsx
import React from 'react';

const FieldTypeSidebar = ({ fieldTypes, onAddField, setDragAction }) => {
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('newFieldType', type);
    e.dataTransfer.effectAllowed = 'copy';
    setDragAction('add');
  };

  return (
    <div className="w-64 bg-white border-r p-4 overflow-y-auto">
      <h2 className="font-semibold mb-4">Field Types</h2>
      <div className="space-y-2">
        {fieldTypes.map((fieldType) => (
          <div
            key={fieldType.type}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, fieldType.type)}
            onClick={() => onAddField(fieldType.type)}
            className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center space-x-2 transition-colors cursor-grab"
          >
            <span className="text-xl">{fieldType.icon}</span>
            <span className="text-sm">{fieldType.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldTypeSidebar;    