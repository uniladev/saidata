// ===== Main FormTakerPage Component =====
// frontend/src/pages/authenticated/FormTakerPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormRenderer from '../../components/formTaker/FormRenderer';
import FormHeader from '../../components/formTaker/FormHeader';
import FormActions from '../../components/formTaker/FormActions';
import LoadingState from '../../components/formTaker/LoadingState';
import ErrorState from '../../components/formTaker/ErrorState';
import { useFormData } from '../../hooks/useFormData';

const FormTakerPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formData, handleInputChange, resetForm, validateForm } = useFormData();

  useEffect(() => {
    const loadForm = () => {
      try {
        const savedForms = JSON.parse(localStorage.getItem('myForms')) || [];
        const currentForm = savedForms.find(form => form.form.id === formId);
        
        if (currentForm) {
          setFormConfig(currentForm);
        } else {
          setError('Form not found');
        }
      } catch (err) {
        setError('Error loading form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isValid = validateForm(formConfig?.form?.fields || []);
    if (!isValid) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Form Submission:', formData);
    alert('Form submitted successfully! Check the console for data.');
    
    // In production, send to API
    // await api.submitForm(formId, formData);
  };

  const exportFormData = () => {
    if (Object.keys(formData).length === 0) {
      alert("Please fill out the form with some sample data before exporting.");
      return;
    }

    const structuredData = formConfig.form.fields.map(field => ({
      id: field.id,
      name: field.name,
      label: field.label,
      type: field.type,
      value: formData[field.name] || null
    }));

    const jsonString = JSON.stringify(structuredData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `form_${formId}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={() => navigate('/dashboard')} />;
  if (!formConfig || !formConfig.form) return <ErrorState error="Invalid form configuration" />;

  const { title, description, fields, submitText } = formConfig.form;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <FormHeader 
            title={title} 
            description={description}
            formId={formId}
          />
          
          <form onSubmit={handleSubmit} className="p-8">
            <FormRenderer
              fields={fields}
              formData={formData}
              onChange={handleInputChange}
            />
            
            <FormActions
              submitText={submitText}
              onExport={exportFormData}
              onReset={() => resetForm()}
              hasData={Object.keys(formData).length > 0}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormTakerPage;