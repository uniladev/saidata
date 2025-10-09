import { useState, useEffect } from 'react';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Science is the bridge that connects knowledge with discovery',
      align: 'left'
    },
    {
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop',
      title: 'Science unites the mysteries of the universe with the wonders of life',
      align: 'right'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={slide.image} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
              <div className={`max-w-2xl ${slide.align === 'right' ? 'ml-auto text-right' : ''}`}>
                <p className="text-white text-xl mb-4 animate-fadeIn">
                  Welcome to <strong>Saidata</strong>
                </p>
                <h1 className="text-white text-5xl font-bold leading-tight animate-fadeIn">
                  {slide.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroCarousel;