import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
} from '../../components/ui/formFields';

// This map connects a field 'type' string to its React component
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

// This component receives the form's JSON configuration as a prop
const FormTakerPage = () => {
  const { formId } = useParams(); // Gets the 'formId' from the URL
  const [formConfig, setFormConfig] = useState(null);
  const [formData, setFormData] = useState({}); // <-- ADD THIS LINE

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('myForms')) || [];
    const currentForm = savedForms.find(form => form.form.id === formId);
    if (currentForm) {
      setFormConfig(currentForm);
    }
  }, [formId]);

  // Show a loading message if the form configuration hasn't been passed yet
  if (!formConfig || !formConfig.form) {
    return <div className="p-8">Loading form...</div>;
  }

  const { title, description, fields, submitText } = formConfig.form;

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final Form Submission:', formData);
    alert('Form submitted successfully! Check the console for the data.');
    // In a real app, you would send `formData` to your backend API here
  };

  // ... after your handleSubmit function

  const exportJsonForDocs = () => {
    if (Object.keys(formData).length === 0) {
      alert("Please fill out the form with some sample data before exporting.");
      return;
    }

    // Create the structured data by mapping over the form's fields
    const structuredData = fields.map(field => {
      return {
        id: field.id, // <-- ADD THIS LINE
        name: field.name,
        label: field.label,
        type: field.type,
        // Look up the user's answer from the formData state
        value: formData[field.name] || null 
      };
    });

    // The rest of the download logic remains the same
    const jsonString = JSON.stringify(structuredData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "structured_formData_example.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg my-12">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-8">{description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => {
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
          
          // You can add fallbacks here for types like 'rating' if you want to support them
          return null; 
        })}

        {fields.length > 0 && (
          <>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {submitText || 'Submit'}
            </button>
            
            {/* ADD THIS NEW BUTTON */}
            <button 
              type="button" // Important: type="button" prevents it from submitting the form
              onClick={exportJsonForDocs}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
            >
              Export JSON for Backend Docs
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default FormTakerPage;