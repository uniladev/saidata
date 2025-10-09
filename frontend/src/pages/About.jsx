import React from 'react';
import { Circle } from 'lucide-react';

const AboutPage = () => {
  const logoDetails = [
    {
      title: "Logo Universitas Lampung",
      description: "Sistem ini berada di bawah naungan Universitas Lampung."
    },
    {
      title: "Bentuk Lingkaran",
      description: "Sistem ini dapat memudahkan informasi terkait dan efisiensi waktu. Terlihat dalam mengatur data mahasiswa di jurusan kimia."
    },
    {
      title: "Tulisan C P D C",
      description: "Singkatan dari nama sistem yaitu Chemistry Program Data Center."
    },
    {
      title: "Warna Biru",
      description: "Sistem ini dapat diandalkan untuk pengolahan data mahasiswa di jurusan kimia dan membantu meningkatkan kinerja jurusan."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Logo */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Logo Title */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 font-medium mb-2">Logo</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Pusat Data Fakultas<br />
              Matematika dan<br />
              Ilmu Pengetahuan<br />
              Alam
            </h1>
          </div>

          {/* Logo Display */}
          <div className="flex justify-center mb-16">
            <div className="relative">
              {/* Main Logo Container */}
              <div className="w-64 h-64 flex items-center justify-center">
                <img 
                  src="/images/logo/color.webp" 
                  alt="Logo FMIPA Unila"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Logo Description Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {logoDetails.map((detail, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {detail.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {detail.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Map Title */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 font-medium mb-2">Peta</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Fakultas<br />
              Matematika dan<br />
              Ilmu Pengetahuan<br />
              Alam
            </h2>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.216779476089!2d105.2414147!3d-5.362437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40c557c356cc45%3A0x36c54c2e19e59e1e!2sFakultas%20MIPA%2C%20Universitas%20Lampung!5e0!3m2!1sen!2sid!4v1642412345678!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>

          {/* Address Info */}
          <div className="mt-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-50 rounded-xl p-6">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Alamat</h3>
              <p className="text-gray-600">
                Gedung FMIPA, Jalan Prof. Dr. Ir. Sumantri Brojonegoro No. 1,<br />
                Gedong Meneng, Kec. Rajabasa, Kota Bandar Lampung,<br />
                Lampung 35144
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://maps.app.goo.gl/nWad2JqnJCPt8sDu6"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap"
              >
                Buka di Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Telepon</h3>
              <a href="tel:+62721704625" className="text-blue-600 hover:text-blue-700 font-medium">
                0721-704625
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <a href="mailto:office@fmipa.unila.ac.id" className="text-blue-600 hover:text-blue-700 font-medium break-all">
                office@fmipa.unila.ac.id
              </a>
            </div>

            {/* Website */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Website</h3>
              <a 
                href="https://fmipa.unila.ac.id/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                fmipa.unila.ac.id
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ingin Tahu Lebih Lanjut?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Kunjungi website resmi FMIPA Unila untuk informasi lengkap tentang program studi, penelitian, dan kegiatan akademik lainnya.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://fmipa.unila.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Kunjungi Website FMIPA
            </a>
            <a
              href="/"
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-50 transition border-2 border-blue-600 transform hover:-translate-y-0.5"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;