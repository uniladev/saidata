import React from 'react';

const TextAreaInput = ({ field, value, onChange }) => {
  return (
    <>
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={field.id}
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        rows={field.rows || 4}
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

export default TextAreaInput;