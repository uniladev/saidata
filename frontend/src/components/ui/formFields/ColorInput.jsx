// frontend/src/components/ui/formFields/ColorInput.jsx
import React from 'react';

const ColorInput = ({ field, value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex items-center space-x-3">
        <input
          type="color"
          name={field.name}
          value={value || '#000000'}
          required={field.required}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="h-10 w-20 border-2 border-gray-300 rounded cursor-pointer"
        />
        <span className="text-sm font-mono text-gray-600">
          {value || '#000000'}
        </span>
      </div>
      
      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
};

export default ColorInput;