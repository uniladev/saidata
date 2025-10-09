// Import all components using barrel exports
import { Navbar, Footer } from './components/layout';
import { HeroCarousel, Features, About, News } from './components/sections';

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroCarousel />
      <Features />
      <About />
      <News />
      <Footer />
    </div>
  );
};

export default App;