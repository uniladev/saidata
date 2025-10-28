// frontend/src/components/formBuilder/FieldPreview.jsx
import React from 'react';

const FieldPreview = ({ field }) => {
  // Add safety check
  if (!field || !field.type) {
    return <div className="text-gray-500 text-sm italic">Invalid field data</div>;
  }

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <input 
          type={field.type} 
          placeholder={field.placeholder || 'Enter text...'} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          disabled 
        />
      );
    
    case 'textarea':
      return (
        <textarea 
          placeholder={field.placeholder || 'Enter your text...'} 
          rows={field.rows || 4} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
          disabled 
        />
      );
    
    case 'number':
      return (
        <input 
          type="number" 
          placeholder={field.placeholder || 'Enter a number...'} 
          min={field.min}
          max={field.max}
          step={field.step || 1}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          disabled 
        />
      );
    
    case 'select':
      return (
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" disabled>
          <option>{field.placeholder || 'Select an option'}</option>
          {(field.options || []).map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    
    case 'radio':
      return (
        <div className="space-y-2">
          {(field.options || []).map((opt, i) => (
            <div key={i} className="flex items-center">
              <input 
                type="radio" 
                name={`preview-${field.id}`}
                id={`preview-${field.id}-${i}`}
                disabled 
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
              />
              <label htmlFor={`preview-${field.id}-${i}`} className="text-sm text-gray-700">
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      );
    
    case 'checkbox':
      return (
        <div className="space-y-2">
          {(field.options || []).map((opt, i) => (
            <div key={i} className="flex items-center">
              <input 
                type="checkbox" 
                id={`preview-${field.id}-${i}`}
                disabled 
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
              />
              <label htmlFor={`preview-${field.id}-${i}`} className="text-sm text-gray-700">
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      );
    
    case 'file':
      return (
        <div className="space-y-2">
          <input 
            type="file" 
            disabled 
            multiple={field.fileOptions?.multiple}
            accept={field.fileOptions?.accept}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50"
          />
          {field.fileOptions?.multiple && (
            <span className="text-xs text-gray-500">Multiple files allowed</span>
          )}
          {field.fileOptions?.accept && (
            <span className="text-xs text-gray-500">Accepted: {field.fileOptions.accept}</span>
          )}
          {field.fileOptions?.maxSize && (
            <span className="text-xs text-gray-500">Max size: {field.fileOptions.maxSize}MB</span>
          )}
        </div>
      );
    
    case 'date':
      return (
        <input 
          type="date" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          disabled 
        />
      );
    
    case 'time':
      return (
        <input 
          type="time" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          disabled 
        />
      );
    
    case 'color':
      return (
        <div className="flex items-center space-x-2">
          <input 
            type="color" 
            className="h-10 w-20 rounded border border-gray-300 cursor-pointer" 
            disabled 
          />
          <span className="text-sm text-gray-500">Pick a color</span>
        </div>
      );
    
    case 'range':
      return (
        <div className="space-y-2">
          <input 
            type="range" 
            min={field.min || 0} 
            max={field.max || 100} 
            step={field.step || 1}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            disabled 
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{field.min || 0}</span>
            <span>{field.max || 100}</span>
          </div>
        </div>
      );
    
    case 'rating':
      return (
        <div className="flex space-x-1">
          {[...Array(field.maxRating || 5)].map((_, i) => (
            <span key={i} className="text-2xl text-gray-300 cursor-pointer hover:text-yellow-400">
              ★
            </span>
          ))}
        </div>
      );
    
    case 'section':
      return (
        <div className="py-2">
          <h3 className="text-lg font-semibold text-gray-900">{field.label}</h3>
          {field.helpText && (
            <p className="text-sm text-gray-600 mt-1">{field.helpText}</p>
          )}
        </div>
      );
    
    default:
      return (
        <div className="text-gray-500 text-sm italic">
          Preview not available for field type: <strong>{field.type}</strong>
        </div>
      );
  }
};

export default FieldPreview;