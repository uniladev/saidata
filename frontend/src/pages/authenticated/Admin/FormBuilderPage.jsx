// frontend/src/pages/authenticated/Admin/FormBuilderPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormBuilderHeader from '../../../components/formBuilder/FormBuilderHeader';
import FieldTypeSidebar from '../../../components/formBuilder/FieldTypeSidebar';
import FormCanvas from '../../../components/formBuilder/FormCanvas';
import FieldPropertiesPanel from '../../../components/formBuilder/FieldPropertiesPanel';
import FormPreview from '../../../components/formBuilder/FormPreview';
import JsonViewer from '../../../components/formBuilder/JsonViewer';
import FormVersionHistory from '../../../components/formBuilder/FormVersionHistory';
import { useFormBuilder } from '../../../hooks/useFormBuilder';
import { FIELD_TYPES } from '../../../constants/fieldTypes';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../config/api';

function FormBuilderPage() {
  const navigate = useNavigate();
  const { formId } = useParams(); // For edit mode
  const { token } = useAuth();
  
  const [showPreview, setShowPreview] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [dragAction, setDragAction] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverInfo, setDragOverInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFormData, setCurrentFormData] = useState(null);
  
  // Version management states
  const [incrementVersion, setIncrementVersion] = useState(false);
  const [changeSummary, setChangeSummary] = useState('');
  const [showVersionDialog, setShowVersionDialog] = useState(false);

  const {
    formFields,
    formSettings,
    setFormSettings,
    setFormFields,
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

  // Load form data in edit mode
  useEffect(() => {
    if (formId) {
      loadFormData();
    }
  }, [formId]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/forms/${formId}`);
      const formData = response.data.data;
      
      setCurrentFormData(formData);
      setIsEditMode(true);
      
      // Populate form settings
      setFormSettings({
        title: formData.title || 'Untitled Form',
        description: formData.description || '',
        submitText: formData.submitText || 'Submit',
        successMessage: formData.successMessage || 'Thank you for your submission!',
      });
      
      // Populate form fields
      if (formData.fields && formData.fields.length > 0) {
        setFormFields(formData.fields);
      }
      
    } catch (error) {
      console.error('Error loading form:', error);
      alert('Failed to load form data');
      navigate('/forms');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async (forceVersionIncrement = false) => {
    // Ensure forceVersionIncrement is always a boolean (in case an event is passed)
    const shouldIncrementVersion = forceVersionIncrement === true;
    
    // Get the generated JSON
    const formJson = generateJson();
    
    // DEBUG: Log the form structure
    console.log('=== FORM BUILDER DEBUG ===');
    console.log('Form Fields:', formFields);
    console.log('Form Settings:', formSettings);
    console.log('Generated JSON:', formJson);
    console.log('forceVersionIncrement:', forceVersionIncrement, 'shouldIncrementVersion:', shouldIncrementVersion);
    
    // Try to convert to JSON string to catch circular references early
    try {
      const jsonString = JSON.stringify(formJson, null, 2);
      console.log('JSON String (first 500 chars):', jsonString.substring(0, 500));
      console.log('✓ JSON is valid - No circular references');
    } catch (jsonError) {
      console.error('❌ JSON stringify error:', jsonError);
      alert('Error: Cannot serialize form data to JSON. This usually means there are circular references. Check the console for details.');
      return;
    }

    // If editing and structure changed, show version dialog
    if (isEditMode && !showVersionDialog && hasStructureChanged()) {
      setShowVersionDialog(true);
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        // Update existing form
        const payload = {
          form: formJson.form,
          increment_version: shouldIncrementVersion || incrementVersion,
          change_summary: changeSummary || 'Form updated'
        };

        console.log('Sending UPDATE request with payload:', payload);
        const response = await api.put(`/forms/${formId}`, payload);
        console.log('✓ Form updated successfully:', response.data);
        alert('Form updated successfully!');
        
        // Reset version dialog states
        setShowVersionDialog(false);
        setIncrementVersion(false);
        setChangeSummary('');
        
        // Reload form data to get the latest version
        await loadFormData();
        
      } else {
        // Create new form
        console.log('Sending CREATE request with payload:', formJson);
        const response = await api.post('/forms', formJson);
        console.log('✓ Form created successfully:', response.data);
        alert('Form created successfully!');
        navigate('/forms');
      }

    } catch (error) {
      console.error('❌ Error saving form:', error);

      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        let errorMessage = 'Validation Failed:\n\n';
        
        for (const key in errors) {
          errorMessage += `- ${errors[key][0]}\n`;
        }
        
        console.error('Validation errors:', errors);
        alert(errorMessage);
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to save form.';
        console.error('Save error details:', error.response?.data);
        alert(`Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const hasStructureChanged = () => {
    if (!currentFormData || !currentFormData.fields) return false;
    
    const currentFields = formFields;
    const originalFields = currentFormData.fields;
    
    // Check if number of fields changed
    if (currentFields.length !== originalFields.length) {
      return true;
    }
    
    // Check if field types or names changed
    for (let i = 0; i < currentFields.length; i++) {
      if (!originalFields[i]) return true;
      
      if (currentFields[i].type !== originalFields[i].type ||
          currentFields[i].name !== originalFields[i].name) {
        return true;
      }
    }
    
    return false;
  };

  const handleRestoreVersion = async (versionData) => {
    try {
      // Populate the form builder with the version data
      setFormSettings({
        title: versionData.title || 'Untitled Form',
        description: versionData.description || '',
        submitText: versionData.submitText || 'Submit',
        successMessage: versionData.successMessage || 'Thank you for your submission!',
      });
      
      if (versionData.fields) {
        setFormFields(versionData.fields);
      }
      
      setShowVersionHistory(false);
      setIncrementVersion(true);
      setChangeSummary(`Restored from version ${versionData.version}`);
      
      alert(`Version ${versionData.version} has been loaded. Click Save to apply these changes.`);
      
    } catch (error) {
      console.error('Error restoring version:', error);
      alert('Failed to restore version');
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

  if (loading && !currentFormData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

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
        isEditMode={isEditMode}
        currentVersion={currentFormData?.version}
        onShowVersionHistory={() => setShowVersionHistory(true)}
        loading={loading}
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

      {/* Version Dialog */}
      {showVersionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Structure Changes Detected
              </h3>
              <p className="text-gray-600 mb-4">
                You've made changes to the form structure. Would you like to create a new version?
              </p>
              
              <div className="mb-4">
                <label className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    checked={incrementVersion}
                    onChange={(e) => setIncrementVersion(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Increment version number
                  </span>
                </label>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Summary
                </label>
                <textarea
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="Describe what you changed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowVersionDialog(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSaveForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && isEditMode && (
        <FormVersionHistory
          formId={formId}
          onClose={() => setShowVersionHistory(false)}
          onRestoreVersion={handleRestoreVersion}
        />
      )}
    </div>
  );
}

export default FormBuilderPage;