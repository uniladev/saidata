// ===== Loading State Component =====
// frontend/src/components/formTaker/LoadingState.jsx
import React from 'react';

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading form...</p>
      </div>
    </div>
  );
};

export default LoadingState;