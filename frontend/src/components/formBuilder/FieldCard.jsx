// frontend/src/components/formBuilder/FieldCard.jsx
import React from 'react';
import { GripVertical, Copy, Trash2 } from 'lucide-react';
import FieldPreview from './FieldPreview';
import { FIELD_TYPES } from '../../constants/fieldTypes';

const FieldCard = ({
  field,
  index,
  isSelected,
  dragOverInfo,
  onSelect,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDuplicate,
  onDelete,
}) => {
  const fieldType = FIELD_TYPES.find(f => f.type === field.type);

  // Check if this field is the current drag over target
  const isDragOverTop = dragOverInfo?.field?.id === field.id && dragOverInfo?.position === 'top';
  const isDragOverBottom = dragOverInfo?.field?.id === field.id && dragOverInfo?.position === 'bottom';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, field)}
      onDragOver={(e) => onDragOver(e, field)}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onSelect}
      className={`bg-white border rounded-lg p-4 cursor-move transition-all duration-150 relative
        ${isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
        ${isDragOverTop ? 'border-t-4 border-t-blue-500' : ''}
        ${isDragOverBottom ? 'border-b-4 border-b-blue-500' : ''}
      `}
    >
      {/* Visual indicator for top drop */}
      {isDragOverTop && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Drop here
        </div>
      )}
      
      {/* Visual indicator for bottom drop */}
      {isDragOverBottom && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Drop here
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2 flex-wrap">
              <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                {fieldType?.label}
              </span>
              {field.required && (
                <span className="text-xs text-red-500">Required</span>
              )}
            </div>
            <div className="text-base font-medium mb-1 break-words">{field.label || 'Untitled Field'}</div>
            {field.helpText && (
              <div className="text-sm text-gray-400 mt-1 break-words">{field.helpText}</div>
            )}
            
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <FieldPreview field={field} />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldCard;