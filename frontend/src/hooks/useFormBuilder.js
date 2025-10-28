// frontend/src/hooks/useFormBuilder.js
// CORRECTED VERSION - Properly handles options as objects {value, label}
import { useState } from 'react';

export const useFormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [formSettings, setFormSettings] = useState({
    title: 'Untitled Form',
    description: '',
    submitText: 'Submit',
    successMessage: 'Thank you for your submission!',
  });

  const addField = (fieldType) => {
    const newField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: fieldType.type,
      label: fieldType.label,
      name: `field_${Date.now()}`,
      required: false,
      placeholder: fieldType.placeholder || '',
      helpText: '',
      validation: fieldType.validation || null,
      options: fieldType.options || [],
      fileOptions: fieldType.fileOptions || null,
      min: fieldType.min || null,
      max: fieldType.max || null,
      step: fieldType.step || null,
      rows: fieldType.rows || null,
      maxRating: fieldType.maxRating || null,
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
    // Create a plain object with only serializable data
    const cleanField = {
      type: String(field.type || 'text'), // Ensure type is always a string, default to 'text' if missing
      label: String(field.label || ''),   // Ensure label is always a string
      name: String(field.name || ''),     // Ensure name is always a string
      required: Boolean(field.required || false),
      placeholder: String(field.placeholder || ''),
      helpText: String(field.helpText || ''),
      validation: field.validation || null,
      options: [], // Will be set below
      fileOptions: field.fileOptions || null,
      min: field.min !== undefined && field.min !== null ? Number(field.min) : null, // Ensure numeric
      max: field.max !== undefined && field.max !== null ? Number(field.max) : null, // Ensure numeric
      step: field.step !== undefined && field.step !== null ? Number(field.step) : null, // Ensure numeric
      rows: field.rows !== undefined && field.rows !== null ? Number(field.rows) : null, // Ensure numeric
      maxRating: field.maxRating !== undefined && field.maxRating !== null ? Number(field.maxRating) : null, // Ensure numeric
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
        // Ensure fileOptions is null if not a valid object or missing
        cleanField.fileOptions = null; 
    }

    // Ensure validation is null if empty
    if (cleanField.validation && typeof cleanField.validation === 'object' && Object.keys(cleanField.validation).length === 0) {
        cleanField.validation = null;
    }

    return cleanField;
  };

  const generateJson = () => {
    // Create clean form data
    const formData = {
      title: String(formSettings.title || 'Untitled Form'),
      description: String(formSettings.description || ''),
      submitText: String(formSettings.submitText || 'Submit'),
      successMessage: String(formSettings.successMessage || 'Thank you for your submission!'),
      is_active: true,
      fields: formFields.map(field => cleanFieldForBackend(field))
    };

    // Wrap in "form" key as backend expects
    return {
      form: formData
    };
  };

  return {
    formFields,
    formSettings,
    setFormSettings,
    setFormFields,  // Export this to allow loading existing forms
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