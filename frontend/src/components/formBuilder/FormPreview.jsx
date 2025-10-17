// ===== 8. FormPreview Component =====
// frontend/src/components/formBuilder/FormPreview.jsx
import React, { useState } from 'react';
import {
  TextInput,
  TextAreaInput,
  SelectInput,
  RadioInput,
  CheckboxInput,
  EmailInput,
  NumberInput,
  DateInput,
  FileInput,
  SectionHeader,
  PhoneInput,
  UrlInput,
  TimeInput,
} from '../ui/formFields';

const fieldComponentMap = {
  text: TextInput,
  textarea: TextAreaInput,
  select: SelectInput,
  radio: RadioInput,
  checkbox: CheckboxInput,
  email: EmailInput,
  number: NumberInput,
  date: DateInput,
  file: FileInput,
  section: SectionHeader,
  phone: PhoneInput,
  url: UrlInput,
  time: TimeInput,
};

const FormPreview = ({ formSettings, formFields }) => {
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
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">{formSettings.title}</h2>
        {formSettings.description && (
          <p className="text-gray-600 mb-6">{formSettings.description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.map((field) => {
            const FieldComponent = fieldComponentMap[field.type];

            if (FieldComponent) {
              return (
                <div key={field.id}>
                  <FieldComponent
                    field={field}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                  />
                </div>
              );
            }

            // Fallback for types not in the map (range, rating, color)
            return (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === 'color' && (
                  <input
                    type="color"
                    name={field.name}
                    required={field.required}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full h-10"
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
              </div>
            );
          })}

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
    </div>
  );
};

export default FormPreview;