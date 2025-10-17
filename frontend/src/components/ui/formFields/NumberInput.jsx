import React from 'react';

const NumberInput = ({ field, value, onChange }) => {
  return (
    <>
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={field.id}
        type="number"
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        min={field.min}
        max={field.max}
        step={field.step}
        value={value || ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {field.helpText && (
        <p className="mt-2 text-sm text-gray-500">{field.helpText}</p>
      )}
    </>
  );
};

export default NumberInput;