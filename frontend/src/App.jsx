import { useState } from 'react';
import { Menu, X, Calendar, Users, TrendingUp, Database } from 'lucide-react';

// Layout Components
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">SAIDATA</h1>
              <p className="text-xs text-gray-500">FMIPA UNILA</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#home" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition">
                Beranda
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition">
                Tentang
              </a>
              <a href="#news" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition">
                Berita
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition">
                Kontak
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
              Beranda
            </a>
            <a href="#about" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
              Tentang
            </a>
            <a href="#news" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
              Berita
            </a>
            <a href="#contact" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
              Kontak
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SAIDATA FMIPA</h3>
            <p className="text-gray-400">
              Sistem Informasi Data Fakultas Matematika dan Ilmu Pengetahuan Alam
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <p className="text-gray-400">Universitas Lampung</p>
            <p className="text-gray-400">Bandar Lampung, Indonesia</p>
            <p className="text-gray-400">Email: fmipa@unila.ac.id</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Link Cepat</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Website FMIPA</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Universitas Lampung</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Portal Akademik</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 SAIDATA FMIPA UNILA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Feature Components
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="text-blue-600" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const NewsCard = ({ date, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
        <Calendar className="text-white" size={48} />
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2">{date}</p>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <button className="mt-4 text-blue-600 font-medium hover:text-blue-700 transition">
          Baca Selengkapnya →
        </button>
      </div>
    </div>
  );
};

// Section Components
const HeroSection = () => {
  return (
    <section id="home" className="pt-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Efektifitas dan Optimasi<br />
            <span className="text-blue-600">Pengolahan Data</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Memudahkan Dalam Pengambilan Keputusan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Mulai Sekarang
            </button>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <FeatureCard
            icon={Database}
            title="Pengolahan Data"
            description="Sistem pengolahan data yang efisien dan terstruktur untuk kebutuhan akademik"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Analisis Mendalam"
            description="Tools analisis data yang powerful untuk pengambilan keputusan yang tepat"
          />
          <FeatureCard
            icon={Users}
            title="Kolaborasi Tim"
            description="Mudah berkolaborasi dengan tim untuk pengelolaan data yang lebih baik"
          />
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tentang Kami</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl h-96 flex items-center justify-center">
              <Database className="text-white" size={120} />
            </div>
          </div>

          <div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Sistem ini dirancang dengan tujuan utama untuk meningkatkan efektivitas dan optimasi 
              pengolahan data di Fakultas Matematika dan Ilmu Pengetahuan Alam. Dengan adanya sistem ini, 
              diharapkan tenaga pengajar dapat dengan mudah mengakses dan menganalisis data yang diperlukan 
              untuk pengambilan keputusan yang lebih tepat.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Selain itu, sistem ini juga bertujuan untuk mewujudkan transformasi data yang lebih terstruktur 
              dan terorganisir, sehingga memudahkan pengguna dalam mencari dan menggunakan informasi yang relevan.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Dengan penggunaan sistem ini, diharapkan proses pengolahan data di Fakultas Matematika dan Ilmu 
              Pengetahuan Alam menjadi lebih efisien dan efektif, sehingga waktu dan sumber daya dapat 
              dioptimalkan dengan baik.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const NewsSection = () => {
  const newsData = [
    {
      date: "14-15 Oktober 2024",
      title: "Konferensi Internasional FMIPA",
      description: "Telah dilaksanakan di Hotel Emersia Bandar Lampung. Acara dua tahunan konferensi internasional yang ke lima yang diselenggarakan oleh Fakultas Matematika."
    },
    {
      date: "27 September 2024",
      title: "Kerja Sama FMIPA Unila dan FST Undana",
      description: "Labuan Bajo – Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA) Universitas Lampung (Unila) dan Fakultas Sains dan Teknik (FST) Universitas Nusa Cendana."
    },
    {
      date: "26 Agustus 2024",
      title: "Kunjungan UiTM Malaysia",
      description: "Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA) menerima kunjungan rombongan dari Universiti Teknologi MARA (UiTM), yang terdiri dari delegasi akademik."
    }
  ];

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Berita Terkini</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((news, index) => (
            <NewsCard
              key={index}
              date={news.date}
              title={news.title}
              description={news.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Main App Component
export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <NewsSection />
      <Footer />
    </div>
  );
}