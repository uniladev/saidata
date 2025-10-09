
import {ArrowRight} from 'lucide-react';


// ==================== ABOUT ====================
const About = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="About FMIPA"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-blue-600 font-semibold mb-2">Tentang Kami</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Fakultas Matematika dan Ilmu Pengetahuan Alam
              </h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              Sistem kami dirancang untuk meningkatkan efektivitas dan mengoptimalkan pengolahan data di FMIPA. Platform ini memungkinkan tenaga pengajar dan mahasiswa untuk dengan mudah mengakses dan menganalisis data yang diperlukan.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Kami bertujuan untuk mewujudkan transformasi data yang lebih terstruktur dan terorganisir, memfasilitasi pengguna dalam mencari dan memanfaatkan informasi yang relevan secara efisien.
            </p>
            
            <a 
              href="https://fmipa.unila.ac.id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;