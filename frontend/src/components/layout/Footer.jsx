// frontend/src/components/layout/Footer.jsx
import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Youtube, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerLinks = {
    quickLinks: [
      { name: 'Beranda', path: '#home' },
      { name: 'Tentang', path: '#about' },
      { name: 'Bantuan', path: '#help' },
      { name: 'Validasi Dokumen', path: '#validasi' }
    ],
    services: [
      { name: 'Seminar S1', path: '#s1' },
      { name: 'Seminar S2', path: '#s2' },
      { name: 'PKL', path: '#pkl' },
      { name: 'Tugas Akhir', path: '#ta' }
    ]
  };

  const socialMedia = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/jurkimiafmipaunila/',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://www.youtube.com/channel/UCyVqvR1r0J7V6Mq_5soQp8w',
      hoverColor: 'hover:bg-red-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/kimia-fmipa-universitas-lampung-a-3431a2181/',
      hoverColor: 'hover:bg-blue-700'
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img 
                src="/images/logo/white.webp" 
                alt="Logo FMIPA" 
                className="h-16 mb-4"
              />
              <h3 className="text-xl font-bold mb-2">FMIPA Unila</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Fakultas Matematika dan Ilmu Pengetahuan Alam Universitas Lampung
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex gap-3">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center ${social.hoverColor} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-blue-500 group-hover:w-4 transition-all duration-200" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Layanan</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-blue-500 group-hover:w-4 transition-all duration-200" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Kontak</h4>
            <div className="space-y-4">
              <a
                href="https://maps.app.goo.gl/nWad2JqnJCPt8sDu6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start text-gray-400 hover:text-white transition-colors duration-200 group"
              >
                <MapPin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-blue-500" />
                <span className="text-sm">
                  Jl. Prof. Dr. Sumantri Brojonegoro No. 1, Bandar Lampung 35144
                </span>
              </a>

              <a
                href="tel:+62721704625"
                className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 group"
              >
                <Phone className="h-5 w-5 mr-3 text-blue-500" />
                <span className="text-sm">0721-704625</span>
              </a>

              <a
                href="mailto:office@fmipa.unila.ac.id"
                className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 group"
              >
                <Mail className="h-5 w-5 mr-3 text-blue-500" />
                <span className="text-sm">office@fmipa.unila.ac.id</span>
              </a>

              <a
                href="https://fmipa.unila.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 transition-colors duration-200 font-medium mt-2"
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              © {currentYear}{' '}
              <a
                href="https://fmipa.unila.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                Fakultas MIPA Unila
              </a>
              . All rights reserved.
            </p>
            
            <div className="flex items-center gap-2 text-gray-400">
              <span>Designed with</span>
              <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>by</span>
              <span className="text-white font-semibold">Bayanaka</span>
              <span>&</span>
              <span className="text-white font-semibold">Kosan Ayah</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
    </footer>
  );
};

export default Footer;