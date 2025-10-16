import React from 'react';

const FileInput = ({ field, onChange }) => {
  // File inputs are uncontrolled, so we don't use the 'value' prop
  return (
    <>
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={field.id}
        type="file"
        name={field.name}
        required={field.required}
        accept={field.fileOptions?.accept}
        multiple={field.fileOptions?.multiple}
        onChange={(e) => onChange(field.name, e.target.files)}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {field.helpText && (
        <p className="mt-2 text-sm text-gray-500">{field.helpText}</p>
      )}
    </>
  );
};

export default FileInput;