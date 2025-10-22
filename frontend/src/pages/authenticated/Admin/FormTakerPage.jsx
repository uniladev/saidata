// ===== Main FormTakerPage Component =====
// frontend/src/pages/authenticated/FormTakerPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormRenderer from '../../../components/formTaker/FormRenderer';
import FormHeader from '../../../components/formTaker/FormHeader';
import FormActions from '../../../components/formTaker/FormActions';
import LoadingState from '../../../components/formTaker/LoadingState';
import ErrorState from '../../../components/formTaker/ErrorState';
import { useFormData } from '../../../hooks/useFormData';
import api from '../../../config/api'; // <-- ADD THIS LINE

const FormTakerPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formData, handleInputChange, resetForm, validateForm } = useFormData();

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) { // Only check for formId now
        setError('No form ID provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Use the 'api' client. It automatically adds the token!
        // Use the 'GET /api/v1/forms/{id}' endpoint.
        const response = await api.get(`/forms/slug/${formId}`);
        console.log("RAW BACKEND RESPONSE:", response.data);
        setFormConfig(response.data.data); 
      } catch (err) {
        console.error("Error loading form:", err);
        setError('Form not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]); // Depend only on formId now

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formConfig) {
      alert('Form not loaded yet.');
      return;
    }

    // Assuming your useFormData hook has a validate function
    if (!validateForm(formConfig?.form?.fields || [])) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const submissionData = {
      form_version_id: formConfig.id, // Assuming the top-level form config has the ID
      payload: formData // The user's answers from your useFormData hook
    };

    try {
      // Use the 'api' client. It automatically adds the token.
      // Use the 'POST /api/v1/survey' endpoint.
      await api.post('/survey', submissionData);

      alert(formConfig.successMessage || 'Thank you for your submission!');
      navigate('/dashboard'); // Redirect after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Submission failed.';
      alert(`Error: ${errorMessage}`);
    }
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
  if (!formConfig || !formConfig.fields) return <ErrorState error="Invalid form configuration" />;

  const { title, description, fields, submitText } = formConfig;

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