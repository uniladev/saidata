// frontend/src/components/ui/formFields/RatingInput.jsx
import React, { useState } from 'react';

const RatingInput = ({ field, value, onChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const maxRating = field.maxRating || 5;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex items-center space-x-1">
        {[...Array(maxRating)].map((_, index) => {
          const ratingValue = index + 1;
          const isActive = (hoveredRating || value || 0) >= ratingValue;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(field.name, ratingValue)}
              onMouseEnter={() => setHoveredRating(ratingValue)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-3xl transition-colors focus:outline-none"
              aria-label={`Rate ${ratingValue} out of ${maxRating}`}
            >
              <span className={isActive ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            </button>
          );
        })}
        
        {value && (
          <span className="ml-3 text-sm text-gray-600">
            {value} / {maxRating}
          </span>
        )}
      </div>
      
      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
};

export default RatingInput;