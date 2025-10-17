// ===== 4. FieldCard Component =====
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

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onSelect}
      className={`bg-white border rounded-lg p-4 cursor-move transition-all duration-150
        ${isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'}
        ${dragOverInfo?.index === index && dragOverInfo?.position === 'top' ? 'border-t-4 border-t-blue-500' : ''}
        ${dragOverInfo?.index === index && dragOverInfo?.position === 'bottom' ? 'border-b-4 border-b-blue-500' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <GripVertical className="w-5 h-5 text-gray-400 mt-1" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                {fieldType?.label}
              </span>
              {field.required && (
                <span className="text-xs text-red-500">Required</span>
              )}
            </div>
            <div className="text-base font-medium mb-1">{field.label}</div>
            {field.type !== 'section' && (
              <div className="text-sm text-gray-500">Name: {field.name}</div>
            )}
            {field.helpText && (
              <div className="text-sm text-gray-400 mt-1">{field.helpText}</div>
            )}
            
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <FieldPreview field={field} />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-gray-100 rounded"
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