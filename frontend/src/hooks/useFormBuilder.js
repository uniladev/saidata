// frontend/src/hooks/useFormBuilder.js
import { useState } from 'react';

export const useFormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [formSettings, setFormSettings] = useState({
    title: 'Untitled Form',
    description: '',
    submitText: 'Submit',
    successMessage: 'Thank you for your submission!',
  });

  // Helper to get default values for each field type
  const getFieldDefaults = (type) => {
    const defaults = {
      text: { placeholder: 'Enter text...' },
      textarea: { placeholder: 'Enter your text...', rows: 4 },
      number: { placeholder: 'Enter a number...', min: null, max: null, step: 1 },
      email: { placeholder: 'example@email.com' },
      phone: { placeholder: '+1234567890' },
      url: { placeholder: 'https://example.com' },
      select: { 
        placeholder: 'Select an option...',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      },
      radio: { 
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      },
      checkbox: { 
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      },
      date: {},
      time: {},
      file: { 
        fileOptions: {
          accept: '',
          maxSize: 5,
          multiple: false
        }
      },
      rating: { maxRating: 5 },
      range: { min: 0, max: 100, step: 1 },
      color: {},
      section: {}
    };

    return defaults[type] || {};
  };

  // Get field label from FIELD_TYPES or create default
  const getFieldLabel = (type) => {
    const labels = {
      text: 'Text Input',
      textarea: 'Text Area',
      number: 'Number',
      email: 'Email',
      phone: 'Phone',
      url: 'URL',
      select: 'Dropdown',
      radio: 'Radio Button',
      checkbox: 'Checkbox',
      date: 'Date',
      time: 'Time',
      file: 'File Upload',
      rating: 'Rating',
      range: 'Range Slider',
      color: 'Color Picker',
      section: 'Section Header'
    };

    return labels[type] || 'Field';
  };

  const addField = (fieldType) => {
    // fieldType is now just a string (e.g., 'text', 'email', etc.)
    const defaults = getFieldDefaults(fieldType);
    
    const newField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: fieldType,
      label: `New ${getFieldLabel(fieldType)}`,
      name: `field_${Date.now()}`,
      required: false,
      placeholder: defaults.placeholder || '',
      helpText: '',
      validation: null,
      options: defaults.options || [],
      fileOptions: defaults.fileOptions || null,
      min: defaults.min !== undefined ? defaults.min : null,
      max: defaults.max !== undefined ? defaults.max : null,
      step: defaults.step !== undefined ? defaults.step : null,
      rows: defaults.rows !== undefined ? defaults.rows : null,
      maxRating: defaults.maxRating !== undefined ? defaults.maxRating : null,
    };
    
    setFormFields([...formFields, newField]);
    return newField.id;
  };

  const updateField = (fieldId, property, value) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId ? { ...field, [property]: value } : field
    ));
  };

  const deleteField = (fieldId) => {
    setFormFields(formFields.filter(field => field.id !== fieldId));
  };

  const duplicateField = (fieldId) => {
    const fieldIndex = formFields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return;

    const originalField = formFields[fieldIndex];
    const newField = {
      ...originalField,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${originalField.name}_copy_${Date.now()}`,
      label: `${originalField.label} (Copy)`,
    };

    const newFields = [...formFields];
    newFields.splice(fieldIndex + 1, 0, newField);
    setFormFields(newFields);
  };

  const reorderFields = (draggedFieldId, dropFieldId, position) => {
    const dragIndex = formFields.findIndex(f => f.id === draggedFieldId);
    const dropIndex = formFields.findIndex(f => f.id === dropFieldId);

    if (dragIndex === -1 || dropIndex === -1) return;

    const newFields = [...formFields];
    const draggedField = newFields[dragIndex];
    newFields.splice(dragIndex, 1);

    let insertAtIndex;
    if (dragIndex < dropIndex) {
      insertAtIndex = position === 'top' ? dropIndex - 1 : dropIndex;
    } else {
      insertAtIndex = position === 'top' ? dropIndex : dropIndex + 1;
    }

    newFields.splice(insertAtIndex, 0, draggedField);
    setFormFields(newFields);
  };

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

  const updateOption = (fieldId, optionIndex, property, value) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], [property]: value };
      updateField(fieldId, 'options', newOptions);
    }
  };

  const deleteOption = (fieldId, optionIndex) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = field.options.filter((_, i) => i !== optionIndex);
      updateField(fieldId, 'options', newOptions);
    }
  };

  // Helper function to clean field data for backend
  const cleanFieldForBackend = (field) => {
    const cleanField = {
      type: String(field.type || 'text'),
      label: String(field.label || ''),
      name: String(field.name || ''),
      required: Boolean(field.required || false),
      placeholder: String(field.placeholder || ''),
      helpText: String(field.helpText || ''),
      validation: field.validation || null,
      options: [],
      fileOptions: field.fileOptions || null,
      min: field.min !== undefined && field.min !== null ? Number(field.min) : null,
      max: field.max !== undefined && field.max !== null ? Number(field.max) : null,
      step: field.step !== undefined && field.step !== null ? Number(field.step) : null,
      rows: field.rows !== undefined && field.rows !== null ? Number(field.rows) : null,
      maxRating: field.maxRating !== undefined && field.maxRating !== null ? Number(field.maxRating) : null,
    };

    // Handle options carefully
    if (Array.isArray(field.options)) {
      cleanField.options = field.options.map(option => {
        if (option && typeof option === 'object') {
          return {
            value: String(option.value || ''),
            label: String(option.label || '')
          };
        }
        return { value: String(option), label: String(option) };
      });
    }

    // Handle fileOptions carefully
    if (cleanField.fileOptions && typeof cleanField.fileOptions === 'object') {
      cleanField.fileOptions = {
        accept: String(cleanField.fileOptions.accept || ''),
        maxSize: Number(cleanField.fileOptions.maxSize || 5),
        multiple: Boolean(cleanField.fileOptions.multiple)
      };
    } else {
      cleanField.fileOptions = null;
    }

    // Ensure validation is null if empty
    if (cleanField.validation && typeof cleanField.validation === 'object' && Object.keys(cleanField.validation).length === 0) {
      cleanField.validation = null;
    }

    return cleanField;
  };

  const generateJson = () => {
    const formData = {
      title: String(formSettings.title || 'Untitled Form'),
      description: String(formSettings.description || ''),
      submitText: String(formSettings.submitText || 'Submit'),
      successMessage: String(formSettings.successMessage || 'Thank you for your submission!'),
      is_active: true,
      fields: formFields.map(field => cleanFieldForBackend(field))
    };

    return {
      form: formData
    };
  };

  return {
    formFields,
    formSettings,
    setFormSettings,
    setFormFields,
    addField,
    updateField,
    deleteField,
    duplicateField,
    reorderFields,
    addOption,
    updateOption,
    deleteOption,
    generateJson,
  };
};