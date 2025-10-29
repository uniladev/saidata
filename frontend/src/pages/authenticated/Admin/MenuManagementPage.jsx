// src/pages/authenticated/Admin/MenuManagementPage.jsx
import { useState, useEffect } from 'react';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core'; 
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../../../config/api'; // Uncommented for API calls

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
    <li ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center">
        <span {...listeners} className="cursor-grab text-gray-400 mr-2 p-1">
          <GripVertical size={16} />
        </span>
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </li>
  );
};

// Modal for Add/Edit Menu Items
const MenuItemFormModal = ({ item, itemType, parentId, categoryId, onClose, onSave }) => {
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
              {isEditing ? `Edit ${type}` : `Add New ${type}`}
            </h3>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
          </div>
          <div className="p-4 bg-gray-50 flex justify-end space-x-3">
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

const MenuManagementPage = () => {
  const [menuStructure, setMenuStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Fetch menu structure from backend
  useEffect(() => {
    fetchMenuStructure();
  }, []);

  const fetchMenuStructure = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/menu');
      console.log("DATA MENU DITERIMA:", response.data.data.menu);
      setMenuStructure(response.data.data.menu || []); // Access the 'menu' array, default to empty array if missing
    } catch (err) {
      console.error("Error fetching menu structure:", err);
      setError(err.response?.data?.message || "Failed to load menu structure");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubcategory = (categoryId) => {
    setCurrentItem({ 
      type: 'subcategory', 
      parentId: categoryId,
      categoryId: categoryId 
    });
    setIsModalOpen(true);
  };

  const handleAddService = (categoryId, subcategoryId) => {
    setCurrentItem({ 
      type: 'service', 
      parentId: subcategoryId,
      categoryId: categoryId 
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item, categoryId) => {
    setCurrentItem({ ...item, categoryId });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (savedItemData) => {
    setIsLoading(true);
    try {
      if (savedItemData.id) {
        // Update existing item
        await api.put(`/menu/${savedItemData.id}`, savedItemData);
      } else {
        // Create new item
        await api.post('/menu', savedItemData);
      }
      
      // Refresh menu structure
      await fetchMenuStructure();
      setIsModalOpen(false);
      setCurrentItem(null);
    } catch (err) {
      console.error("Error saving menu item:", err);
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
      await api.delete(`/menu/${itemId}`);
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

    // Find what type of item is being dragged
    const isCategory = menuStructure.some(cat => cat.id === activeId);
    
    if (isCategory) {
      // Reorder categories
      const oldIndex = menuStructure.findIndex(cat => cat.id === activeId);
      const newIndex = menuStructure.findIndex(cat => cat.id === overId);
      const reorderedCategories = arrayMove(menuStructure, oldIndex, newIndex);
      
      setMenuStructure(reorderedCategories);
      
      // Save new order to backend
      try {
        await api.put('/menu/reorder', {
          items: reorderedCategories.map((cat, index) => ({
            id: cat.id,
            order: index + 1
          }))
        });
      } catch (err) {
        console.error("Error saving order:", err);
        fetchMenuStructure(); // Rollback
      }
    } else {
      // Handle subcategory reordering within the same category
      let found = false;
      const newMenuStructure = menuStructure.map(category => {
        if (category.submenu) {
          const activeIndex = category.submenu.findIndex(sub => sub.id === activeId);
          const overIndex = category.submenu.findIndex(sub => sub.id === overId);
          
          if (activeIndex !== -1 && overIndex !== -1) {
            // Both items are in this category - reorder them
            const reorderedSubmenu = arrayMove(category.submenu, activeIndex, overIndex);
            found = true;
            return {
              ...category,
              submenu: reorderedSubmenu
            };
          }
        }
        return category;
      });

      if (found) {
        setMenuStructure(newMenuStructure);
        
        // Save new order to backend
        try {
          const categoryWithReorderedItems = newMenuStructure.find(cat => 
            cat.submenu && cat.submenu.some(sub => sub.id === activeId)
          );
          
          if (categoryWithReorderedItems) {
            await api.put('/menu/reorder', {
              items: categoryWithReorderedItems.submenu.map((sub, index) => ({
                id: sub.id,
                order: index + 1
              }))
            });
          }
        } catch (err) {
          console.error("Error saving subcategory order:", err);
          fetchMenuStructure(); // Rollback
        }
      }
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
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
          {!Array.isArray(menuStructure) || menuStructure.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No menu structure available or loading...</p>
          ) : (
            <SortableContext
              items={menuStructure.map(item => item.id)} // Safe now
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {menuStructure // Safe now
                  .sort((a, b) => a.order - b.order)
                  .map((category) => (
                    <SortableItem key={category.id} id={category.id}>
                      <div className="p-3 rounded-md border border-gray-200">
                        {/* Category Header */}
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-gray-800">{category.name}</span>
                            <span className="text-xs text-gray-500">({category.submenu?.length || 0} subcategories)</span>
                          </div>
                          <div className="space-x-2">
                            <button 
                              onClick={() => handleAddSubcategory(category.id)} 
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              Add Subcategory
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

                        {/* --- Subcategory Section --- */}
                        {category.submenu && category.submenu.length > 0 && (
                          // --- ADD SortableContext FOR SUBCATEGORIES ---
                          <SortableContext
                            items={category.submenu.map(sub => sub.id)} // IDs of subcategories in this category
                            strategy={verticalListSortingStrategy}
                            // id={`subcategory-${category.id}`} // Optional: Unique ID if needed
                          >
                            <ul className="ml-6 pl-4 border-l-2 border-blue-200 space-y-2 mt-2">
                              {category.submenu
                                .sort((a, b) => a.order - b.order)
                                .map((subcategory) => (
                                  // --- WRAP SUBCATEGORY LI WITH SortableItem ---
                                  <SortableItem key={subcategory.id} id={subcategory.id}>
                                    <div className="bg-white p-2 rounded border border-gray-200 shadow-sm">
                                      {/* Subcategory Content */}
                                      <div className="flex justify-between items-center mb-1">
                                        {/* Drag handle is now inside SortableItem */}
                                        <span className="text-sm font-medium">{subcategory.name}</span>
                                        <div className="space-x-1">
                                          <button onClick={() => handleAddService(category.id, subcategory.id)} className="text-green-600 hover:text-green-900 text-xs font-medium">Add Service</button>
                                          <button onClick={() => handleEditItem(subcategory, category.id)} className="text-indigo-600 hover:text-indigo-900 text-xs"><Edit size={12}/></button>
                                          <button onClick={() => handleDeleteItem(subcategory.id)} className="text-red-600 hover:text-red-900 text-xs"><Trash2 size={12}/></button>
                                        </div>
                                      </div>
                                      
                                      {/* Services Section */}
                                      {subcategory.services && subcategory.services.length > 0 && (
                                        <div className="mt-2 ml-4 space-y-1">
                                          {subcategory.services
                                            .sort((a, b) => a.order - b.order)
                                            .map((service) => (
                                              <div key={service.id} className="bg-gray-50 p-2 rounded border border-gray-100 flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                  <span className="text-xs text-gray-600">🔧</span>
                                                  <span className="text-xs font-medium">{service.name}</span>
                                                  {service.formId && (
                                                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                      Form Linked
                                                    </span>
                                                  )}
                                                </div>
                                                <div className="space-x-1">
                                                  <button onClick={() => handleEditItem(service, category.id)} className="text-indigo-600 hover:text-indigo-900 text-xs"><Edit size={10}/></button>
                                                  <button onClick={() => handleDeleteItem(service.id)} className="text-red-600 hover:text-red-900 text-xs"><Trash2 size={10}/></button>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  </SortableItem>
                                ))}
                            </ul>
                          </SortableContext>
                          // --- END SUBCATEGORY SortableContext ---
                        )}
                      </div>
                    </SortableItem>
                ))}
              </ul>
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
