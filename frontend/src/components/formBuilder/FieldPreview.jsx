// ===== 7. FieldPreview Component =====
// frontend/src/components/formBuilder/FieldPreview.jsx
import React from 'react';

const FieldPreview = ({ field }) => {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <input 
          type={field.type} 
          placeholder={field.placeholder} 
          className="w-full px-3 py-2 border rounded" 
          disabled 
        />
      );
    
    case 'textarea':
      return (
        <textarea 
          placeholder={field.placeholder} 
          rows={field.rows} 
          className="w-full px-3 py-2 border rounded" 
          disabled 
        />
      );
    
    case 'number':
      return (
        <input 
          type="number" 
          placeholder={field.placeholder} 
          className="px-3 py-2 border rounded" 
          disabled 
        />
      );
    
    case 'select':
      return (
        <select className="w-full px-3 py-2 border rounded" disabled>
          <option>Select an option</option>
          {field.options.map((opt, i) => (
            <option key={i}>{opt.label}</option>
          ))}
        </select>
      );
    
    case 'radio':
      return (
        <div className="space-y-1">
          {field.options.map((opt, i) => (
            <div key={i} className="flex items-center">
              <input type="radio" disabled className="mr-2" />
              <label>{opt.label}</label>
            </div>
          ))}
        </div>
      );
    
    case 'checkbox':
      return (
        <div className="space-y-1">
          {field.options.map((opt, i) => (
            <div key={i} className="flex items-center">
              <input type="checkbox" disabled className="mr-2" />
              <label>{opt.label}</label>
            </div>
          ))}
        </div>
      );
    
    case 'file':
      return (
        <div className="flex items-center space-x-2">
          <input type="file" disabled className="text-sm" />
          {field.fileOptions.multiple && <span className="text-xs text-gray-500">Multiple files allowed</span>}
          {field.fileOptions.accept && <span className="text-xs text-gray-500">Accept: {field.fileOptions.accept}</span>}
        </div>
      );
    
    case 'date':
      return <input type="date" className="px-3 py-2 border rounded" disabled />;
    
    case 'time':
      return <input type="time" className="px-3 py-2 border rounded" disabled />;
    
    case 'color':
      return <input type="color" className="h-10 w-20" disabled />;
    
    case 'range':
      return (
        <div>
          <input type="range" min={field.min} max={field.max} className="w-full" disabled />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{field.min}</span>
            <span>{field.max}</span>
          </div>
        </div>
      );
    
    case 'rating':
      return (
        <div className="flex space-x-1">
          {[...Array(field.maxRating)].map((_, i) => (
            <span key={i} className="text-2xl text-gray-300">★</span>
          ))}
        </div>
      );
    
    case 'section':
      return <div className="text-lg font-semibold">{field.label}</div>;
    
    default:
      return <div className="text-gray-500">Preview not available</div>;
  }
};

export default FieldPreview;