// ===== 6. FieldPropertiesPanel Component =====
// frontend/src/components/formBuilder/FieldPropertiesPanel.jsx
import React from 'react';
import { X, Plus } from 'lucide-react';

const FieldPropertiesPanel = ({ field, onClose, updateField, optionHandlers }) => {
  if (!field) return null;

  const { addOption, updateOption, deleteOption } = optionHandlers;

  return (
    <div className="w-80 bg-white border-l overflow-y-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Field Properties</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, 'label', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Field Name</label>
          <input
            type="text"
            value={field.name}
            onChange={(e) => updateField(field.id, 'name', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {field.type !== 'section' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Placeholder</label>
              <input
                type="text"
                value={field.placeholder}
                onChange={(e) => updateField(field.id, 'placeholder', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Help Text</label>
              <input
                type="text"
                value={field.helpText}
                onChange={(e) => updateField(field.id, 'helpText', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`required-${field.id}`}
                checked={field.required}
                onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`required-${field.id}`}>Required</label>
            </div>
          </>
        )}

        {/* File specific options */}
        {field.type === 'file' && (
          <FileOptions field={field} updateField={updateField} />
        )}

        {/* Number/Range specific options */}
        {(field.type === 'number' || field.type === 'range') && (
          <NumberRangeOptions field={field} updateField={updateField} />
        )}

        {/* Textarea specific options */}
        {field.type === 'textarea' && (
          <TextareaOptions field={field} updateField={updateField} />
        )}

        {/* Rating specific options */}
        {field.type === 'rating' && (
          <RatingOptions field={field} updateField={updateField} />
        )}

        {/* Options for select, radio, checkbox */}
        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <FieldOptions 
            field={field} 
            addOption={addOption}
            updateOption={updateOption}
            deleteOption={deleteOption}
          />
        )}
      </div>
    </div>
  );
};

// Sub-components for specific field options
const FileOptions = ({ field, updateField }) => (
  <div className="space-y-3 border-t pt-3">
    <h4 className="font-medium">File Upload Options</h4>
    <div>
      <label className="block text-sm font-medium mb-1">Accept File Types</label>
      <input
        type="text"
        value={field.fileOptions.accept}
        onChange={(e) => updateField(field.id, 'fileOptions', {...field.fileOptions, accept: e.target.value})}
        placeholder="e.g., .pdf,.doc,.docx,image/*"
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Max File Size (MB)</label>
      <input
        type="number"
        value={field.fileOptions.maxSize}
        onChange={(e) => updateField(field.id, 'fileOptions', {...field.fileOptions, maxSize: parseInt(e.target.value)})}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={field.fileOptions.multiple}
        onChange={(e) => updateField(field.id, 'fileOptions', {...field.fileOptions, multiple: e.target.checked})}
        className="mr-2"
      />
      <label>Allow Multiple Files</label>
    </div>
  </div>
);

const NumberRangeOptions = ({ field, updateField }) => (
  <div className="space-y-3 border-t pt-3">
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-sm font-medium mb-1">Min</label>
        <input
          type="number"
          value={field.min}
          onChange={(e) => updateField(field.id, 'min', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Max</label>
        <input
          type="number"
          value={field.max}
          onChange={(e) => updateField(field.id, 'max', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
    {field.type === 'range' && (
      <div>
        <label className="block text-sm font-medium mb-1">Step</label>
        <input
          type="number"
          value={field.step}
          onChange={(e) => updateField(field.id, 'step', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
    )}
  </div>
);

const TextareaOptions = ({ field, updateField }) => (
  <div className="space-y-3 border-t pt-3">
    <div>
      <label className="block text-sm font-medium mb-1">Rows</label>
      <input
        type="number"
        value={field.rows}
        onChange={(e) => updateField(field.id, 'rows', parseInt(e.target.value))}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  </div>
);

const RatingOptions = ({ field, updateField }) => (
  <div className="space-y-3 border-t pt-3">
    <div>
      <label className="block text-sm font-medium mb-1">Max Rating</label>
      <input
        type="number"
        min="3"
        max="10"
        value={field.maxRating}
        onChange={(e) => updateField(field.id, 'maxRating', parseInt(e.target.value))}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  </div>
);

const FieldOptions = ({ field, addOption, updateOption, deleteOption }) => (
  <div className="space-y-3 border-t pt-3">
    <div className="flex justify-between items-center">
      <h4 className="font-medium">Options</h4>
      <button
        onClick={() => addOption(field.id)}
        className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
      >
        <Plus className="w-4 h-4 mr-1" /> Add Option
      </button>
    </div>
    <div className="space-y-2">
      {field.options.map((option, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={option.label}
            onChange={(e) => updateOption(field.id, index, 'label', e.target.value)}
            placeholder="Label"
            className="flex-1 px-2 py-1 border rounded"
          />
          <input
            type="text"
            value={option.value}
            onChange={(e) => updateOption(field.id, index, 'value', e.target.value)}
            placeholder="Value"
            className="flex-1 px-2 py-1 border rounded"
          />
          <button
            onClick={() => deleteOption(field.id, index)}
            className="text-red-500 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default FieldPropertiesPanel;