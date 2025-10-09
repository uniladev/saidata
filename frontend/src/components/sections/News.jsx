import { Calendar, ArrowRight } from 'lucide-react';

// ==================== NEWS ====================
const News = () => {
  const newsData = [
    {
      date: "14-15 Oktober 2024",
      title: "International Conference on Applied Science, Mathematics, and Informatics (ICASMI) 2024",
      description: "Konferensi internasional dua tahunan yang ke-lima diselenggarakan di Hotel Emersia Bandar Lampung.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      link: "https://fmipa.unila.ac.id"
    },
    {
      date: "27 September 2024",
      title: "Kerja Sama Akademik FMIPA Unila dan FST Undana",
      description: "Penandatanganan PKS dan IA di Labuan Bajo dalam rangka ICEST 2024.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      link: "https://fmipa.unila.ac.id"
    },
    {
      date: "26 Agustus 2024",
      title: "Kolaborasi Internasional dengan UiTM Malaysia",
      description: "Program Inbound Mobility dengan delegasi akademik dari Universiti Teknologi MARA.",
      image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=400&fit=crop",
      link: "https://fmipa.unila.ac.id"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold mb-2">Berita Terkini</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Kabar Terbaru dari FMIPA
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsData.map((news, index) => (
            <article key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-48">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{news.date}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {news.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {news.description}
                </p>

                <a 
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:gap-2 transition-all"
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};


export default News;