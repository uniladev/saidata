const News = () => {
  const newsData = [
    {
      date: "14-15 Oktober 2024",
      title: "International Conference on Applied Science, Mathematics, and Informatics (ICASMI) 2024",
      description: "Telah dilaksanakan pada tanggal 14-15 Oktober 2024, di Hotel Emersia Bandar Lampung. Acara dua tahunan konferensi internasional yang ke lima yang diselenggarakan oleh Fakultas Matematika.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      link: "https://fmipa.unila.ac.id/international-conference-on-applied-science-mathematics-and-informatics-icasmi-2024/"
    },
    {
      date: "27 September 2024",
      title: "Kerja Sama Akademik FMIPA Unila dan FST Undana",
      description: "Labuan Bajo – Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA) Universitas Lampung (Unila) dan Fakultas Sains dan Teknik (FST) Universitas Nusa Cendana.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      link: "https://fmipa.unila.ac.id/kerja-sama-akademik-fmipa-unila-dan-fst-undana-penandatanganan-pks-dan-ia-di-icest-2024/"
    },
    {
      date: "26 Agustus 2024",
      title: "Kolaborasi Internasional FMIPA UNILA – Universiti Teknologi MARA (UiTM)",
      description: "Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA) menerima kunjungan rombongan dari Universiti Teknologi MARA (UiTM), yang terdiri dari delegasi akademik.",
      image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=300&fit=crop",
      link: "https://fmipa.unila.ac.id/kolaborasi-internasional-fmipa-unila-universiti-teknologi-mara-uitm-pada-program-inbound-mobility-program-26-agustus-s-d-09-september-2024/"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <p className="text-blue-600 font-semibold text-lg mb-2">Berita</p>
          <h2 className="text-4xl font-bold text-gray-900">
            Fakultas Matematika dan Ilmu Pengetahuan Alam
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((news, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                <a 
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-lg font-semibold mb-3 text-gray-800 hover:text-blue-600 transition"
                >
                  {news.title}
                </a>
                <p className="text-gray-600 text-sm text-justify mb-4">{news.description}</p>
                <a 
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:text-blue-700 transition inline-flex items-center"
                >
                  Baca Selengkapnya 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;