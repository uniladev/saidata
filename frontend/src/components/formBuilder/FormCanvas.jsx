// frontend/src/components/formBuilder/FormCanvas.jsx
import React from 'react';
import FieldCard from './FieldCard';

const FormCanvas = ({
  formFields,
  selectedField,
  setSelectedField,
  fieldHandlers,
  dragHandlers,
}) => {
  const { addField, duplicateField, deleteField, reorderFields } = fieldHandlers;
  const {
    dragAction,
    setDragAction,
    draggedItem,
    setDraggedItem,
    dragOverInfo,
    setDragOverInfo,
  } = dragHandlers;

  // Handle drag start for reordering existing fields
  const handleDragStart = (e, field) => {
    console.log('🎯 Field drag start:', field.label);
    setDraggedItem(field);
    e.dataTransfer.effectAllowed = 'move';
    setDragAction('reorder');
  };

  // Handle drag over field cards
  const handleDragOver = (e, field) => {
    e.preventDefault();
    if (draggedItem?.id === field.id) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const position = e.clientY < midpoint ? 'top' : 'bottom';
    setDragOverInfo({ field, position });
  };

  // Handle drag over drop zones (empty spaces between fields)
  const handleDropZoneDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('📍 Drop zone hover:', index, 'dragAction:', dragAction);
    setDragOverInfo({ index, position: 'zone' });
  };

  const handleDragLeave = (e) => {
    // Only clear if we're actually leaving the component, not just moving to a child
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragOverInfo(null);
  };

  // Handle drop on field cards
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('💧 Drop on field card, dragAction:', dragAction, 'dragOverInfo:', dragOverInfo);
    
    const dropTargetField = dragOverInfo?.field;

    if (dragAction === 'add') {
      const type = e.dataTransfer.getData('newFieldType');
      console.log('➕ Adding field type:', type, 'at field:', dropTargetField?.label);
      if (type && dropTargetField) {
        const dropIndex = formFields.findIndex(f => f.id === dropTargetField.id);
        const insertAtIndex = dragOverInfo?.position === 'bottom' 
          ? dropIndex + 1 
          : dropIndex;
        console.log('  Inserting at index:', insertAtIndex);
        addField(type, insertAtIndex);
      } else if (type) {
        // Fallback: add to end if no drop target
        console.log('  No drop target, adding to end');
        addField(type);
      }
    } else if (dragAction === 'reorder' && draggedItem && dropTargetField) {
      console.log('🔄 Reordering:', draggedItem.label, 'relative to', dropTargetField.label);
      reorderFields(draggedItem.id, dropTargetField.id, dragOverInfo.position);
    }

    setDraggedItem(null);
    setDragOverInfo(null);
    setDragAction(null);
  };

  // Handle drop on drop zones (empty spaces)
  const handleDropZoneDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('💧 Drop on zone:', targetIndex, 'dragAction:', dragAction);

    // Check for both add and reorder actions
    const type = e.dataTransfer.getData('newFieldType');
    
    if (type) {
      // Adding new field from sidebar
      console.log('➕ Adding new field type:', type, 'at index:', targetIndex);
      addField(type, targetIndex);
    } else if (dragAction === 'reorder' && draggedItem) {
      // Reordering existing field to this drop zone
      console.log('🔄 Reordering field:', draggedItem.label, 'to zone index:', targetIndex);
      
      const draggedIndex = formFields.findIndex(f => f.id === draggedItem.id);
      
      if (draggedIndex !== -1) {
        // Calculate which field to drop relative to
        // targetIndex is where we want to insert
        
        if (targetIndex === 0) {
          // Drop at the beginning - use first field as reference
          if (formFields[0]) {
            console.log('  Dropping before first field');
            reorderFields(draggedItem.id, formFields[0].id, 'top');
          }
        } else if (targetIndex >= formFields.length) {
          // Drop at the end - use last field as reference
          const lastField = formFields[formFields.length - 1];
          if (lastField && lastField.id !== draggedItem.id) {
            console.log('  Dropping after last field');
            reorderFields(draggedItem.id, lastField.id, 'bottom');
          }
        } else {
          // Drop in the middle - use the field at targetIndex as reference
          const referenceField = formFields[targetIndex];
          if (referenceField && referenceField.id !== draggedItem.id) {
            console.log('  Dropping before field at index', targetIndex);
            reorderFields(draggedItem.id, referenceField.id, 'top');
          }
        }
      }
    }

    setDraggedItem(null);
    setDragOverInfo(null);
    setDragAction(null);
  };

  // Handle drop on empty canvas or empty space outside fields
  const handleEmptyDrop = (e) => {
    e.preventDefault();
    console.log('💧 Drop on canvas (outside fields)');
    const type = e.dataTransfer.getData('newFieldType');
    if (type) {
      // Add to the end when dropping on empty space
      const insertIndex = formFields.length;
      console.log('➕ Adding field to end:', type, 'at index:', insertIndex);
      addField(type, insertIndex);
    }
    setDraggedItem(null);
    setDragOverInfo(null);
    setDragAction(null);
  };

  return (
    <div
      className="flex-1 p-6 overflow-auto"
      onDragOver={(e) => {
        e.preventDefault();
        // Visual feedback when dragging over canvas
        if (formFields.length === 0) {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) {
          e.currentTarget.style.backgroundColor = '';
        }
      }}
      onDrop={handleEmptyDrop}
    >
      {formFields.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 pointer-events-none">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium mb-2">Drag and drop a field here</h3>
          <p>Or click one from the sidebar to get started</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {/* Drop zone at the top */}
          <div
            onDragOver={(e) => handleDropZoneDragOver(e, 0)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDropZoneDrop(e, 0)}
            className={`transition-all duration-200 ${
              dragOverInfo?.position === 'zone' && dragOverInfo?.index === 0
                ? 'h-16 bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg mb-4 flex items-center justify-center'
                : 'h-2 bg-transparent'
            }`}
          >
            {dragOverInfo?.position === 'zone' && dragOverInfo?.index === 0 && (
              <span className="text-sm text-blue-600 font-medium">Drop here to insert at the beginning</span>
            )}
          </div>

          {formFields.map((field, index) => (
            <React.Fragment key={field.id}>
              <FieldCard
                field={field}
                index={index}
                isSelected={selectedField === field.id}
                dragOverInfo={dragOverInfo}
                onSelect={() => setSelectedField(field.id)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDuplicate={() => duplicateField(field.id)}
                onDelete={() => deleteField(field.id)}
              />
              
              {/* Drop zone between fields and after last field */}
              <div
                onDragOver={(e) => handleDropZoneDragOver(e, index + 1)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropZoneDrop(e, index + 1)}
                className={`transition-all duration-200 ${
                  dragOverInfo?.position === 'zone' && dragOverInfo?.index === index + 1
                    ? 'h-16 bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg my-4 flex items-center justify-center'
                    : 'h-4 bg-transparent'
                }`}
              >
                {dragOverInfo?.position === 'zone' && dragOverInfo?.index === index + 1 && (
                  <span className="text-sm text-blue-600 font-medium">
                    Drop here to insert at position {index + 2}
                  </span>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormCanvas;