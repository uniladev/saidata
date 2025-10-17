// frontend/src/pages/authenticated/FormBuilderPage.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FormBuilderHeader from '../../components/formBuilder/FormBuilderHeader';
import FieldTypeSidebar from '../../components/formBuilder/FieldTypeSidebar';
import FormCanvas from '../../components/formBuilder/FormCanvas';
import FieldPropertiesPanel from '../../components/formBuilder/FieldPropertiesPanel';
import FormPreview from '../../components/formBuilder/FormPreview';
import JsonViewer from '../../components/formBuilder/JsonViewer';
import { useFormBuilder } from '../../hooks/useFormBuilder';
import { FIELD_TYPES } from '../../constants/fieldTypes';

function FormBuilderPage() {
  const navigate = useNavigate();
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

  const handleSaveForm = () => {
    const formJson = generateJson();
    const savedForms = JSON.parse(localStorage.getItem('myForms')) || [];
    savedForms.push(formJson);
    localStorage.setItem('myForms', JSON.stringify(savedForms));
    alert('Form saved successfully!');
    navigate('/dashboard');
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