// ===== 3. FormCanvas Component =====
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

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    setDragAction('reorder');
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === index) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const position = e.clientY < midpoint ? 'top' : 'bottom';
    setDragOverInfo({ index, position });
  };

  const handleDragLeave = () => {
    setDragOverInfo(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropTargetIndex = dragOverInfo?.index;

    if (dragAction === 'add') {
      const type = e.dataTransfer.getData('newFieldType');
      if (type) {
        const insertAtIndex = dragOverInfo?.position === 'bottom' 
          ? dropTargetIndex + 1 
          : dropTargetIndex;
        addField(type, insertAtIndex);
      }
    } else if (dragAction === 'reorder' && draggedItem !== null && dropTargetIndex !== null) {
      reorderFields(draggedItem, dropTargetIndex, dragOverInfo.position);
    }

    setDraggedItem(null);
    setDragOverInfo(null);
    setDragAction(null);
  };

  const handleEmptyDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('newFieldType');
    if (type && formFields.length === 0) {
      addField(type, 0);
    }
    e.currentTarget.style.backgroundColor = '';
  };

  return (
    <div
      className="flex-1 p-6 overflow-auto"
      onDragOver={(e) => {
        e.preventDefault();
        if (formFields.length === 0) {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }
      }}
      onDragLeave={(e) => {
        e.currentTarget.style.backgroundColor = '';
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
        <div className="max-w-3xl mx-auto space-y-4">
          {formFields.map((field, index) => (
            <FieldCard
              key={field.id}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default FormCanvas;