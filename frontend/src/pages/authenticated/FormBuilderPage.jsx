import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Copy, Trash2, GripVertical, Plus, X, Settings, Eye, Save, Code, Play } from 'lucide-react';

// Field type definitions
const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'textarea', label: 'Text Area', icon: '📄' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'select', label: 'Dropdown', icon: '📋' },
  { type: 'radio', label: 'Radio Button', icon: '⭕' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'time', label: 'Time', icon: '⏰' },
  { type: 'file', label: 'File Upload', icon: '📎' },
  { type: 'rating', label: 'Rating', icon: '⭐' },
  { type: 'range', label: 'Range Slider', icon: '🎚️' },
  { type: 'phone', label: 'Phone', icon: '📱' },
  { type: 'url', label: 'URL', icon: '🔗' },
  { type: 'color', label: 'Color Picker', icon: '🎨' },
  { type: 'section', label: 'Section Header', icon: '📌' },
];

function FormBuilderPage() {
  const [formFields, setFormFields] = useState([]);
  const [formSettings, setFormSettings] = useState({
    title: 'Untitled Form',
    description: '',
    submitText: 'Submit',
    successMessage: 'Thank you for your submission!',
  });
  const [selectedField, setSelectedField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragCounter = useRef(0);

  // Generate unique field ID
  const generateFieldId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add new field
  const addField = (type) => {
    const newField = {
      id: generateFieldId(),
      type: type,
      label: `New ${FIELD_TYPES.find(f => f.type === type).label}`,
      name: `field_${formFields.length + 1}`,
      required: false,
      placeholder: '',
      helpText: '',
      validation: {},
      options: type === 'select' || type === 'radio' || type === 'checkbox' 
        ? [{ value: 'option1', label: 'Option 1' }] 
        : [],
      fileOptions: type === 'file' ? {
        accept: '',
        maxSize: 5, // MB
        multiple: false
      } : null,
      min: type === 'range' || type === 'number' ? 0 : null,
      max: type === 'range' || type === 'number' ? 100 : null,
      step: type === 'range' ? 1 : null,
      rows: type === 'textarea' ? 4 : null,
      maxRating: type === 'rating' ? 5 : null,
    };
    setFormFields([...formFields, newField]);
    setSelectedField(newField.id);
  };

  // Update field property
  const updateField = (fieldId, property, value) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId ? { ...field, [property]: value } : field
    ));
  };

  // Delete field
  const deleteField = (fieldId) => {
    setFormFields(formFields.filter(field => field.id !== fieldId));
    if (selectedField === fieldId) setSelectedField(null);
  };

  // Duplicate field
  const duplicateField = (fieldId) => {
    const fieldToDupe = formFields.find(f => f.id === fieldId);
    if (fieldToDupe) {
      const newField = {
        ...fieldToDupe,
        id: generateFieldId(),
        name: `${fieldToDupe.name}_copy`,
        label: `${fieldToDupe.label} (Copy)`
      };
      const index = formFields.findIndex(f => f.id === fieldId);
      const newFields = [...formFields];
      newFields.splice(index + 1, 0, newField);
      setFormFields(newFields);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    dragCounter.current++;
    if (draggedItem !== null && draggedItem !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== dropIndex) {
      const draggedField = formFields[draggedItem];
      const newFields = [...formFields];
      newFields.splice(draggedItem, 1);
      newFields.splice(dropIndex, 0, draggedField);
      setFormFields(newFields);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  // Add option to select/radio/checkbox
  const addOption = (fieldId) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field) {
      const newOption = {
        value: `option${field.options.length + 1}`,
        label: `Option ${field.options.length + 1}`
      };
      updateField(fieldId, 'options', [...field.options, newOption]);
    }
  };

  // Update option
  const updateOption = (fieldId, optionIndex, property, value) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], [property]: value };
      updateField(fieldId, 'options', newOptions);
    }
  };

  // Delete option
  const deleteOption = (fieldId, optionIndex) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = field.options.filter((_, i) => i !== optionIndex);
      updateField(fieldId, 'options', newOptions);
    }
  };

  // Generate JSON payload
  const generateJson = () => {
    return {
      form: {
        id: `form_${Date.now()}`,
        ...formSettings,
        fields: formFields.map(field => {
          const baseField = {
            id: field.id,
            type: field.type,
            label: field.label,
            name: field.name,
            required: field.required,
            placeholder: field.placeholder,
            helpText: field.helpText,
            validation: field.validation
          };

          if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
            baseField.options = field.options;
          }

          if (field.type === 'file') {
            baseField.fileOptions = field.fileOptions;
          }

          if (field.type === 'range' || field.type === 'number') {
            baseField.min = field.min;
            baseField.max = field.max;
            if (field.type === 'range') baseField.step = field.step;
          }

          if (field.type === 'textarea') {
            baseField.rows = field.rows;
          }

          if (field.type === 'rating') {
            baseField.maxRating = field.maxRating;
          }

          return baseField;
        })
      }
    };
  };

  // Field Properties Panel
  const FieldProperties = ({ field }) => {
    if (!field) return null;

    return (
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">Field Properties</h3>
        
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
        )}

        {/* Number/Range specific options */}
        {(field.type === 'number' || field.type === 'range') && (
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
        )}

        {/* Textarea specific options */}
        {field.type === 'textarea' && (
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
        )}

        {/* Rating specific options */}
        {field.type === 'rating' && (
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
        )}

        {/* Options for select, radio, checkbox */}
        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
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
        )}
      </div>
    );
  };

  // Form Preview Component
  const FormPreview = () => {
    const [formData, setFormData] = useState({});

    const handleInputChange = (fieldName, value) => {
      setFormData({ ...formData, [fieldName]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form Data:', formData);
      alert('Form submitted! Check console for data.');
    };

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">{formSettings.title}</h2>
        {formSettings.description && (
          <p className="text-gray-600 mb-6">{formSettings.description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              {field.type === 'section' ? (
                <h3 className="text-xl font-semibold border-b pb-2">{field.label}</h3>
              ) : (
                <>
                  <label className="block text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  {field.type === 'email' && (
                    <input
                      type="email"
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      min={field.min}
                      max={field.max}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  {field.type === 'phone' && (
                    <input
                      type="tel"
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  {field.type === 'url' && (
                    <input
                      type="url"
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  {field.type === 'date' && (
                    <input
                      type="date"
                      name={field.name}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  {field.type === 'time' && (
                    <input
                      type="time"
                      name={field.name}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  {field.type === 'color' && (
                    <input
                      type="color"
                      name={field.name}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full h-10"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={field.rows}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      name={field.name}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select an option</option>
                      {field.options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'radio' && (
                    <div className="space-y-2">
                      {field.options.map((option, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="radio"
                            name={field.name}
                            value={option.value}
                            required={field.required}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="mr-2"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'checkbox' && (
                    <div className="space-y-2">
                      {field.options.map((option, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            name={`${field.name}[]`}
                            value={option.value}
                            onChange={(e) => {
                              const current = formData[field.name] || [];
                              if (e.target.checked) {
                                handleInputChange(field.name, [...current, e.target.value]);
                              } else {
                                handleInputChange(field.name, current.filter(v => v !== e.target.value));
                              }
                            }}
                            className="mr-2"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'file' && (
                    <input
                      type="file"
                      name={field.name}
                      required={field.required}
                      accept={field.fileOptions.accept}
                      multiple={field.fileOptions.multiple}
                      onChange={(e) => handleInputChange(field.name, e.target.files)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  {field.type === 'range' && (
                    <div>
                      <input
                        type="range"
                        name={field.name}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{field.min}</span>
                        <span>{formData[field.name] || Math.floor((field.min + field.max) / 2)}</span>
                        <span>{field.max}</span>
                      </div>
                    </div>
                  )}

                  {field.type === 'rating' && (
                    <div className="flex space-x-2">
                      {[...Array(field.maxRating)].map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleInputChange(field.name, i + 1)}
                          className={`text-2xl ${
                            (formData[field.name] || 0) > i ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  )}

                  {field.helpText && (
                    <p className="text-sm text-gray-500">{field.helpText}</p>
                  )}
                </>
              )}
            </div>
          ))}

          {formFields.length > 0 && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {formSettings.submitText}
            </button>
          )}
        </form>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Form Builder</h1>
          <input
            type="text"
            value={formSettings.title}
            onChange={(e) => setFormSettings({...formSettings, title: e.target.value})}
            className="px-3 py-1 border rounded-lg"
            placeholder="Form Title"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setShowJson(!showJson)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              showJson ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => {
              const json = generateJson();
              navigator.clipboard.writeText(JSON.stringify(json, null, 2));
              alert('JSON copied to clipboard!');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-300"
          >
            <Save className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Field Types Sidebar */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4">Field Types</h2>
          <div className="space-y-2">
            {FIELD_TYPES.map((fieldType) => (
              <button
                key={fieldType.type}
                onClick={() => addField(fieldType.type)}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <span className="text-xl">{fieldType.icon}</span>
                <span className="text-sm">{fieldType.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showJson ? (
            <div className="flex-1 p-6 overflow-auto">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
                {JSON.stringify(generateJson(), null, 2)}
              </pre>
            </div>
          ) : showPreview ? (
            <div className="flex-1 overflow-auto bg-white">
              <FormPreview />
            </div>
          ) : (
            <div className="flex-1 p-6 overflow-auto">
              {formFields.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-medium mb-2">No fields added yet</h3>
                  <p>Click on a field type from the left sidebar to add it to your form</p>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                  {formFields.map((field, index) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`bg-white border rounded-lg p-4 cursor-move transition-all ${
                        selectedField === field.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                      } ${dragOverIndex === index ? 'border-t-4 border-t-blue-500' : ''}`}
                      onClick={() => setSelectedField(field.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <GripVertical className="w-5 h-5 text-gray-400 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                                {FIELD_TYPES.find(f => f.type === field.type)?.label}
                              </span>
                              {field.required && (
                                <span className="text-xs text-red-500">Required</span>
                              )}
                            </div>
                            <div className="text-base font-medium mb-1">{field.label}</div>
                            {field.type !== 'section' && (
                              <div className="text-sm text-gray-500">Name: {field.name}</div>
                            )}
                            {field.helpText && (
                              <div className="text-sm text-gray-400 mt-1">{field.helpText}</div>
                            )}
                            
                            {/* Show field preview */}
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              {field.type === 'text' && (
                                <input type="text" placeholder={field.placeholder} className="w-full px-3 py-2 border rounded" disabled />
                              )}
                              {field.type === 'textarea' && (
                                <textarea placeholder={field.placeholder} rows={field.rows} className="w-full px-3 py-2 border rounded" disabled />
                              )}
                              {field.type === 'select' && (
                                <select className="w-full px-3 py-2 border rounded" disabled>
                                  <option>Select an option</option>
                                  {field.options.map((opt, i) => (
                                    <option key={i}>{opt.label}</option>
                                  ))}
                                </select>
                              )}
                              {field.type === 'radio' && (
                                <div className="space-y-1">
                                  {field.options.map((opt, i) => (
                                    <div key={i} className="flex items-center">
                                      <input type="radio" disabled className="mr-2" />
                                      <label>{opt.label}</label>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {field.type === 'checkbox' && (
                                <div className="space-y-1">
                                  {field.options.map((opt, i) => (
                                    <div key={i} className="flex items-center">
                                      <input type="checkbox" disabled className="mr-2" />
                                      <label>{opt.label}</label>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {field.type === 'file' && (
                                <div className="flex items-center space-x-2">
                                  <input type="file" disabled className="text-sm" />
                                  {field.fileOptions.multiple && <span className="text-xs text-gray-500">Multiple files allowed</span>}
                                  {field.fileOptions.accept && <span className="text-xs text-gray-500">Accept: {field.fileOptions.accept}</span>}
                                </div>
                              )}
                              {field.type === 'date' && <input type="date" className="px-3 py-2 border rounded" disabled />}
                              {field.type === 'time' && <input type="time" className="px-3 py-2 border rounded" disabled />}
                              {field.type === 'number' && <input type="number" placeholder={field.placeholder} className="px-3 py-2 border rounded" disabled />}
                              {field.type === 'email' && <input type="email" placeholder={field.placeholder} className="w-full px-3 py-2 border rounded" disabled />}
                              {field.type === 'phone' && <input type="tel" placeholder={field.placeholder} className="w-full px-3 py-2 border rounded" disabled />}
                              {field.type === 'url' && <input type="url" placeholder={field.placeholder} className="w-full px-3 py-2 border rounded" disabled />}
                              {field.type === 'color' && <input type="color" className="h-10 w-20" disabled />}
                              {field.type === 'range' && (
                                <div>
                                  <input type="range" min={field.min} max={field.max} className="w-full" disabled />
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>{field.min}</span>
                                    <span>{field.max}</span>
                                  </div>
                                </div>
                              )}
                              {field.type === 'rating' && (
                                <div className="flex space-x-1">
                                  {[...Array(field.maxRating)].map((_, i) => (
                                    <span key={i} className="text-2xl text-gray-300">★</span>
                                  ))}
                                </div>
                              )}
                              {field.type === 'section' && (
                                <div className="text-lg font-semibold">{field.label}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateField(field.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteField(field.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedField && !showPreview && !showJson && (
          <div className="w-80 bg-white border-l overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Field Properties</h3>
              <button
                onClick={() => setSelectedField(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FieldProperties field={formFields.find(f => f.id === selectedField)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default FormBuilderPage;