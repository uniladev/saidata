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
  BarChart,
  Building,
  GraduationCap,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/config/api';

// Icon mapping for dynamic menu items
const iconMap = {
  'LayoutDashboard': LayoutDashboard,
  'FileText': FileText,
  'CheckCircle': CheckCircle,
  'Users': Users,
  'Settings': Settings,
  'HelpCircle': HelpCircle,
  'BarChart': BarChart,
  'Building': Building,
  'GraduationCap': GraduationCap,
  'BookOpen': BookOpen,
  'ClipboardList': ClipboardList,
  'Building2': Building, // Alias untuk Building
};

// Sample Menu Data - Consolidated structure (role filtering happens elsewhere)
const sampleMenuData = [
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
    name: 'Development Test (jgn diganti)',
    icon: 'Building',
    order: 2,
    roles: ['admin', 'user'],
    submenu: [
      { 
        id: 21, 
        name: 'Create Form', 
        path: '/forms/create', 
        order: 1, 
        roles: ['admin'] 
      },
      { 
        id: 22, 
        name: 'Forms', 
        path: '/forms', 
        order: 2, 
        roles: ['admin'] 
      },
      { 
        id: 23, 
        name: 'Layanan Umum', 
        path: '/dashboard/university/general', 
        order: 3, 
        roles: ['admin'] 
      },
    ]
  },
  {
    id: 3,
    name: 'Layanan Fakultas',
    icon: 'GraduationCap',
    order: 3,
    roles: ['admin'],
    submenu: [
      { 
        id: 31, 
        name: 'Layanan Umum', 
        path: '/dashboard/faculty/general', 
        order: 1, 
        roles: ['admin'] 
      },
      { 
        id: 32, 
        name: 'Layanan Akademik', 
        path: '/dashboard/faculty/academic', 
        order: 2, 
        roles: ['admin'] 
      },
      { 
        id: 33, 
        name: 'Layanan Keuangan', 
        path: '/dashboard/faculty/finance', 
        order: 3, 
        roles: ['admin'] 
      },
    ]
  },
  {
    id: 4,
    name: 'Layanan Jurusan',
    icon: 'BookOpen',
    order: 4,
    roles: ['admin'],
    submenu: [
      { 
        id: 41, 
        name: 'Layanan Akademik', 
        path: '/dashboard/department/academic', 
        order: 1, 
        roles: ['admin'] 
      },
      { 
        id: 42, 
        name: 'Layanan Laboratorium', 
        path: '/dashboard/department/laboratory', 
        order: 2, 
        roles: ['admin'] 
      },
      { 
        id: 43, 
        name: 'Layanan IT & Server', 
        path: '/dashboard/department/it-services', 
        order: 3, 
        roles: ['admin'] 
      },
      { 
        id: 44, 
        name: 'Layanan Administrasi', 
        path: '/dashboard/department/administration', 
        order: 4, 
        roles: ['admin'] 
      },
      { 
        id: 45, 
        name: 'Layanan Penelitian', 
        path: '/dashboard/department/research', 
        order: 5, 
        roles: ['admin'] 
      }
    ]
  },
  {
    id: 5,
    name: 'Riwayat Permohonan',
    icon: 'ClipboardList',
    order: 5,
    roles: ['admin', 'user'],
    submenu: [
      { 
        id: 51, 
        name: 'Semua Permohonan', 
        path: '/dashboard/requests', 
        order: 1 
      },
      { 
        id: 52, 
        name: 'Permohonan Pending', 
        path: '/dashboard/requests/pending',
        order: 2 
      },
      { 
        id: 53, 
        name: 'Permohonan Disetujui', 
        path: '/dashboard/requests/approved', 
        order: 3 
      },
      { 
        id: 54, 
        name: 'Permohonan Ditolak', 
        path: '/dashboard/requests/rejected', 
        order: 4 
      },
    ]
  },{
    id: 6,
    name: 'Validasi Permohonan',
    icon: 'CheckCircle',
    path: '/dashboard/validation',
    order: 6,
    roles: ['admin', 'validator']
  },
  {
    id: 7,
    name: 'Users',
    icon: 'Users',
    path: '/dashboard/users',
    order: 7,
    roles: ['admin']
  },
  {
    id: 8,
    name: 'Reports',
    icon: 'BarChart',
    path: '/dashboard/reports',
    order: 8,
    roles: ['admin']
  },
  {
    id: 9,
    name: 'Pengaturan',
    icon: 'Settings',
    path: '/dashboard/settings',
    order: 9,
    roles: ['admin', 'user']
  },
  {
    id: 10,
    name: 'Bantuan',
    icon: 'HelpCircle',
    path: '/dashboard/help',
    order: 10,
    roles: ['admin', 'user', 'validator']
  },
];

const DashboardSidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        
        console.log('🔄 Fetching menu for user:', user?.username, user?.name);
        
        // Call API to get dynamic menu
        const response = await api.get('/menu');
        
        console.log('📡 API Response:', response.data);
        
        if (response.data.success) {
        const menuData = response.data.data.menu || [];

        // --- NEW: filter menu by user role (including nested submenu/services) ---
        const userRole = (user?.role || 'user').toLowerCase().trim();
        console.log('👤 User role (normalized):', userRole);

        const filteredMenus = (menuData || [])
          .filter(menu => !menu.roles || menu.roles.map(r=>r.toLowerCase()).includes(userRole))
          .map(menu => ({
            ...menu,
            submenu: (menu.submenu || [])
              .filter(sub => !sub.roles || sub.roles.map(r=>r.toLowerCase()).includes(userRole))
              .map(sub => ({
                ...sub,
                services: (sub.services || [])
                  .filter(srv => !srv.roles || srv.roles.map(r=>r.toLowerCase()).includes(userRole))
              }))
          }));

        setMenuItems(filteredMenus);
        // -----------------------------------------------------------------------
        
        // Log user info for debugging
        if (response.data.data.user_info) {
          console.log('👤 User Menu Info:', response.data.data.user_info);
        }
      } else {
        throw new Error('Failed to fetch menu');
      }
      } catch (error) {
        console.error('❌ Error fetching menu items:', error);
        console.log('⚠️ Using fallback menu');
        
        // Fallback: Filter menu based on user role
        const userRole = (user?.role || 'user').toLowerCase();

        const filteredMenus = sampleMenuData
          .filter(menu => !menu.roles || menu.roles.map(r=>r.toLowerCase()).includes(userRole))
          .map(menu => ({
            ...menu,
            submenu: (menu.submenu || [])
              .filter(sub => !sub.roles || sub.roles.map(r=>r.toLowerCase()).includes(userRole))
              .map(sub => ({
                ...sub,
                services: (sub.services || [])
                  .filter(srv => !srv.roles || srv.roles.map(r=>r.toLowerCase()).includes(userRole))
              }))
          }))
          .sort((a,b) => (a.order||0) - (b.order||0));
        console.log('📋 Fallback menu items:', filteredMenus.length, 'items for role:', userRole);

        setMenuItems(filteredMenus);

      } finally {
        setLoading(false);
      }
    };

    if (user) {
      // Reset menu items before fetching
      setMenuItems([]);
      fetchMenuItems();
    } else {
      // Clear menu if no user
      setMenuItems([]);
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
        <nav className="flex-1 overflow-y-auto p-4 space-y-1" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F1F5F9'
        }}>
          {loading ? (
            // Loading skeleton
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : menuItems.length === 0 ? (
            // No menu items
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Tidak ada menu tersedia</p>
            </div>
          ) : (
            // Dynamic menu items
            menuItems.map((item, index) => {
              const IconComponent = getIcon(item.icon);
              
              return (
                <div key={item.id}>
                  {Array.isArray(item.submenu) && item.submenu.length > 0 ? (
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
                          ${openSubmenu === index ? 'max-h-[800px] mt-1' : 'max-h-0'}
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
                                  flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm
                                  ${isActive(subitem.path)
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                  }
                                `}
                              >
                                <span>{subitem.name}</span>
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
                        flex items-center gap-3 px-4 py-3 rounded-lg transition justify-start
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