// frontend/src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, Phone, Mail, ChevronDown, ChevronUp, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ==================== NAVBAR CONFIGURATION ====================
const navbarConfig = {
  logo: {
    white: '/images/logo/white.webp',
    color: '/images/logo/color.webp',
    alt: 'Logo FMIPA'
  },
  
  topbar: {
    contacts: [
      {
        type: 'email',
        icon: 'mail',
        text: 'office@fmipa.unila.ac.id',
        link: 'mailto:office@fmipa.unila.ac.id'
      },
      {
        type: 'phone',
        icon: 'phone',
        text: '0721-704625',
        link: 'tel:+62721704625'
      },
    ]
  },
  
  menuItems: [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/about' },
    {
      name: 'Dokumen',
      children: [
        { name: 'Validasi Dokumen', path: '/validasi' },
      ]
    },
    { name: 'Bantuan', path: '/help' },
  ],
  
  authButton: {
    text: 'Masuk',
    link: '/login'
  }
};
// ==================== END CONFIGURATION ====================

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const updateDate = () => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(new Date().toLocaleDateString('id-ID', options));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('nav')) {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if parent menu item has active child
  const hasActiveChild = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  // Icon mapping
  const iconMap = {
    mail: Mail,
    phone: Phone,
    calendar: Calendar
  };

  // Render icon based on type
  const renderIcon = (iconType) => {
    const IconComponent = iconMap[iconType];
    return IconComponent ? <IconComponent className="h-4 w-4 mr-2" /> : null;
  };

  // Render dropdown arrow
  const DropdownArrow = () => (
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  // Toggle dropdown in mobile
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  return (
    <>
      {/* Topbar - Desktop Only */}
      <div className="bg-blue-600 text-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={navbarConfig.logo.white} 
                alt={navbarConfig.logo.alt} 
                className="h-12" 
              />
            </div>
            <div className="flex items-center space-x-6 text-sm">
              {navbarConfig.topbar.contacts.map((contact, index) => (
                <div key={index} className="flex items-center">
                  {renderIcon(contact.icon)}
                  {contact.showDate ? (
                    <span>{currentDate}</span>
                  ) : contact.link ? (
                    <a href={contact.link}>{contact.text}</a>
                  ) : (
                    <span>{contact.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Mobile */}
            <div className="flex items-center lg:hidden">
              <img 
                src={navbarConfig.logo.color} 
                alt={navbarConfig.logo.alt} 
                className="h-10" 
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {navbarConfig.menuItems.map((item, index) => (
                item.children ? (
                  <div key={index} className="relative group">
                    <button 
                      className={`px-3 py-2 rounded-md font-medium transition flex items-center ${
                        hasActiveChild(item.children)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {item.name}
                      <DropdownArrow />
                    </button>
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          to={child.path} 
                          className={`block px-4 py-2 first:rounded-t-md last:rounded-b-md ${
                            isActive(child.path)
                              ? 'bg-blue-50 text-blue-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={item.path} 
                    className={`px-3 py-2 rounded-md font-medium transition ${
                      isActive(item.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:block">
              {isAuthenticated() ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  >
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <span>{user?.name?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <span className="font-medium">{user?.name || 'User'}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Profil Saya
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Pengaturan
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={navbarConfig.authButton.link}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  {navbarConfig.authButton.text}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - IMPROVED VERSION */}
        <div 
          className={`
            lg:hidden
            fixed top-16 left-0 right-0 bottom-0
            bg-white
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            overflow-y-auto
            z-50
          `}
        >
          <div className="px-6 py-6 space-y-1">
            {/* Mobile User Profile (if authenticated) */}
            {isAuthenticated() && (
              <div className="pb-6 mb-6 border-b-2 border-gray-100">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <span>{user?.name?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-lg truncate">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-600 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                
                {/* Quick Links for Authenticated Users */}
                <div className="mt-4 space-y-1">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={closeMobileMenu}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={closeMobileMenu}
                  >
                    <User className="h-5 w-5" />
                    Profil Saya
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={closeMobileMenu}
                  >
                    <Settings className="h-5 w-5" />
                    Pengaturan
                  </Link>
                </div>
              </div>
            )}

            {/* Menu Items */}
            {navbarConfig.menuItems.map((item, index) => (
              item.children ? (
                <div key={index} className="pb-2">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`w-full flex items-center justify-between px-4 py-3 font-semibold rounded-lg transition-colors ${
                      hasActiveChild(item.children)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">{item.name}</span>
                    {openDropdown === index ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  
                  {/* Dropdown Items */}
                  <div 
                    className={`
                      overflow-hidden transition-all duration-300
                      ${openDropdown === index ? 'max-h-96 mt-1' : 'max-h-0'}
                    `}
                  >
                    <div className="pl-4 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          to={child.path}
                          className={`block px-4 py-3 rounded-lg transition-colors text-base ${
                            isActive(child.path)
                              ? 'text-blue-600 bg-blue-50 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                          onClick={closeMobileMenu}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className={`block px-4 py-3 font-semibold rounded-lg transition-colors text-base ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {/* Mobile Auth Button */}
            <div className="pt-6">
              {isAuthenticated() ? (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="flex items-center justify-center gap-3 w-full bg-red-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30 text-base"
                >
                  <LogOut className="h-5 w-5" />
                  Keluar
                </button>
              ) : (
                <Link
                  to={navbarConfig.authButton.link}
                  className="block w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors text-center shadow-lg shadow-blue-600/30 text-base"
                  onClick={closeMobileMenu}
                >
                  {navbarConfig.authButton.text}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;