import React from 'react';

const CheckboxInput = ({ field, value, onChange }) => {
  const currentValues = value || [];

  const handleCheckboxChange = (e) => {
    const { value: optionValue, checked } = e.target;
    let newValues;

    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter((v) => v !== optionValue);
    }
    onChange(field.name, newValues);
  };

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
              name={`${field.name}[]`}
              type="checkbox"
              value={option.value}
              checked={currentValues.includes(option.value)}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

export default CheckboxInput;