import React from 'react';

const RadioInput = ({ field, value, onChange }) => {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      <div className="mt-2 space-y-2">
        {field.options.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              id={`${field.id}-${index}`}
              name={field.name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              required={field.required}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor={`${field.id}-${index}`} className="ml-3 block text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {field.helpText && (
        <p className="mt-2 text-sm text-gray-500">{field.helpText}</p>
      )}
    </fieldset>
  );
};

export default RadioInput;