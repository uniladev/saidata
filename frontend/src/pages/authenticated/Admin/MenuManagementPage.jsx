// src/pages/authenticated/Admin/MenuManagementPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { Edit, Trash2, GripVertical, Plus, FileText } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core'; 
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';

// Helper component for draggable items
const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center">
        <span {...listeners} className="cursor-grab text-gray-400 mr-2 p-1">
          <GripVertical size={16} />
        </span>
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

// Modal for Add/Edit Menu Items
const MenuItemFormModal = ({ item, itemType, parentId, categoryId, isAddingExistingForm, onClose, onSave }) => {
  const isEditing = !!item;
  const type = isEditing ? item.type : itemType;

  const [formData, setFormData] = useState({
    name: item?.name || '',
    path: item?.path || '',
    icon: item?.icon || (type === 'subcategory' ? 'Folder' : ''),
    order: item?.order || 1,
    roles: item?.roles?.join(', ') || 'user',
    formId: item?.formId || '',
    outputConfig: item?.outputConfig || '',
  });

  const [formsList, setFormsList] = useState([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  // Fetch forms for service dropdown
  useEffect(() => {
    if (type === 'service') {
      const fetchForms = async () => {
        setIsLoadingForms(true);
        try {
          const response = await api.get('/forms');
          setFormsList(response.data.data || []);
        } catch (error) {
          console.error("Error fetching forms:", error);
          setFormsList([]);
        } finally {
          setIsLoadingForms(false);
        }
      };
      fetchForms();
    }
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form selection for adding existing form
  const handleFormSelect = (form) => {
    setSelectedForm(form);
    setFormData(prev => ({
      ...prev,
      name: form.title,
      formId: form.id,
      path: `/dashboard/forms/${form.id}`,
      outputConfig: `Generate document from ${form.title}`
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rolesArray = formData.roles.split(',').map(role => role.trim()).filter(role => role);
    const orderNumber = parseInt(formData.order, 10) || 1;

    const savedItemData = {
      ...(isEditing ? { id: item.id } : {}),
      type: type,
      parentId: parentId,
      categoryId: categoryId,
      name: formData.name,
      order: orderNumber,
      roles: rolesArray,
      ...(type !== 'category' && { path: formData.path }),
      ...(type === 'subcategory' && { icon: formData.icon }),
      ...(type === 'service' && { 
        formId: formData.formId, 
        outputConfig: formData.outputConfig 
      }),
    };

    onSave(savedItemData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-gray-900 capitalize">
              {isEditing ? `Edit ${type}` : isAddingExistingForm ? 'Add Existing Form' : `Add New ${type}`}
            </h3>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {isAddingExistingForm && type === 'service' ? (
              // Special UI for adding existing form
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select an Existing Form</label>
                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    {isLoadingForms ? (
                      <div className="p-4 text-center text-gray-500">Loading forms...</div>
                    ) : formsList.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No forms available</div>
                    ) : (
                      <div className="space-y-2 p-2">
                        {formsList.map(form => (
                          <div 
                            key={form.id}
                            onClick={() => handleFormSelect(form)}
                            className={`p-3 rounded border cursor-pointer hover:bg-gray-50 ${
                              selectedForm?.id === form.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="font-medium text-sm">{form.title}</div>
                            <div className="text-xs text-gray-500">Form ID: {form.id}</div>
                            {form.description && (
                              <div className="text-xs text-gray-400 mt-1">{form.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedForm && (
                  <div className="bg-gray-50 p-4 rounded border">
                    <h4 className="font-medium text-sm mb-2">Selected Form Details:</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {formData.name}</div>
                      <div><strong>Path:</strong> {formData.path}</div>
                      <div><strong>Output Config:</strong> {formData.outputConfig}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Regular form fields for creating/editing
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required 
                  />
                </div>

                {type !== 'category' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Path</label>
                    <input 
                      type="text" 
                      name="path" 
                      value={formData.path} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      required 
                      placeholder="e.g., /dashboard/faculty/general"
                    />
                  </div>
                )}

                {type === 'subcategory' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon Name</label>
                    <input 
                      type="text" 
                      name="icon" 
                      value={formData.icon} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      placeholder="e.g., Folder (from lucide-react)" 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input 
                    type="number" 
                    name="order" 
                    value={formData.order} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required 
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Roles (comma-separated)</label>
                  <input 
                    type="text" 
                    name="roles" 
                    value={formData.roles} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    placeholder="e.g., admin, user" 
                  />
                </div>

                {type === 'service' && (
                  <>
                    <hr className="my-4"/>
                    <div>
                      <label className="block text-sm font-medium mb-1">Link to Form</label>
                      <select
                        name="formId"
                        value={formData.formId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                        required
                        disabled={isLoadingForms}
                      >
                        <option value="" disabled>
                          {isLoadingForms ? 'Loading forms...' : '-- Select a Form --'}
                        </option>
                        {formsList.map(form => (
                          <option key={form.id} value={form.id}>{form.title}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Select the form created in the Form Builder.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Output Configuration</label>
                      <textarea
                        name="outputConfig"
                        value={formData.outputConfig}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={3}
                        placeholder="Define how the output document should be generated..."
                      />
                    </div>
                  </>
                )}
              </>
            )}
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to determine depth level of an item
const getItemDepth = (item, menuStructure, depth = 0) => {
  if (!item.parentId) return depth;
  
  // Find parent in the structure
  for (const category of menuStructure) {
    if (category.id === item.parentId) return depth + 1;
    if (category.submenu) {
      for (const sub1 of category.submenu) {
        if (sub1.id === item.parentId) return depth + 2;
        if (sub1.submenu) {
          for (const sub2 of sub1.submenu) {
            if (sub2.id === item.parentId) return depth + 3;
          }
        }
      }
    }
  }
  return depth;
};

const MenuManagementPage = () => {
  const [menuStructure, setMenuStructure] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log("OBJEK USER SAAT INI:", user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Fetch menu structure from backend
  useEffect(() => {
    fetchMenuStructure();
  }, []);

  const filteredMenuStructure = useMemo(() => {
    if (!menuStructure || menuStructure.length === 0 || !user || !user.name) {
      return [];
    }

    const adminName = user.name;

    if (adminName === 'Administrator') {
      return menuStructure;
    }

    if (adminName === 'Administrator Univ') {
      return menuStructure.filter(cat => 
        cat.name !== 'Layanan Fakultas' && cat.name !== 'Layanan Jurusan'
      );
    }

    if (adminName === 'Administrator Fakultas') {
      return menuStructure.filter(cat => 
        cat.name !== 'Layanan Universitas' && cat.name !== 'Layanan Jurusan'
      );
    }
    
    if (adminName === 'Administrator Jurusan') {
      return menuStructure.filter(cat => 
        cat.name !== 'Layanan Universitas' && cat.name !== 'Layanan Fakultas'
      );
    }

    return [];
  }, [menuStructure, user]);

  const fetchMenuStructure = async () => {
    console.log('🔄 Frontend: Starting fetchMenuStructure');
    setIsLoading(true);
    setError(null);
    try {
      console.log('🌐 Frontend: Making GET request to /menu-management');
      const response = await api.get('/menu-management');
      console.log('📊 Frontend: Raw response:', response);
      console.log('📋 Frontend: Menu data received:', response.data.data.menu);
      setMenuStructure(response.data.data.menu || []);
      console.log('✅ Frontend: Menu structure updated in state');
    } catch (err) {
      console.error('❌ Frontend: Error fetching menu structure:', err);
      console.error('📋 Frontend: Error response:', err.response?.data);
      setError(err.response?.data?.message || "Failed to load menu structure");
    } finally {
      setIsLoading(false);
    }
  };

  // Add subcategory (level 1, 2, or 3)
  const handleAddSubcategory = (categoryId, parentId = null) => {
    setCurrentItem({ 
      type: 'subcategory', 
      parentId: parentId || categoryId,
      categoryId: categoryId 
    });
    setIsModalOpen(true);
  };

  // Add service (only at level 3 subcategory)
  const handleAddService = (categoryId, parentId) => {
    setCurrentItem({ 
      type: 'service', 
      parentId: parentId,
      categoryId: categoryId 
    });
    setIsModalOpen(true);
  };

  // Handle Create Form button - redirect to form creation page
  const handleCreateForm = () => {
    navigate('/forms/create');
  };

  // Handle Add Form button - open modal to select existing form
  const handleAddForm = (categoryId, parentId) => {
    setCurrentItem({ 
      type: 'service', 
      parentId: parentId,
      categoryId: categoryId,
      isAddingExistingForm: true
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item, categoryId) => {
    setCurrentItem({ ...item, categoryId });
    setIsModalOpen(true);
  };

const handleSaveItem = async (savedItemData) => {
  console.log('🚀 Frontend: Starting handleSaveItem');
  console.log('📦 Frontend: Data to save:', savedItemData);

  setIsLoading(true);
  try {
    let response; // Declare the variable
    
    if (savedItemData.id) {
      console.log('✏️ Frontend: Updating existing item, ID:', savedItemData.id);
      response = await api.put(`/menu-management/${savedItemData.id}`, savedItemData); // Store response
      console.log('✅ Frontend: Update response:', response);
    } else {
      console.log('➕ Frontend: Creating new item');
      console.log('🌐 Frontend: Making POST request to /menu-management');
      response = await api.post('/menu-management', savedItemData); // Store response
      console.log('✅ Frontend: Create response:', response);
    }
    
    console.log('🔄 Frontend: Refreshing menu structure...');
    await fetchMenuStructure();
    console.log('✅ Frontend: Menu structure refreshed');

    setIsModalOpen(false);
    setCurrentItem(null);
    console.log('🎉 Frontend: Save completed successfully');
  } catch (err) {
    console.error('❌ Frontend: Error saving menu item:', err);
    console.error('📋 Frontend: Error response:', err.response?.data);
    console.error('🔢 Frontend: Error status:', err.response?.status);
    alert(err.response?.data?.message || "Failed to save menu item");
  } finally {
    setIsLoading(false);
  }
};

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item? This might also delete its children.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await api.delete(`/menu-management/${itemId}`);
      await fetchMenuStructure();
    } catch (err) {
      console.error("Error deleting menu item:", err);
      alert(err.response?.data?.message || "Failed to delete menu item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Helper function to find and update item order in nested structure
    const updateItemOrder = (items, activeId, overId) => {
      const activeIndex = items.findIndex(item => item.id === activeId);
      const overIndex = items.findIndex(item => item.id === overId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        return arrayMove(items, activeIndex, overIndex);
      }
      return items;
    };

    // Helper function to recursively find and update nested items
    const updateNestedStructure = (structure) => {
      return structure.map(category => {
        // Check if dragging within this category's top level
        if (category.submenu) {
          const topLevelIds = category.submenu.map(item => item.id);
          if (topLevelIds.includes(activeId) && topLevelIds.includes(overId)) {
            return {
              ...category,
              submenu: updateItemOrder(category.submenu, activeId, overId)
            };
          }
          
          // Check nested levels
          return {
            ...category,
            submenu: category.submenu.map(sub1 => {
              if (sub1.submenu) {
                const sub1Ids = sub1.submenu.map(item => item.id);
                if (sub1Ids.includes(activeId) && sub1Ids.includes(overId)) {
                  return {
                    ...sub1,
                    submenu: updateItemOrder(sub1.submenu, activeId, overId)
                  };
                }
                
                // Check deeper levels
                return {
                  ...sub1,
                  submenu: sub1.submenu.map(sub2 => {
                    if (sub2.submenu) {
                      const sub2Ids = sub2.submenu.map(item => item.id);
                      if (sub2Ids.includes(activeId) && sub2Ids.includes(overId)) {
                        return {
                          ...sub2,
                          submenu: updateItemOrder(sub2.submenu, activeId, overId)
                        };
                      }
                    }
                    return sub2;
                  })
                };
              }
              return sub1;
            })
          };
        }
        return category;
      });
    };

    // Check if dragging categories
    const isCategory = menuStructure.some(cat => cat.id === activeId);
    
    if (isCategory) {
      // Reorder categories
      const oldIndex = menuStructure.findIndex(cat => cat.id === activeId);
      const newIndex = menuStructure.findIndex(cat => cat.id === overId);
      const reorderedCategories = arrayMove(menuStructure, oldIndex, newIndex);
      
      setMenuStructure(reorderedCategories);
      
      try {
        await api.put('/menu-management/reorder', {
          items: reorderedCategories.map((cat, index) => ({
            id: cat.id,
            order: index + 1
          }))
        });
      } catch (err) {
        console.error("Error saving order:", err);
        fetchMenuStructure();
      }
    } else {
      // Reorder subcategories/services
      const updatedStructure = updateNestedStructure(menuStructure);
      setMenuStructure(updatedStructure);
      
      try {
        // You might need to implement a more specific reorder endpoint for nested items
        await api.put('/menu-management/reorder-nested', {
          structure: updatedStructure
        });
      } catch (err) {
        console.error("Error saving nested order:", err);
        fetchMenuStructure();
      }
    }
  };

  // Recursive component to render subcategory levels
  const renderSubcategory = (subcategory, categoryId, level = 1) => {
    const maxLevel = 3;
    const canAddSubcategory = level < maxLevel;
    const canAddService = true; // Allow adding service at any level
    
    // Different styling for each level
    const levelStyles = {
      1: "ml-6 pl-4 border-l-2 border-blue-200",
      2: "ml-6 pl-4 border-l-2 border-green-200", 
      3: "ml-6 pl-4 border-l-2 border-orange-200"
    };

    const bgStyles = {
      1: "bg-blue-50",
      2: "bg-green-50",
      3: "bg-orange-50"
    };

    return (
      <div className={`${bgStyles[level]} p-2 rounded border border-gray-200 shadow-sm`}>
        {/* Subcategory Header */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{subcategory.name}</span>
            <span className="text-xs text-gray-500">Level {level}</span>
            {subcategory.submenu && (
              <span className="text-xs text-gray-400">({subcategory.submenu.length} items)</span>
            )}
          </div>
          <div className="space-x-1">
            {canAddSubcategory && (
              <button 
                onClick={() => handleAddSubcategory(categoryId, subcategory.id)} 
                className="text-blue-600 hover:text-blue-900 text-xs font-medium px-2 py-1 bg-blue-100 rounded"
              >
                Add Sub Category
              </button>
            )}
            {canAddService && (
              <button 
                onClick={() => handleAddService(categoryId, subcategory.id)} 
                className="text-green-600 hover:text-green-900 text-xs font-medium px-2 py-1 bg-green-100 rounded"
              >
                Add Service
              </button>
            )}
            <button 
              onClick={() => handleEditItem(subcategory, categoryId)} 
              className="text-indigo-600 hover:text-indigo-900 text-xs"
            >
              <Edit size={12}/>
            </button>
            <button 
              onClick={() => handleDeleteItem(subcategory.id)} 
              className="text-red-600 hover:text-red-900 text-xs"
            >
              <Trash2 size={12}/>
            </button>
          </div>
        </div>

        {/* Render children (next level subcategories or services) */}
        {subcategory.submenu && subcategory.submenu.length > 0 && (
          <div className={levelStyles[level] + " space-y-2 mt-2"}>
            <SortableContext
              items={subcategory.submenu.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {subcategory.submenu
                .sort((a, b) => a.order - b.order)
                .map((child) => {
                  if (child.type === 'service') {
                    // Render service with drag handle
                    return (
                      <SortableItem key={child.id} id={child.id}>
                        <div className="bg-gray-100 p-2 rounded border border-gray-300">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700">🔧 {child.name}</span>
                              <span className="text-xs text-green-600">Service</span>
                              {child.formId && (
                                <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">
                                  Form ID: {child.formId}
                                </span>
                              )}
                            </div>
                            <div className="space-x-1">
                              <button 
                                onClick={handleCreateForm}
                                className="text-green-600 hover:text-green-900 text-xs px-2 py-1 bg-green-100 rounded"
                                title="Create New Form"
                              >
                                <FileText size={10}/>
                              </button>
                              <button 
                                onClick={() => handleAddForm(categoryId, subcategory.id)}
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 bg-blue-100 rounded"
                                title="Add Existing Form"
                              >
                                <Plus size={10}/>
                              </button>
                              <button 
                                onClick={() => handleEditItem(child, categoryId)} 
                                className="text-indigo-600 hover:text-indigo-900 text-xs"
                                title="Edit Service"
                              >
                                <Edit size={10}/>
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(child.id)} 
                                className="text-red-600 hover:text-red-900 text-xs"
                                title="Delete Service"
                              >
                                <Trash2 size={10}/>
                              </button>
                            </div>
                          </div>
                        </div>
                      </SortableItem>
                    );
                  } else {
                    // Render next level subcategory
                    return (
                      <SortableItem key={child.id} id={child.id}>
                        {renderSubcategory(child, categoryId, level + 1)}
                      </SortableItem>
                    );
                  }
                })}
            </SortableContext>
          </div>
        )}
      </div>
    );
  };

  if (isLoading && menuStructure.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading menu structure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchMenuStructure}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Hierarchy: Category → Sub Category (Level 1) → Sub Category (Level 2) → Sub Category (Level 3) → Service
          </p>
        </div>
        <button 
          onClick={() => {
            setCurrentItem({ type: 'category', parentId: null, categoryId: null });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Category
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          {!Array.isArray(menuStructure) || filteredMenuStructure.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No menu structure available or loading...</p>
          ) : (
            <SortableContext
              items={filteredMenuStructure.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {filteredMenuStructure
                  .sort((a, b) => a.order - b.order)
                  .map((category) => (
                    <SortableItem key={category.id} id={category.id}>
                      <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
                        {/* Category Header */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-gray-800">📁 {category.name}</span>
                            <span className="text-sm text-gray-500">Category (Fixed)</span>
                            <span className="text-xs text-gray-400">({category.submenu?.length || 0} subcategories)</span>
                          </div>
                          <div className="space-x-2">
                            <button 
                              onClick={() => handleAddSubcategory(category.id)} 
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium px-3 py-1 bg-blue-100 rounded"
                            >
                              Add Sub Category
                            </button>
                            <button 
                              onClick={() => handleEditItem(category, category.id)} 
                              className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                              <Edit size={14}/>
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(category.id)} 
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              <Trash2 size={14}/>
                            </button>
                          </div>
                        </div>

                        {/* Subcategories */}
                        {category.submenu && category.submenu.length > 0 && (
                          <div className="space-y-3">
                            <SortableContext
                              items={category.submenu.map(item => item.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {category.submenu
                                .sort((a, b) => a.order - b.order)
                                .map((subcategory) => (
                                  <SortableItem key={subcategory.id} id={subcategory.id}>
                                    {renderSubcategory(subcategory, category.id, 1)}
                                  </SortableItem>
                                ))}
                            </SortableContext>
                          </div>
                        )}
                      </div>
                    </SortableItem>
                  ))}
              </div>
            </SortableContext>
          )}
        </div>
      </DndContext>

      {isModalOpen && (
        <MenuItemFormModal
          item={currentItem?.id ? currentItem : null}
          itemType={currentItem?.type}
          parentId={currentItem?.parentId}
          categoryId={currentItem?.categoryId}
          isAddingExistingForm={currentItem?.isAddingExistingForm}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
};

export default MenuManagementPage;