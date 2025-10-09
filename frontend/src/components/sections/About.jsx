// frontend/src/components/sections/About.jsx
import { useState } from "react";
import { ChevronRight } from "lucide-react";

const About = () => {
  const fallbacks = [
    "https://source.unsplash.com/featured/800x600?university,campus",
    "https://picsum.photos/800/600",
    "https://via.placeholder.com/800x600?text=FMIPA"
  ];
  const [srcIdx, setSrcIdx] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={fallbacks[srcIdx]}
                alt="About FMIPA"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={() => {
                  // coba fallback berikutnya jika ada
                  setSrcIdx((i) => (i + 1 < fallbacks.length ? i + 1 : i));
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-600 rounded-3xl -z-10" />
          </div>

          {/* ...sisanya tetap */}
          <div className="space-y-6">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
                Faculty of Mathematics and Natural Sciences
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-justify">
              Our system is designed to enhance effectiveness and optimize data processing at the Faculty of Mathematics and Natural Sciences. It enables faculty members to easily access and analyze necessary data for better decision-making.
            </p>

            <p className="text-gray-600 leading-relaxed text-justify">
              We aim to achieve more structured and organized data transformation, facilitating users in finding and utilizing relevant information efficiently.
            </p>

            <div className="pt-4">
              <a
                href="https://fmipa.unila.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                Learn More
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
