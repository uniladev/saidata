import { validate } from 'validate.js';

const validationRules = {
  presence: true,
  length: {
    minimum: 1,
    message: 'must be at least 1 character'
  }
};

export const validateField = (value) => {
  const errors = validate({ value }, { value: validationRules });
  return errors ? errors.value : null;
};

export const validateForm = (formData) => {
  const errors = {};

  for (const [key, value] of Object.entries(formData)) {
    const error = validateField(value);
    if (error) {
      errors[key] = error;
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};