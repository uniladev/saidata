// frontend/src/pages/authenticated/FormBuilderPage.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FormBuilderHeader from '../../../components/formBuilder/FormBuilderHeader';
import FieldTypeSidebar from '../../../components/formBuilder/FieldTypeSidebar';
import FormCanvas from '../../../components/formBuilder/FormCanvas';
import FieldPropertiesPanel from '../../../components/formBuilder/FieldPropertiesPanel';
import FormPreview from '../../../components/formBuilder/FormPreview';
import JsonViewer from '../../../components/formBuilder/JsonViewer';
import { useFormBuilder } from '../../../hooks/useFormBuilder';
import { FIELD_TYPES } from '../../../constants/fieldTypes';
import { useAuth } from '../../../context/AuthContext'; // <-- ADD THIS LINE
import api from '../../../config/api'; // <-- ADD THIS LINE

function FormBuilderPage() {
  const navigate = useNavigate();
  const { token } = useAuth(); // <-- ADD THIS LINE
  const [showPreview, setShowPreview] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [dragAction, setDragAction] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverInfo, setDragOverInfo] = useState(null);

  const {
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
  } = useFormBuilder();

  const handleSaveForm = async () => {
    const formJson = generateJson();

    try {
      // This part is correct
      const response = await api.post('/forms', formJson);
      
      console.log('Server response:', response.data);
      alert('Form saved successfully!');
      navigate('/dashboard');

    } catch (error) {
      console.error("Error saving form:", error);

      // --- THIS IS THE UPDATED CATCH BLOCK ---

      if (error.response && error.response.status === 422) {
        // This handles the validation error
        const errors = error.response.data.errors;
        let errorMessage = "Validation Failed:\n\n";
        
        // Loop through all the error messages from the backend
        for (const key in errors) {
          errorMessage += `- ${errors[key][0]}\n`; // Add the first error for each field
        }
        
        alert(errorMessage);
      } else {
        // This handles other types of errors (network, server 500, etc.)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to save form.';
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const dragHandlers = {
    dragAction,
    setDragAction,
    draggedItem,
    setDraggedItem,
    dragOverInfo,
    setDragOverInfo,
  };

  const fieldHandlers = {
    addField,
    updateField,
    deleteField,
    duplicateField,
    reorderFields,
  };

  const optionHandlers = {
    addOption,
    updateOption,
    deleteOption,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <FormBuilderHeader
        formSettings={formSettings}
        setFormSettings={setFormSettings}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        showJson={showJson}
        setShowJson={setShowJson}
        onSave={handleSaveForm}
      />

      <div className="flex-1 flex overflow-hidden">
        <FieldTypeSidebar
          fieldTypes={FIELD_TYPES}
          onAddField={addField}
          setDragAction={setDragAction}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {showJson ? (
            <JsonViewer formJson={generateJson()} />
          ) : showPreview ? (
            <FormPreview formSettings={formSettings} formFields={formFields} />
          ) : (
            <FormCanvas
              formFields={formFields}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              fieldHandlers={fieldHandlers}
              dragHandlers={dragHandlers}
            />
          )}
        </div>

        {selectedField && !showPreview && !showJson && (
          <FieldPropertiesPanel
            field={formFields.find(f => f.id === selectedField)}
            onClose={() => setSelectedField(null)}
            updateField={updateField}
            optionHandlers={optionHandlers}
          />
        )}
      </div>
    </div>
  );
}

export default FormBuilderPage;