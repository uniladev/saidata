import { useState, useEffect } from 'react';
import { Menu, X, Calendar, Phone, Mail } from 'lucide-react';

// ==================== NAVBAR CONFIGURATION ====================
const navbarConfig = {
  logo: {
    white: '/images/logo/white.png',
    color: '/images/logo/color.png',
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
      {
        type: 'date',
        icon: 'calendar',
        showDate: true
      }
    ]
  },
  
  menuItems: [
    { name: 'Beranda', path: '#home' },
    { name: 'Tentang', path: '#about' },
    {
      name: 'Seminar S1',
      children: [
        { name: 'Praktik Kerja Lapangan', path: '#pkl' },
        { name: 'Tugas Akhir 1', path: '#ta1' },
        { name: 'Tugas Akhir 2', path: '#ta2' },
        { name: 'Komprehensif', path: '#kompre' }
      ]
    },
    {
      name: 'Seminar S2',
      children: [
        { name: 'Tesis 1', path: '#tesis1' },
        { name: 'Tesis 2', path: '#tesis2' },
        { name: 'Sidang Tesis', path: '#sidang' }
      ]
    },
    { name: 'Bantuan', path: '#help' },
    { name: 'Validasi Dokumen', path: '#validasi' }
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

  useEffect(() => {
    const updateDate = () => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(new Date().toLocaleDateString('id-ID', options));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <>
      {/* Topbar */}
      <div className="bg-blue-600 text-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={navbarConfig.logo.white} 
                alt={navbarConfig.logo.alt} 
                className="h-14 -mt-5" 
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
                className="h-12 -mt-6" 
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1 -mt-5">
              {navbarConfig.menuItems.map((item, index) => (
                item.children ? (
                  <div key={index} className="relative group">
                    <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition flex items-center">
                      {item.name}
                      <DropdownArrow />
                    </button>
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      {item.children.map((child, childIndex) => (
                        <a 
                          key={childIndex}
                          href={child.path} 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          {child.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a 
                    key={index}
                    href={item.path} 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition"
                  >
                    {item.name}
                  </a>
                )
              ))}
            </div>

            <div className="hidden lg:block -mt-5">
              <a 
                href={navbarConfig.authButton.link}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition inline-block"
              >
                {navbarConfig.authButton.text}
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-gray-700 hover:text-blue-600"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navbarConfig.menuItems.map((item, index) => (
                item.children ? (
                  <div key={index}>
                    <div className="px-3 py-2 text-gray-500 font-semibold text-sm">
                      {item.name}
                    </div>
                    {item.children.map((child, childIndex) => (
                      <a 
                        key={childIndex}
                        href={child.path} 
                        className="block text-gray-700 hover:text-blue-600 pl-6 py-2 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <a 
                    key={index}
                    href={item.path} 
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              ))}
              <a
                href={navbarConfig.authButton.link}
                className="block w-full mt-2 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition text-center"
                onClick={() => setIsOpen(false)}
              >
                {navbarConfig.authButton.text}
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;