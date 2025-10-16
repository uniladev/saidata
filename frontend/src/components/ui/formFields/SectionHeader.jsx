import React from 'react';

const SectionHeader = ({ field }) => {
  return (
    <div className="border-b border-gray-200 pb-2">
      <h3 className="text-lg font-semibold text-gray-900">{field.label}</h3>
      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
};

export default SectionHeader;