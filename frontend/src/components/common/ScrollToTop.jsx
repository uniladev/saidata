// frontend/src/components/common/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to scroll to top on route change
 * Place this inside your Router but doesn't render anything
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'smooth' for smooth scroll or 'instant' for immediate
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;