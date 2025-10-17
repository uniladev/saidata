// frontend/src/components/ui/formFields/RangeInput.jsx
import React from 'react';

const RangeInput = ({ field, value, onChange }) => {
  const currentValue = value || Math.floor((field.min + field.max) / 2);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="space-y-2">
        <input
          type="range"
          name={field.name}
          min={field.min || 0}
          max={field.max || 100}
          step={field.step || 1}
          value={currentValue}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{field.min || 0}</span>
          <span className="text-lg font-semibold text-blue-600">{currentValue}</span>
          <span className="text-sm text-gray-500">{field.max || 100}</span>
        </div>
      </div>
      
      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
};

export default RangeInput;