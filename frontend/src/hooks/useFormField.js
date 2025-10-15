import { useState, useCallback } from 'react';
import { FormField } from '../types/form';

export const useFormField = (field) => {
  const [value, setValue] = useState(field.value || '');
  const [error, setError] = useState();

  const onChange = useCallback((newValue) => {
    setValue(newValue);
    // Clear error when user starts typing
    if (error) {
      setError(undefined);
    }
  }, [error]);

  const onBlur = useCallback(() => {
    // Validation logic can be added here
    if (field.required && (!value || value === '')) {
      setError(`${field.label} is required`);
    }
  }, [field.required, field.label, value]);

  return {
    value,
    onChange,
    onBlur,
    error,
  };
};

export default useFormField;