// frontend/src/components/formBuilder/FormVersionHistory.jsx
import React, { useState, useEffect } from 'react';
import { 
  History, 
  Clock, 
  User, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Eye,
  RotateCcw,
  X
} from 'lucide-react';
import api from '../../config/api';

const FormVersionHistory = ({ formId, onClose, onRestoreVersion }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedVersion, setExpandedVersion] = useState(null);
  const [selectedVersionData, setSelectedVersionData] = useState(null);
  const [viewingVersion, setViewingVersion] = useState(null);

  useEffect(() => {
    fetchVersionHistory();
  }, [formId]);

  const fetchVersionHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/forms/${formId}/history`);
      setVersions(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching version history:', err);
      setError('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const fetchVersionDetails = async (versionNumber) => {
    try {
      const response = await api.get(`/forms/${formId}/version/${versionNumber}`);
      setSelectedVersionData(response.data.data);
      setViewingVersion(versionNumber);
    } catch (err) {
      console.error('Error fetching version details:', err);
      alert('Failed to load version details');
    }
  };

  const handleRestoreVersion = async (version) => {
    if (!window.confirm(`Are you sure you want to restore to version ${version.version}? This will create a new version with the old data.`)) {
      return;
    }

    if (onRestoreVersion) {
      onRestoreVersion(version);
    }
  };

  const toggleExpand = (versionId) => {
    setExpandedVersion(expandedVersion === versionId ? null : versionId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Version History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto p-6">
          {versions.length === 0 ? (
            <div className="text-center py-12">
              <History className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No version history</h3>
              <p className="mt-1 text-sm text-gray-500">
                No previous versions are available for this form.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div
                  key={version._id}
                  className={`border rounded-lg transition-all ${
                    index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Version Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            index === 0 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            Version {version.version}
                          </span>
                          {index === 0 && (
                            <span className="text-xs font-medium text-blue-600">
                              Current
                            </span>
                          )}
                        </div>
                        
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">
                          {version.title || 'Untitled Form'}
                        </h3>
                        
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(version.created_at)}</span>
                          </div>
                          
                          {version.changedBy && (
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{version.changedBy.name || version.changedBy.email}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>{version.fields?.length || 0} fields</span>
                          </div>
                        </div>

                        {version.change_summary && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                            <span className="font-medium">Change Summary:</span> {version.change_summary}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            if (expandedVersion === version._id) {
                              setExpandedVersion(null);
                            } else {
                              toggleExpand(version._id);
                              fetchVersionDetails(version.version);
                            }
                          }}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {index !== 0 && (
                          <button
                            onClick={() => handleRestoreVersion(version)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Restore this version"
                          >
                            <RotateCcw className="w-5 h-5 text-blue-600" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => toggleExpand(version._id)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                          {expandedVersion === version._id ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedVersion === version._id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      {viewingVersion === version.version && selectedVersionData ? (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Form Configuration</h4>
                            <div className="bg-white rounded p-3 space-y-2 text-sm">
                              <div><span className="font-medium">Title:</span> {selectedVersionData.title}</div>
                              <div><span className="font-medium">Description:</span> {selectedVersionData.description || 'N/A'}</div>
                              <div><span className="font-medium">Slug:</span> {selectedVersionData.slug}</div>
                              <div><span className="font-medium">Submit Button:</span> {selectedVersionData.submitText}</div>
                              <div><span className="font-medium">Success Message:</span> {selectedVersionData.successMessage}</div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Fields ({selectedVersionData.fields?.length || 0})
                            </h4>
                            <div className="space-y-2">
                              {selectedVersionData.fields?.map((field, idx) => (
                                <div key={idx} className="bg-white rounded p-3 text-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">{field.label}</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                      {field.type}
                                    </span>
                                  </div>
                                  <div className="text-gray-600 space-y-1">
                                    <div><span className="font-medium">Name:</span> {field.name}</div>
                                    {field.required && (
                                      <div className="text-red-600">Required field</div>
                                    )}
                                    {field.placeholder && (
                                      <div><span className="font-medium">Placeholder:</span> {field.placeholder}</div>
                                    )}
                                    {field.helpText && (
                                      <div><span className="font-medium">Help:</span> {field.helpText}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormVersionHistory;