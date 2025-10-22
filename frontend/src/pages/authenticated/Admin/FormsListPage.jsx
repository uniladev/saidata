// frontend/src/pages/authenticated/Admin/FormsListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Tag,
  MoreVertical,
  Copy,
  Archive
} from 'lucide-react';
import api from '../../../config/api';

const FormsListPage = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Available filters (these will be populated from the forms data)
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Fetch forms on component mount
  useEffect(() => {
    fetchForms();
  }, []);

  // Extract unique categories and tags from forms
  useEffect(() => {
    if (forms.length > 0) {
      const categories = [...new Set(forms.map(form => form.category).filter(Boolean))];
      const tags = [...new Set(forms.flatMap(form => form.tags || []))];
      
      setAvailableCategories(categories);
      setAvailableTags(tags);
    }
  }, [forms]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/forms');
      setForms(response.data.data || []);
      console.log(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError('Failed to load forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter forms based on search and filters
  const filteredForms = forms.filter(form => {
    // Search filter
    const matchesSearch = form.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    
    // Tags filter
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => form.tags?.includes(tag));
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && form.is_active) ||
                         (statusFilter === 'inactive' && !form.is_active);
    
    return matchesSearch && matchesCategory && matchesTags && matchesStatus;
  });

  const handleDeleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) {
      return;
    }

    try {
      await api.delete(`/forms/${formId}`);
      alert('Form deleted successfully');
      fetchForms();
    } catch (err) {
      console.error('Error deleting form:', err);
      alert('Failed to delete form');
    }
  };

  const handleDuplicateForm = async (formId) => {
    try {
      // Fetch the form details
      const response = await api.get(`/forms/${formId}`);
      const formData = response.data.data;
      
      // Create a duplicate with modified title
      const duplicateData = {
        ...formData,
        title: `${formData.title} (Copy)`,
        slug: `${formData.slug}-copy-${Date.now()}`
      };
      
      await api.post('/forms', { form: duplicateData });
      alert('Form duplicated successfully');
      fetchForms();
    } catch (err) {
      console.error('Error duplicating form:', err);
      alert('Failed to duplicate form');
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setStatusFilter('all');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchForms}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and organize your forms
              </p>
            </div>
            <button
              onClick={() => navigate('/create-form')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Form
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search forms by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {(selectedCategory !== 'all' || selectedTags.length > 0 || statusFilter !== 'all') && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {[
                    selectedCategory !== 'all' ? 1 : 0,
                    selectedTags.length,
                    statusFilter !== 'all' ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {availableCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.length > 0 ? (
                      availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {tag}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No tags available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory !== 'all' || selectedTags.length > 0 || statusFilter !== 'all') && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Forms List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No forms found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {forms.length === 0 
                ? 'Get started by creating a new form.'
                : 'Try adjusting your search or filters.'}
            </p>
            {forms.length === 0 && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/create-form')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Form
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map(form => (
              <FormCard
                key={form._id}
                form={form}
                onEdit={() => navigate(`/edit-form/${form._id}`)}
                onView={() => navigate(`/form/${form.slug}`)}
                onDelete={() => handleDeleteForm(form._id)}
                onDuplicate={() => handleDuplicateForm(form._id)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {filteredForms.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredForms.length} of {forms.length} form{forms.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

// Form Card Component
const FormCard = ({ form, onEdit, onView, onDelete, onDuplicate, formatDate }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {form.title || 'Untitled Form'}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {form.description || 'No description'}
            </p>
          </div>
          
          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => { onEdit(); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => { onDuplicate(); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </button>
                <button
                  onClick={() => { onView(); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-4 space-y-2">
          {/* Status Badge */}
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              form.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {form.is_active ? 'Active' : 'Inactive'}
            </span>
            
            {form.category && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Tag className="w-3 h-3 mr-1" />
                {form.category}
              </span>
            )}
          </div>

          {/* Tags */}
          {form.tags && form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {form.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {form.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                  +{form.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Date and Fields Count */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(form.created_at)}
            </div>
            <div>
              {form.fields?.length || 0} field{form.fields?.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer - Quick Actions */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          View Form
        </button>
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default FormsListPage;