// frontend/src/components/layout/DashboardLayout.jsx
import { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardTopbar from './DashboardTopbar';
import DashboardSidebar from './DashboardSidebar';
import { ScrollToTop, ScrollToTopButton } from '../common';

// Loading Component
const DashboardLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      
      {/* Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <DashboardTopbar toggleSidebar={toggleSidebar} />
        
        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<DashboardLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default DashboardLayout;