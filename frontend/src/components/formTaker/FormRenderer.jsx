// ===== FormRenderer Component =====
// frontend/src/components/formTaker/FormRenderer.jsx
import React from 'react';
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
import RangeInput from '../ui/formFields/RangeInput';
import ColorInput from '../ui/formFields/ColorInput';
import RatingInput from '../ui/formFields/RatingInput';

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
  range: RangeInput,
  color: ColorInput,
  rating: RatingInput,
};

const FormRenderer = ({ fields, formData, onChange }) => {
  const renderField = (field) => {
    const FieldComponent = fieldComponentMap[field.type];
    
    if (FieldComponent) {
      return (
        <FieldComponent
          field={field}
          value={formData[field.name]}
          onChange={onChange}
        />
      );
    }
    
    // Fallback for unknown field types
    return (
      <div className="text-gray-500 p-4 bg-gray-50 rounded">
        Unsupported field type: {field.type}
      </div>
    );
  };

  // Group fields by sections
  const groupedFields = [];
  let currentSection = { title: null, fields: [] };
  
  fields.forEach(field => {
    if (field.type === 'section') {
      if (currentSection.fields.length > 0) {
        groupedFields.push(currentSection);
      }
      currentSection = { title: field.label, fields: [] };
    } else {
      currentSection.fields.push(field);
    }
  });
  
  if (currentSection.fields.length > 0) {
    groupedFields.push(currentSection);
  }

  return (
    <div className="space-y-8">
      {groupedFields.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-6">
          {section.title && (
            <div className="border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields.map((field) => (
              <div 
                key={field.id} 
                className={
                  field.type === 'textarea' || field.type === 'file' 
                    ? 'md:col-span-2' 
                    : ''
                }
              >
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormRenderer;
