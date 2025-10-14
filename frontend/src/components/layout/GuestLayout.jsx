// frontend/src/components/layout/GuestLayout.jsx
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { Navbar, Footer } from "./index";
import { ScrollToTop, ScrollToTopButton } from "../common";

// Elegant Loading Component
const ElegantLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="relative">
        {/* Outer animated ring - ping effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-ping opacity-75" />
        </div>
        
        {/* Middle spinning ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
        
        {/* Inner counter-spinning ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-16 h-16 border-4 border-indigo-400 border-b-transparent rounded-full animate-spin" 
            style={{ 
              animationDirection: 'reverse', 
              animationDuration: '1s' 
            }} 
          />
        </div>
        
        {/* Center pulsing dot */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-600/50" />
        </div>
      </div>
    </div>
  );
};

const GuestLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Scroll to top on route change */}
      <ScrollToTop />
      
      <Navbar />
      
      <Suspense fallback={<ElegantLoading />}>
        <Outlet />
      </Suspense>
      
      <Footer />
      
      {/* Floating scroll to top button */}
      <ScrollToTopButton />
    </div>
  );
};

export default GuestLayout;