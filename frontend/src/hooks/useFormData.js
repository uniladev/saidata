// ===== Custom Hook: useFormData =====
// frontend/src/hooks/useFormData.js
import { useState } from 'react';

export const useFormData = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    
    // Clear error when field is modified
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (fields) => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      // Add custom validation rules here
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Invalid email address';
        }
      }
      
      if (field.type === 'url' && formData[field.name]) {
        try {
          new URL(formData[field.name]);
        } catch {
          newErrors[field.name] = 'Invalid URL';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({});
    setErrors({});
  };

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
  };
};
