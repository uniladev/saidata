// ===== 9. Custom Hook: useFormBuilder =====
// frontend/src/hooks/useFormBuilder.js
import { useState } from 'react';
import { FIELD_TYPES } from '../constants/fieldTypes';

export const useFormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [formSettings, setFormSettings] = useState({
    title: 'Untitled Form',
    description: '',
    submitText: 'Submit',
    successMessage: 'Thank you for your submission!',
  });

  const generateFieldId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addField = (type, index = null) => {
    const fieldType = FIELD_TYPES.find(f => f.type === type);
    const newField = {
      id: generateFieldId(),
      type: type,
      label: `New ${fieldType.label}`,
      name: `field_${formFields.length + 1}`,
      required: false,
      placeholder: '',
      helpText: '',
      validation: {},
      options: ['select', 'radio', 'checkbox'].includes(type)
        ? [{ value: 'option1', label: 'Option 1' }]
        : [],
      fileOptions: type === 'file' ? {
        accept: '',
        maxSize: 5,
        multiple: false
      } : null,
      min: ['range', 'number'].includes(type) ? 0 : null,
      max: ['range', 'number'].includes(type) ? 100 : null,
      step: type === 'range' ? 1 : null,
      rows: type === 'textarea' ? 4 : null,
      maxRating: type === 'rating' ? 5 : null,
    };

    const newFields = [...formFields];
    if (index === null || index >= formFields.length) {
      newFields.push(newField);
    } else {
      newFields.splice(index, 0, newField);
    }
    
    setFormFields(newFields);
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

  const reorderFields = (draggedIndex, dropIndex, position) => {
    const draggedField = formFields[draggedIndex];
    const newFields = [...formFields];
    
    newFields.splice(draggedIndex, 1);
    
    let insertAtIndex = dropIndex;
    if (draggedIndex < dropIndex) {
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

  const generateJson = () => {
    // This is the flat object we had before
    const formData = {
      ...formSettings, 
      fields: formFields.map(field => {
        const { id, ...fieldForBackend } = field;
        return fieldForBackend;
      })
    };

    // Now, we return that object wrapped inside a "form" key,
    // just like the backend documentation specifies.
    return {
      form: formData
    };
  };

  return {
    formFields,
    formSettings,
    setFormSettings,
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