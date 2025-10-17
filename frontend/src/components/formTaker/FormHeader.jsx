// ===== FormHeader Component =====
// frontend/src/components/formTaker/FormHeader.jsx
import React from 'react';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FormHeader = ({ title, description, formId }) => {
  const navigate = useNavigate();

  const shareForm = () => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    alert('Form link copied to clipboard!');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>
        <button
          onClick={shareForm}
          className="flex items-center bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </button>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="text-white/90 text-lg">{description}</p>
      )}
    </div>
  );
};

export default FormHeader;
