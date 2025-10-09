import { Database } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Database className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Pengolahan Data</h3>
            <p className="text-gray-600">Efektifitas dan Optimasi Pengolahan Data</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Pengambilan Keputusan</h3>
            <p className="text-gray-600">Memudahkan Dalam Pengambilan Keputusan</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;