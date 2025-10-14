// frontend/src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

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
      // {
      //   type: 'date',
      //   icon: 'calendar',
      //   showDate: true
      // }
    ]
  },
  
  menuItems: [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/about' },
    { name: 'Buat Formulir', path: '/create-form' },
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
  const location = useLocation();

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

  return (
    <>
      {/* Topbar */}
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
            <div className="flex items-center lg:hidden">
              <img 
                src={navbarConfig.logo.color} 
                alt={navbarConfig.logo.alt} 
                className="h-12" 
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

            <div className="hidden lg:block">
              <Link
                to={navbarConfig.authButton.link}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition inline-block"
              >
                {navbarConfig.authButton.text}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-gray-700 hover:text-blue-600 transition p-2"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu - Absolute Position */}
        <div 
          className={`
            fixed top-16 left-0 right-0 bg-white shadow-lg z-50 lg:hidden
            transform transition-transform duration-300 ease-in-out
            max-h-[calc(100vh-4rem)] overflow-y-auto
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="px-4 py-4 space-y-2">
            {navbarConfig.menuItems.map((item, index) => (
              item.children ? (
                <div key={index} className="border-b border-gray-100 pb-2">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`w-full flex items-center justify-between px-3 py-2 font-medium rounded-md transition ${
                      hasActiveChild(item.children)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.name}</span>
                    {openDropdown === index ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {/* Dropdown Content */}
                  <div 
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${openDropdown === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="pl-6 py-2 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          to={child.path} 
                          className={`block px-3 py-2 rounded-md transition ${
                            isActive(child.path)
                              ? 'text-blue-600 bg-blue-50 font-semibold'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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
                  className={`block px-3 py-2 font-medium rounded-md transition ${
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
            
            {/* Mobile Login Button */}
            <div className="pt-4">
              <Link
                to={navbarConfig.authButton.link}
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition text-center shadow-md"
                onClick={closeMobileMenu}
              >
                {navbarConfig.authButton.text}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;