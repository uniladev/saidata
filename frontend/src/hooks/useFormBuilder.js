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