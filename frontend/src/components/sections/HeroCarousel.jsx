// frontend/src/components/sections/HeroCarousel.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../ui/Button';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1172&auto=format&fit=crop',
      title: 'Science is the bridge that connects knowledge with discovery',
      subtitle: 'Exploring the frontiers of Mathematics and Natural Sciences'
    },
    {
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop',
      title: 'Science unites the mysteries of the universe with the wonders of life',
      subtitle: 'Advancing research and innovation for a better tomorrow'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={slide.image} 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="max-w-3xl space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-blue-600/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                    Welcome to Saidata
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl text-gray-200 max-w-2xl">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <PrimaryButton className="px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Explore More
                  </PrimaryButton>
                  <GhostButton className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/20">
                    Learn About Us
                  </GhostButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Buttons */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition group"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition group"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition" />
      </button>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;