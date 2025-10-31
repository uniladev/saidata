// src/pages/authenticated/Admin/MenuManagementPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { Edit, Trash2, GripVertical, Plus, FileText, X, FolderTree, Layers, ArrowDownUp, Save, XCircle } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core'; 
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import api from '../../../../config/api';
import { useAuth } from '../../../../context/AuthContext';
import AddServiceChoiceModal from '../../../../components/common/AddServiceChoiceModal';

// Draggable wrapper
const SortableItem = ({ id, children, isReorderMode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: !isReorderMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center gap-2">
        {isReorderMode && (
          <button 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing text-blue-500 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded transition-colors flex-shrink-0"
            type="button"
          >
            <GripVertical size={18} />
          </button>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

// Add/Edit modal
const MenuItemFormModal = ({ item, itemType, parentId, categoryId, isAddingExistingForm, onClose, onSave }) => {
  const isEditing = !!item;
  const type = isEditing ? item.type : itemType;

  const [formData, setFormData] = useState({
    name: item?.name || '',
    path: item?.path || '',
    icon: item?.icon || (type === 'subcategory' ? 'Folder' : ''),
    order: item?.order || 1,
    roles: (item?.roles && Array.isArray(item.roles) ? item.roles.join(', ') : (item?.roles || 'user')),
    formId: item?.formId || '',
    outputConfig: item?.outputConfig || '',
  });

  const [formsList, setFormsList] = useState([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  // Fetch forms list for service
  useEffect(() => {
    if (type === 'service') {
      const fetchForms = async () => {
        setIsLoadingForms(true);
        try {
          const res = await api.get('/forms');
          setFormsList(res.data?.data || []);
        } catch (e) {
          console.error('Error fetching forms:', e);
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

  const handleFormSelect = (form) => {
    setSelectedForm(form);
    setFormData(prev => ({
      ...prev,
      name: form.title,
      formId: form.id,
      path: `/dashboard/forms/${form.id}`,
      outputConfig: `Generate document from ${form.title}`,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rolesArray = String(formData.roles)
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const payload = {
      ...(isEditing ? { id: item.id } : {}),
      type,
      parentId,
      categoryId,
      name: formData.name,
      order: parseInt(formData.order, 10) || 1,
      roles: rolesArray,
      ...(type === 'subcategory' && { icon: formData.icon }),
      ...(type === 'service' && { 
        path: formData.path,
        formId: formData.formId,
        outputConfig: formData.outputConfig,
      }),
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 capitalize">
              {isEditing ? `Edit ${type}` : isAddingExistingForm ? 'Add Existing Form' : `Add New ${type}`}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {type === 'subcategory' ? 'Add a subcategory to organize services' : 'Configure service settings'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" type="button">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
              {isAddingExistingForm && type === 'service' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select an Existing Form</label>
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                      {isLoadingForms ? (
                        <div className="p-8 text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="text-gray-500 mt-2">Loading forms...</p>
                        </div>
                      ) : formsList.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                          <p>No forms available</p>
                        </div>
                      ) : (
                        <div className="p-3 space-y-2">
                          {formsList.map(form => (
                            <button
                              key={form.id}
                              type="button"
                              onClick={() => handleFormSelect(form)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                selectedForm?.id === form.id 
                                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="font-medium text-gray-900">{form.title}</div>
                              <div className="text-xs text-gray-500 mt-1">ID: {form.id}</div>
                              {form.description && <div className="text-sm text-gray-600 mt-2">{form.description}</div>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedForm && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" />
                        Selected Form Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="font-medium text-gray-700 w-32">Name:</span>
                          <span className="text-gray-900">{formData.name}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-gray-700 w-32">Path:</span>
                          <span className="text-gray-900 font-mono text-xs">{formData.path}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-gray-700 w-32">Output Config:</span>
                          <span className="text-gray-900">{formData.outputConfig}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                      placeholder="Enter name"
                      required
                    />
                  </div>

                  {/* Path hanya untuk service */}
                  {type === 'service' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Path <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="path"
                        value={formData.path}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        required
                        placeholder="/dashboard/example-path"
                      />
                    </div>
                  )}

                  {type === 'subcategory' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon Name</label>
                      <input
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Folder, FileText, Settings"
                      />
                      <p className="text-xs text-gray-500 mt-1">Icon from lucide-react library</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                      <input
                        type="text"
                        name="roles"
                        value={formData.roles}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="admin, user"
                      />
                    </div>
                  </div>

                  {type === 'service' && (
                    <>
                      <div className="border-t border-gray-200 pt-5 mt-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Service Configuration</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Link to Form <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="formId"
                              value={formData.formId}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                            <p className="text-xs text-gray-500 mt-1.5">Choose a form from the Form Builder</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Output Configuration
                            </label>
                            <textarea
                              name="outputConfig"
                              value={formData.outputConfig}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={3}
                              placeholder="Describe how the output document should be generated..."
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAddingExistingForm && !selectedForm}
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
  const [originalMenuStructure, setOriginalMenuStructure] = useState([]);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [showAddServiceChoice, setShowAddServiceChoice] = useState(false);
  const [addServiceContext, setAddServiceContext] = useState({ categoryId: null, parentId: null });

  // Normalize API tree to { id, name, order, submenu[] } and node type
  const normalizeTree = (apiCategories = []) => {
    const mapNode = (n) => ({
      id: n._id || n.id,
      name: n.name || n.title,
      type: n.type || (n.formId || n.path ? 'service' : 'subcategory'),
      path: n.path || '',
      formId: n.formId || null,
      order: typeof n.order === 'number' ? n.order : (typeof n.sort === 'number' ? n.sort : 0),
      roles: n.roles || n.allowedRoles || [],
      icon: n.icon,
      submenu: (n.submenu || n.children || n.items || []).map(mapNode),
    });

    return (apiCategories || []).map((cat) => ({
      id: cat._id || cat.id,
      name: cat.name || cat.title,
      order: typeof cat.order === 'number' ? cat.order : (typeof cat.sort === 'number' ? cat.sort : 0),
      submenu: (cat.submenu || cat.children || cat.items || []).map(mapNode),
    }));
  };

  // Fetch menu structure from backend
  useEffect(() => {
    fetchMenuStructure();
  }, []);

  const fetchMenuStructure = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/management/menu'); // GET tree
      const apiData = response.data?.data || [];
      const normalized = normalizeTree(apiData);
      setMenuStructure(normalized);
      setOriginalMenuStructure(JSON.parse(JSON.stringify(normalized)));
    } catch (err) {
      console.error('Error fetching menu structure:', err);
      setError(err.response?.data?.message || 'Failed to load menu structure');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter categories by admin name with fallback to show all
  const filteredMenuStructure = useMemo(() => {
    if (!Array.isArray(menuStructure)) return [];
    if (!user?.name) return menuStructure; // fallback show all
    const adminName = user.name;

    if (adminName === 'Administrator') return menuStructure;
    if (adminName === 'Administrator Univ') {
      return menuStructure.filter(cat => cat.name !== 'Layanan Fakultas' && cat.name !== 'Layanan Jurusan');
    }
    if (adminName === 'Administrator Fakultas') {
      return menuStructure.filter(cat => cat.name !== 'Layanan Universitas' && cat.name !== 'Layanan Jurusan');
    }
    if (adminName === 'Administrator Jurusan') {
      return menuStructure.filter(cat => cat.name !== 'Layanan Universitas' && cat.name !== 'Layanan Fakultas');
    }
    return menuStructure; // fallback
  }, [menuStructure, user]);

  const handleToggleReorderMode = () => {
    if (isReorderMode) {
      setMenuStructure(JSON.parse(JSON.stringify(originalMenuStructure)));
    }
    setIsReorderMode(!isReorderMode);
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      // Flatten orders per level (simple rank list)
      const payload = [];
      const walk = (nodes) => {
        nodes.forEach((n, idx) => {
          payload.push({ id: n.id, order: idx + 1 });
          if (n.submenu?.length) walk(n.submenu);
        });
      };
      walk(menuStructure);

      await api.post('/management/menu/reorder', { menus: payload });
      setOriginalMenuStructure(JSON.parse(JSON.stringify(menuStructure)));
      setIsReorderMode(false);
      alert('Order saved successfully!');
    } catch (err) {
      console.error('Error saving order:', err);
      alert(err.response?.data?.message || 'Failed to save order');
      setMenuStructure(JSON.parse(JSON.stringify(originalMenuStructure)));
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleAddSubcategory = (categoryId, parentId = null) => {
    setCurrentItem({
      type: 'subcategory',
      parentId: parentId || categoryId,
      categoryId,
    });
    setIsModalOpen(true);
  };

  const handleAddService = (categoryId, parentId) => {
    setAddServiceContext({ categoryId, parentId });
    setShowAddServiceChoice(true);
  };

  const handleCreateForm = () => {
    navigate('/forms/create');
  };

  const handleCreateFormFromModal = () => {
    setShowAddServiceChoice(false);
    navigate('/forms/create');
  };

  const handleAddExistingFormFromModal = () => {
    setShowAddServiceChoice(false);
    setCurrentItem({
      type: 'service',
      parentId: addServiceContext.parentId,
      categoryId: addServiceContext.categoryId,
      isAddingExistingForm: true,
    });
    setIsModalOpen(true);
  };

  const handleAddForm = (categoryId, parentId) => {
    setCurrentItem({
      type: 'service',
      parentId,
      categoryId,
      isAddingExistingForm: true,
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
        await api.put(`/management/menu/${savedItemData.id}`, savedItemData);
      } else {
        await api.post('/management/menu', savedItemData);
      }
      await fetchMenuStructure();
      setIsModalOpen(false);
      setCurrentItem(null);
    } catch (err) {
      console.error('Error saving menu item:', err);
      alert(err.response?.data?.message || 'Failed to save menu item');
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
      await api.delete(`/management/menu/${itemId}`);
      await fetchMenuStructure();
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert(err.response?.data?.message || 'Failed to delete menu item');
    } finally {
      setIsLoading(false);
    }
  };

  // Drag end (only reorder within same level)
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    const reorder = (arr, aId, oId) => {
      const aIdx = arr.findIndex(x => x.id === aId);
      const oIdx = arr.findIndex(x => x.id === oId);
      if (aIdx !== -1 && oIdx !== -1) return arrayMove(arr, aIdx, oIdx);
      return arr;
    };

    // Try reorder at category level
    const catIdxA = menuStructure.findIndex(c => c.id === activeId);
    const catIdxO = menuStructure.findIndex(c => c.id === overId);
    if (catIdxA !== -1 && catIdxO !== -1) {
      setMenuStructure(arrayMove(menuStructure, catIdxA, catIdxO));
      return;
    }

    // Reorder inside nested submenu (L1-L3)
    const deepReorder = (nodes) => nodes.map(n => {
      if (n.submenu?.length) {
        const ids = n.submenu.map(x => x.id);
        if (ids.includes(activeId) && ids.includes(overId)) {
          return { ...n, submenu: reorder(n.submenu, activeId, overId) };
        }
        return { ...n, submenu: deepReorder(n.submenu) };
      }
      return n;
    });

    setMenuStructure(deepReorder(menuStructure));
  };

  // Recursive renderer for subcategory
  const renderSubcategory = (subcategory, categoryId, level = 1) => {
    const maxLevel = 3;
    const canAddSubcategory = level < maxLevel;
    const canAddService = true;

    const levelColors = {
      1: { bg: 'bg-blue-50/50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
      2: { bg: 'bg-green-50/50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
      3: { bg: 'bg-purple-50/50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' }
    };
    const colors = levelColors[level];

    return (
      <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Layers size={18} className="text-gray-600" />
            <span className="font-medium text-gray-900">{subcategory.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.badge}`}>Level {level}</span>
            {subcategory.submenu && subcategory.submenu.length > 0 && (
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                {subcategory.submenu.length} items
              </span>
            )}
          </div>
          {!isReorderMode && (
            <div className="flex items-center gap-1">
              {canAddSubcategory && (
                <button
                  onClick={() => handleAddSubcategory(categoryId, subcategory.id)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                >
                  + Sub
                </button>
              )}
              {canAddService && (
                <button
                  onClick={() => handleAddService(categoryId, subcategory.id)}
                  className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                >
                  + Service
                </button>
              )}
              <button
                onClick={() => handleEditItem(subcategory, categoryId)}
                className="p-1.5 text-gray-600 hover:bg-white/80 hover:text-indigo-600 rounded transition-colors"
              >
                <Edit size={14}/>
              </button>
              <button
                onClick={() => handleDeleteItem(subcategory.id)}
                className="p-1.5 text-gray-600 hover:bg-white/80 hover:text-red-600 rounded transition-colors"
              >
                <Trash2 size={14}/>
              </button>
            </div>
          )}
        </div>

        {subcategory.submenu && subcategory.submenu.length > 0 && (
          <div className="ml-6 space-y-3 mt-3 pl-4 border-l-2 border-gray-200">
            <SortableContext items={subcategory.submenu.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {subcategory.submenu
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((child) => {
                  if (child.type === 'service') {
                    return (
                      <SortableItem key={child.id} id={child.id} isReorderMode={isReorderMode}>
                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText size={16} className="text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">{child.name}</span>
                              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                                Service
                              </span>
                              {child.formId && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-mono">#{child.formId}</span>
                              )}
                            </div>
                            {!isReorderMode && (
                              <div className="flex items-center gap-1">
                                <button onClick={handleCreateForm} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Create New Form">
                                  <FileText size={14}/>
                                </button>
                                <button onClick={() => handleAddForm(categoryId, subcategory.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Add Existing Form">
                                  <Plus size={14}/>
                                </button>
                                <button onClick={() => handleEditItem(child, categoryId)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit Service">
                                  <Edit size={14}/>
                                </button>
                                <button onClick={() => handleDeleteItem(child.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Service">
                                  <Trash2 size={14}/>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </SortableItem>
                    );
                  }
                  return (
                    <SortableItem key={child.id} id={child.id} isReorderMode={isReorderMode}>
                      {renderSubcategory(child, categoryId, level + 1)}
                    </SortableItem>
                  );
                })}
            </SortableContext>
          </div>
        )}
      </div>
    );
  };

  if (isLoading && menuStructure.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading menu structure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button 
              onClick={fetchMenuStructure}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FolderTree className="text-blue-600" size={28} />
                Menu Management
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Hierarchy: <span className="font-medium">Category (Fixed)</span> → <span className="font-medium">Sub Category (L1-L3)</span> → <span className="font-medium">Service</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isReorderMode ? (
                <>
                  <button 
                    onClick={handleToggleReorderMode}
                    className="px-5 py-2.5 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 shadow-sm transition-all flex items-center gap-2 justify-center"
                    disabled={isSavingOrder}
                  >
                    <XCircle size={18} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveOrder}
                    className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-sm transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSavingOrder}
                  >
                    {isSavingOrder ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Order
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleToggleReorderMode}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2 justify-center"
                >
                  <ArrowDownUp size={18} />
                  Reorder
                </button>
              )}
            </div>
          </div>
        </div>

        {isReorderMode && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ArrowDownUp className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-blue-900">Reorder Mode Active</p>
                <p className="text-sm text-blue-700 mt-1">
                  Drag and drop items to reorder them. Click "Save Order" when done or "Cancel" to discard changes.
                </p>
              </div>
            </div>
          </div>
        )}

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            {!Array.isArray(menuStructure) || filteredMenuStructure.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FolderTree className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No menu structure available</p>
                <p className="text-sm text-gray-400 mt-1">Categories are fixed, you can add subcategories</p>
              </div>
            ) : (
              <SortableContext
                items={filteredMenuStructure.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {filteredMenuStructure
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((category) => (
                      <SortableItem key={category.id} id={category.id} isReorderMode={isReorderMode}>
                        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                  <FolderTree size={24} className="text-gray-700" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Main Category (Fixed) • {category.submenu?.length || 0} items
                                  </p>
                                </div>
                              </div>
                              {!isReorderMode && (
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => handleAddSubcategory(category.id)} 
                                    className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                  >
                                    + Add Sub Category
                                  </button>
                                  <button 
                                    onClick={() => handleAddService(category.id, category.id)} 
                                    className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                  >
                                    + Add Service
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {category.submenu && category.submenu.length > 0 && (
                            <div className="p-5 space-y-3 bg-gray-50/50">
                              <SortableContext
                                items={category.submenu.map(item => item.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                {category.submenu
                                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                                  .map((item) => {
                                    if (item.type === 'service') {
                                      return (
                                        <SortableItem key={item.id} id={item.id} isReorderMode={isReorderMode}>
                                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-3">
                                                <FileText size={16} className="text-gray-500" />
                                                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                                                  Service (L1)
                                                </span>
                                                {item.formId && (
                                                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-mono">
                                                    #{item.formId}
                                                  </span>
                                                )}
                                              </div>
                                              {!isReorderMode && (
                                                <div className="flex items-center gap-1">
                                                  <button 
                                                    onClick={handleCreateForm}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                    title="Create New Form"
                                                  >
                                                    <FileText size={14}/>
                                                  </button>
                                                  <button 
                                                    onClick={() => handleAddForm(category.id, category.id)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Add Existing Form"
                                                  >
                                                    <Plus size={14}/>
                                                  </button>
                                                  <button 
                                                    onClick={() => handleEditItem(item, category.id)} 
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                    title="Edit Service"
                                                  >
                                                    <Edit size={14}/>
                                                  </button>
                                                  <button 
                                                    onClick={() => handleDeleteItem(item.id)} 
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Service"
                                                  >
                                                    <Trash2 size={14}/>
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </SortableItem>
                                      );
                                    }
                                    return (
                                      <SortableItem key={item.id} id={item.id} isReorderMode={isReorderMode}>
                                        {renderSubcategory(item, category.id, 1)}
                                      </SortableItem>
                                    );
                                  })}
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
      </div>

      {showAddServiceChoice && (
        <AddServiceChoiceModal
          onClose={() => setShowAddServiceChoice(false)}
          onCreateForm={handleCreateFormFromModal}
          onAddExistingForm={handleAddExistingFormFromModal}
        />
      )}
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