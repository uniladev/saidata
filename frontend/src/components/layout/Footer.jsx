import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const [time, setTime] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0')
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Kantor Kami</h3>
            <div className="space-y-3">
              <a 
                href="https://maps.app.goo.gl/nWad2JqnJCPt8sDu6" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start text-gray-400 hover:text-white transition"
              >
                <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                <span>Jalan Prof. Dr. Sumantri Brojonegoro No. 1 Bandar Lampung, Lampung 35144</span>
              </a>
              <a 
                href="tel:+62721704625"
                className="flex items-center text-gray-400 hover:text-white transition"
              >
                <Phone className="h-5 w-5 mr-2" />
                <span>0721-704625</span>
              </a>
              <a 
                href="mailto:office@fmipa.unila.ac.id"
                className="flex items-center text-gray-400 hover:text-white transition"
              >
                <Mail className="h-5 w-5 mr-2" />
                <span>office@fmipa.unila.ac.id</span>
              </a>
            </div>
            <div className="flex space-x-3 mt-6">
              <a 
                href="https://www.facebook.com/jurkimiafmipaunila/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.youtube.com/channel/UCyVqvR1r0J7V6Mq_5soQp8w" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/kimia-fmipa-universitas-lampung-a-3431a2181/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div></div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{time.hours}</div>
                <div className="text-xs text-gray-400">Jam</div>
              </div>
              <div className="text-4xl font-bold">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold">{time.minutes}</div>
                <div className="text-xs text-gray-400">Menit</div>
              </div>
              <div className="text-4xl font-bold">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold">{time.seconds}</div>
                <div className="text-xs text-gray-400">Detik</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} <a href="https://fmipa.unila.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Fakultas Matematika dan Ilmu Pengetahuan Alam</a>
            </p>
            <p className="mt-2 md:mt-0">
              Dirancang Oleh <span className="text-white">Bayanaka Team</span> & <span className="text-white">Kosan Ayah Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;