// src/pages/authenticated/Admin/MenuManagementPage.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react'; // Add Edit, Trash2 icons
// import api from '../../config/api'; // We'll uncomment this later

// Mock data until the API is ready
const MOCK_MENU_DATA = [
  { id: 1, name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', order: 1, roles: ['user', 'admin'] },
  { id: 2, name: 'Create Form', path: '/create-form', icon: 'FilePlus2', order: 2, roles: ['admin'] },
  { id: 3, name: 'Forms', path: '/forms', icon: 'FileList', order: 3, roles: ['admin'] },
];

// Add this component before the MenuManagementPage component
const MenuItemFormModal = ({ item, onClose, onSave, existingItems }) => { // Added existingItems prop
  const [formData, setFormData] = useState({
    name: item?.name || '',
    path: item?.path || '',
    icon: item?.icon || '',
    order: item?.order || (existingItems.length > 0 ? Math.max(...existingItems.map(i => i.order)) + 1 : 1), // Default order is next highest + 1
    roles: item?.roles?.join(', ') || 'user', // Join roles for input
    submenu: item?.submenu || [], // Keep submenu structure (simple for now)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rolesArray = formData.roles.split(',').map(role => role.trim()).filter(role => role);
    // Ensure order is a number
    const orderNumber = parseInt(formData.order, 10) || 1; 
    onSave({ ...item, ...formData, roles: rolesArray, order: orderNumber }); // Pass back the updated item data
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-gray-900">
              {item ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Path</label>
              <input type="text" name="path" value={formData.path} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon Name</label>
              <input type="text" name="icon" value={formData.icon} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., LayoutDashboard" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required min="1"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Roles (comma-separated)</label>
              <input type="text" name="roles" value={formData.roles} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., admin, user" />
            </div>
            {/* TODO: Add input for submenu items if needed */}
          </div>
          <div className="p-4 bg-gray-50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Holds item being edited, or null for new item

  // TODO: Replace mock data with API call when ready
  useEffect(() => {
    setIsLoading(true);
    // Simulating API fetch
    setTimeout(() => {
      setMenuItems(MOCK_MENU_DATA);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, []);

  const handleAddItem = () => {
    setCurrentItem(null); // No current item means it's a new one
    setIsModalOpen(true);
  };

  const handleEditItem = (itemId) => {
    const itemToEdit = menuItems.find(item => item.id === itemId);
    if (itemToEdit) {
      setCurrentItem(itemToEdit);
      setIsModalOpen(true);
    }
  };

  // This function receives the data from the modal form
  const handleSaveItem = (savedItem) => {
    setIsLoading(true); // Simulate saving delay
    if (currentItem) {
      // --- UPDATE ---
      // TODO: Replace with PUT API Call when backend is ready
      setMenuItems(prevItems =>
        prevItems.map(item => (item.id === currentItem.id ? { ...item, ...savedItem } : item)) // Merge savedItem into existing item
      );
      console.log("Updated item:", savedItem);
    } else {
      // --- CREATE ---
      // TODO: Replace with POST API Call when backend is ready
      const newItem = { ...savedItem, id: Date.now() }; // Generate temporary ID for now
      setMenuItems(prevItems => [...prevItems, newItem]);
      console.log("Added new item:", newItem);
    }
    setIsModalOpen(false);
    setCurrentItem(null);
    setTimeout(() => setIsLoading(false), 300); // End simulation
  };


  const handleDeleteItem = (itemId) => {
    // Basic confirmation
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setIsLoading(true); // Simulate deleting delay
      // --- DELETE ---
      // TODO: Replace with DELETE API Call when backend is ready
      setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
      console.log("Deleted item ID:", itemId);
      setTimeout(() => setIsLoading(false), 300); // End simulation
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading menu items...</td>
                </tr>
              ) : error ? (
                 <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-red-500">{error}</td>
                </tr>
              ) : menuItems.length === 0 ? (
                 <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No menu items found.</td>
                </tr>
              ) : (
                menuItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.path}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.icon}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.roles?.join(', ') || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button onClick={() => handleEditItem(item.id)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900" title="Delete">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <MenuItemFormModal
          item={currentItem}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          existingItems={menuItems} // Pass existing items to help with default order
        />
      )}
    </div>
  );
};

export default MenuManagementPage;