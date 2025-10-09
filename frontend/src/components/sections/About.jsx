const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <button className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center group hover:scale-110 transition">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-25"></div>
              <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          
          <div>
            <p className="text-blue-600 font-semibold text-lg mb-2">Tentang Kami</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pusat Data Fakultas Matematika dan Ilmu Pengetahuan
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Sistem ini dirancang dengan tujuan utama untuk meningkatkan efektivitas dan optimasi pengolahan data di Fakultas Matematika dan Ilmu Pengetahuan Alam. Dengan adanya sistem ini, diharapkan tenaga pengajar dapat dengan mudah mengakses dan menganalisis data yang diperlukan untuk pengambilan keputusan yang lebih tepat.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6 text-justify">
              Selain itu, sistem ini juga bertujuan untuk mewujudkan transformasi data yang lebih terstruktur dan terorganisir, sehingga memudahkan pengguna dalam mencari dan menggunakan informasi yang relevan. Dengan penggunaan sistem ini, diharapkan proses pengolahan data di Fakultas Matematika dan Ilmu Pengetahuan Alam menjadi lebih efisien dan efektif.
            </p>
            <a 
              href="https://fmipa.unila.ac.id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Jelajahi Lebih Lanjut
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;