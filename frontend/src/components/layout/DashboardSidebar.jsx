// frontend/src/components/layout/DashboardSidebar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Users, 
  Settings, 
  HelpCircle,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  FolderOpen,
  UserCheck,
  BarChart,
  Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// Icon mapping for dynamic menu items
const iconMap = {
  'LayoutDashboard': LayoutDashboard,
  'FileText': FileText,
  'CheckCircle': CheckCircle,
  'Users': Users,
  'Settings': Settings,
  'HelpCircle': HelpCircle,
  'FolderOpen': FolderOpen,
  'UserCheck': UserCheck,
  'BarChart': BarChart,
  'Shield': Shield,
};

// Sample API response - Replace with actual API call
const sampleMenuData = {
  admin: [
    {
      id: 1,
      name: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/dashboard',
      order: 1,
      roles: ['admin', 'user']
    },
    {
      id: 2,
      name: 'Dokumen',
      icon: 'FileText',
      order: 2,
      roles: ['admin', 'user'],
      submenu: [
        { id: 21, name: 'Semua Dokumen', path: '/dashboard/documents', order: 1 },
        { id: 22, name: 'Upload Dokumen', path: '/dashboard/documents/upload', order: 2 },
        { id: 23, name: 'Validasi Dokumen', path: '/dashboard/documents/validation', order: 3 },
      ]
    },
    {
      id: 3,
      name: 'Validasi',
      icon: 'CheckCircle',
      path: '/dashboard/validation',
      order: 3,
      roles: ['admin', 'validator']
    },
    {
      id: 4,
      name: 'Users',
      icon: 'Users',
      path: '/dashboard/users',
      order: 4,
      roles: ['admin']
    },
    {
      id: 5,
      name: 'Reports',
      icon: 'BarChart',
      path: '/dashboard/reports',
      order: 5,
      roles: ['admin']
    },
    {
      id: 6,
      name: 'Pengaturan',
      icon: 'Settings',
      path: '/dashboard/settings',
      order: 6,
      roles: ['admin', 'user']
    },
    {
      id: 7,
      name: 'Bantuan',
      icon: 'HelpCircle',
      path: '/dashboard/help',
      order: 7,
      roles: ['admin', 'user']
    },
  ],
  user: [
    {
      id: 1,
      name: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/dashboard',
      order: 1,
      roles: ['admin', 'user']
    },
    {
      id: 2,
      name: 'Dokumen',
      icon: 'FileText',
      order: 2,
      roles: ['admin', 'user'],
      submenu: [
        { id: 21, name: 'Semua Dokumen', path: '/dashboard/documents', order: 1 },
        { id: 22, name: 'Upload Dokumen', path: '/dashboard/documents/upload', order: 2 },
      ]
    },
    {
      id: 6,
      name: 'Pengaturan',
      icon: 'Settings',
      path: '/dashboard/settings',
      order: 6,
      roles: ['admin', 'user']
    },
    {
      id: 7,
      name: 'Bantuan',
      icon: 'HelpCircle',
      path: '/dashboard/help',
      order: 7,
      roles: ['admin', 'user']
    },
  ]
};

const DashboardSidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu items based on user role
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/v1/menu', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get menu based on user role
        const userRole = user?.role?.toLowerCase() || 'user';
        const roleMenus = sampleMenuData[userRole] || sampleMenuData.user;
        
        // Filter menu items based on user's role
        const filteredMenus = roleMenus
          .filter(item => item.roles?.includes(userRole))
          .sort((a, b) => a.order - b.order);
        
        setMenuItems(filteredMenus);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        // Fallback to basic menu
        setMenuItems(sampleMenuData.user);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMenuItems();
    }
  }, [user]);

  // Check if current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if submenu has active item
  const hasActiveSubmenu = (submenu) => {
    return submenu?.some(item => location.pathname === item.path);
  };

  // Toggle submenu
  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  // Get icon component from string name
  const getIcon = (iconName) => {
    return iconMap[iconName] || FileText;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo/color.webp" 
              alt="Logo" 
              className="h-10"
            />
            <span className="font-bold text-lg text-gray-900">FMIPA</span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {loading ? (
            // Loading skeleton
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            // Dynamic menu items
            menuItems.map((item, index) => {
              const IconComponent = getIcon(item.icon);
              
              return (
                <div key={item.id}>
                  {item.submenu ? (
                    // Menu with submenu
                    <div>
                      <button
                        onClick={() => toggleSubmenu(index)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-lg transition
                          ${hasActiveSubmenu(item.submenu)
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 flex-shrink-0" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {openSubmenu === index ? (
                          <ChevronDown className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 flex-shrink-0" />
                        )}
                      </button>
                      
                      {/* Submenu */}
                      <div
                        className={`
                          overflow-hidden transition-all duration-300
                          ${openSubmenu === index ? 'max-h-96 mt-1' : 'max-h-0'}
                        `}
                      >
                        <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-1">
                          {item.submenu
                            .sort((a, b) => a.order - b.order)
                            .map((subitem) => (
                              <Link
                                key={subitem.id}
                                to={subitem.path}
                                onClick={closeSidebar}
                                className={`
                                  block px-4 py-2 rounded-lg transition text-sm
                                  ${isActive(subitem.path)
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                  }
                                `}
                              >
                                {subitem.name}
                              </Link>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular menu item
                    <Link
                      to={item.path}
                      onClick={closeSidebar}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition
                        ${isActive(item.path)
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;