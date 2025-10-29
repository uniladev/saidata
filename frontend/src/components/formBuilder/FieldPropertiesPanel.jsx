// frontend/src/components/formBuilder/FieldPropertiesPanel.jsx
import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';

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

// Enhanced File Options Component with Better UX
const FileOptions = ({ field, updateField }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Preset file type categories
  const fileTypePresets = [
    {
      label: 'Images',
      icon: '🖼️',
      value: 'image/*',
      description: 'JPG, PNG, GIF, WebP'
    },
    {
      label: 'Documents',
      icon: '📄',
      value: '.pdf,.doc,.docx,.txt,.rtf',
      description: 'PDF, Word, Text'
    },
    {
      label: 'Spreadsheets',
      icon: '📊',
      value: '.xls,.xlsx,.csv',
      description: 'Excel, CSV'
    },
    {
      label: 'Videos',
      icon: '🎥',
      value: 'video/*',
      description: 'MP4, AVI, MOV'
    },
    {
      label: 'Audio',
      icon: '🎵',
      value: 'audio/*',
      description: 'MP3, WAV, OGG'
    },
    {
      label: 'Archives',
      icon: '📦',
      value: '.zip,.rar,.7z,.tar,.gz',
      description: 'ZIP, RAR, 7Z'
    },
    {
      label: 'PDF Only',
      icon: '📕',
      value: '.pdf',
      description: 'PDF files only'
    },
    {
      label: 'All Files',
      icon: '📁',
      value: '',
      description: 'Any file type'
    }
  ];

  const currentAccept = field.fileOptions?.accept || '';
  
  const handlePresetClick = (presetValue) => {
    updateField(field.id, 'fileOptions', {
      ...(field.fileOptions || {}),
      accept: presetValue
    });
    setShowCustomInput(false);
  };

  const handleCustomAccept = (value) => {
    updateField(field.id, 'fileOptions', {
      ...(field.fileOptions || {}),
      accept: value
    });
  };

  // Check if current value matches any preset
  const isCustomValue = !fileTypePresets.some(preset => preset.value === currentAccept);

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="font-medium text-gray-900">File Upload Options</h4>
      
      {/* File Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accepted File Types
        </label>
        
        {/* Preset Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {fileTypePresets.map((preset) => {
            const isSelected = currentAccept === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.value)}
                className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <span className="text-xl">{preset.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {preset.label}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'} truncate`}>
                      {preset.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Input Toggle */}
        <button
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          {showCustomInput ? '− Hide' : '+ Custom'} file types
        </button>

        {/* Custom Input Field */}
        {(showCustomInput || isCustomValue) && (
          <div className="mt-3">
            <input
              type="text"
              value={currentAccept}
              onChange={(e) => handleCustomAccept(e.target.value)}
              placeholder="e.g., .pdf,.doc,.docx,image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter file extensions separated by commas
            </p>
          </div>
        )}

        {/* Current Selection Display */}
        {currentAccept && (
          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-medium mb-1">Currently accepting:</p>
            <code className="text-xs text-blue-600 break-all">
              {currentAccept || 'All file types'}
            </code>
          </div>
        )}
      </div>

      {/* Max File Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max File Size
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max="100"
            value={field.fileOptions?.maxSize || 1}
            onChange={(e) => updateField(field.id, 'fileOptions', {
              ...(field.fileOptions || {}),
              maxSize: parseInt(e.target.value) || 1
            })}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-600">MB</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Maximum size per file (1-100 MB)
        </p>
      </div>

      {/* Multiple Files Checkbox */}
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id={`multiple-${field.id}`}
          checked={field.fileOptions?.multiple || false}
          onChange={(e) => updateField(field.id, 'fileOptions', {
            ...(field.fileOptions || {}),
            multiple: e.target.checked
          })}
          className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor={`multiple-${field.id}`} className="text-sm text-gray-700">
          <span className="font-medium">Allow multiple files</span>
          <p className="text-xs text-gray-500 mt-0.5">
            Users can upload more than one file
          </p>
        </label>
      </div>
    </div>
  );
};

const NumberRangeOptions = ({ field, updateField }) => (
  <div className="space-y-3 border-t pt-3">
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-sm font-medium mb-1">Min</label>
        <input
          type="number"
          value={field.min || ''}
          onChange={(e) => updateField(field.id, 'min', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Max</label>
        <input
          type="number"
          value={field.max || ''}
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
          value={field.step || 1}
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
        value={field.rows || 4}
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
        value={field.maxRating || 5}
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
      {(field.options || []).map((option, index) => (
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