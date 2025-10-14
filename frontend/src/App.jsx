// frontend/src/App.jsx (Improved Version with AuthContext)
import { Routes, Route, Navigate } from "react-router-dom";
import { GuestLayout, DashboardLayout } from "./components/layout";
import { useAuth } from "./context/AuthContext";
import { lazy } from "react";

// Guest Pages
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const HomePage = lazy(() => import("./pages/guest/Home"));
const AboutPage = lazy(() => import("./pages/guest/About"));
const LoginPage = lazy(() => import("./pages/auth/Login"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Guest Routes */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Dashboard Routes (Protected) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* <Route path="/dashboard" element={<DashboardHome />} /> */}

      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}