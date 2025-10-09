import { Calendar, ArrowRight, ExternalLink, Newspaper } from 'lucide-react';

const News = () => {
  const newsData = [
    {
      date: "14-15 Oktober 2024",
      category: "Konferensi",
      title: "International Conference on Applied Science, Mathematics, and Informatics (ICASMI) 2024",
      description: "Konferensi internasional dua tahunan yang ke-lima diselenggarakan di Hotel Emersia Bandar Lampung dengan tema Applied Science untuk kemajuan penelitian.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      link: "https://fmipa.unila.ac.id/international-conference-on-applied-science-mathematics-and-informatics-icasmi-2024/",
      featured: true
    },
    {
      date: "27 September 2024",
      category: "Kerjasama",
      title: "Kerja Sama Akademik FMIPA Unila dan FST Undana",
      description: "Penandatanganan PKS dan IA antara FMIPA Universitas Lampung dengan FST Universitas Nusa Cendana di Labuan Bajo dalam rangka ICEST 2024.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      link: "https://fmipa.unila.ac.id/kerja-sama-akademik-fmipa-unila-dan-fst-undana-penandatanganan-pks-dan-ia-di-icest-2024/",
      featured: false
    },
    {
      date: "26 Agustus 2024",
      category: "Kolaborasi",
      title: "Kolaborasi Internasional FMIPA UNILA – Universiti Teknologi MARA (UiTM)",
      description: "Program Inbound Mobility dengan delegasi akademik dari UiTM Malaysia untuk pertukaran pengetahuan dan pengalaman.",
      image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=400&fit=crop",
      link: "https://fmipa.unila.ac.id/kolaborasi-internasional-fmipa-unila-universiti-teknologi-mara-uitm-pada-program-inbound-mobility-program-26-agustus-s-d-09-september-2024/",
      featured: false
    }
  ];

  const categoryColors = {
    "Konferensi": "bg-blue-100 text-blue-700",
    "Kerjasama": "bg-green-100 text-green-700",
    "Kolaborasi": "bg-purple-100 text-purple-700"
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Background Decoration */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold text-sm">
            <Newspaper className="w-4 h-4" />
            <span>Berita Terkini</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Kabar Terbaru dari <span className="text-blue-600">FMIPA</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Informasi terkini seputar kegiatan, kolaborasi, dan prestasi Fakultas MIPA Unila
          </p>
        </div>

        {/* Featured News - Large Card */}
        {newsData.filter(news => news.featured).map((news, index) => (
          <div 
            key={index}
            className="mb-12 group"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 lg:h-full overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-red-500 text-white text-xs font-bold uppercase rounded-full shadow-lg">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 ${categoryColors[news.category]} text-xs font-semibold rounded-full`}>
                      {news.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{news.date}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {news.description}
                  </p>

                  <a 
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all group/link"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Regular News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsData.filter(news => !news.featured).map((news, index) => (
            <article 
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-100 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 ${categoryColors[news.category]} text-xs font-semibold rounded-lg shadow-md backdrop-blur-sm`}>
                    {news.category}
                  </span>
                </div>

                {/* Date Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-700" />
                  <span className="text-xs font-semibold text-gray-700">{news.date}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {news.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {news.description}
                </p>

                <a 
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all group/link"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* View All News Button */}
        <div className="mt-16 text-center">
          <a
            href="https://fmipa.unila.ac.id/berita"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            <span>Lihat Semua Berita</span>
            <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default News;