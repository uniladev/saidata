// frontend/src/components/layout/DashboardSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Upload, 
  Users, 
  Settings, 
  HelpCircle,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const DashboardSidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Menu items configuration
  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: 'Dokumen',
      icon: FileText,
      submenu: [
        { name: 'Semua Dokumen', path: '/dashboard/documents' },
        { name: 'Upload Dokumen', path: '/dashboard/documents/upload' },
        { name: 'Validasi Dokumen', path: '/dashboard/documents/validation' },
      ]
    },
    {
      name: 'Validasi',
      icon: CheckCircle,
      path: '/dashboard/validation',
    },
    {
      name: 'Users',
      icon: Users,
      path: '/dashboard/users',
      adminOnly: true // Example of role-based menu
    },
    {
      name: 'Pengaturan',
      icon: Settings,
      path: '/dashboard/settings',
    },
    {
      name: 'Bantuan',
      icon: HelpCircle,
      path: '/dashboard/help',
    },
  ];

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
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
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

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
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
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {openSubmenu === index ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
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
                      {item.submenu.map((subitem, subindex) => (
                        <Link
                          key={subindex}
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
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section - Optional */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Butuh Bantuan?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Hubungi tim support kami
            </p>
            <Link
              to="/dashboard/support"
              className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Hubungi Support
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;