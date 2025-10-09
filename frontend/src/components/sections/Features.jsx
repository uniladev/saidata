// frontend/src/components/sections/Features.jsx
import { Database, Lightbulb, Users, BookOpen, TrendingUp, Shield } from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: Database,
      title: 'Pengolahan Data Terpadu',
      description: 'Sistem terintegrasi untuk mengelola data akademik, penelitian, dan administrasi dengan efisien dan akurat',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Lightbulb,
      title: 'Solusi Inovatif',
      description: 'Platform cerdas yang membantu pengambilan keputusan berbasis data untuk kemajuan akademik',
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }
  ];

  const additionalFeatures = [
    {
      icon: Users,
      title: 'Kolaborasi Tim',
      description: 'Memfasilitasi kerja sama antar dosen dan mahasiswa',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50'
    },
    {
      icon: BookOpen,
      title: 'Manajemen Seminar',
      description: 'Kelola seminar PKL, TA, dan Tesis dengan mudah',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50'
    },
    {
      icon: TrendingUp,
      title: 'Analisis & Laporan',
      description: 'Dashboard statistik real-time dan reporting',
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50'
    },
    {
      icon: Shield,
      title: 'Keamanan Data',
      description: 'Enkripsi dan backup otomatis untuk keamanan',
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50'
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-blue-50/30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              Fitur Unggulan
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
           Kenapa <span className="text-blue-600">Saidata</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Platform komprehensif untuk pengelolaan data akademik yang efisien, transparan, dan mudah digunakan
          </p>
        </div>

        {/* Main Features - Large Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex p-4 ${feature.iconBg} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <feature.icon className={`w-10 h-10 ${feature.iconColor}`} strokeWidth={1.5} />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
                
                {/* Arrow Icon */}
                <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-0 group-hover:translate-x-2">
                  <span>Pelajari Lebih Lanjut</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 ${feature.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} strokeWidth={2} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Pengguna Aktif</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Dokumen Terkelola</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">99%</div>
              <div className="text-blue-100">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;