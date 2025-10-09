// frontend/src/components/sections/Features.jsx
import { Database, Lightbulb} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Database,
      title: 'Pengolahan Data',
      description: 'Efektivitas dan optimasi pengolahan data untuk pengambilan keputusan yang lebih baik'
    },
    {
      icon: Lightbulb,
      title: 'Solusi Inovatif',
      description: 'Platform cerdas untuk memudahkan pengelolaan data akademik dan penelitian'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Platform komprehensif untuk pengelolaan data akademik yang efisien
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;