// frontend/src/App.jsx (Improved Version with AuthContext)
import { Routes, Route, Navigate } from "react-router-dom";
import { GuestLayout, AuthenticatedLayout } from "./components/layout";
import { useAuth } from "./context/AuthContext";
import { lazy } from "react";
import { FormBuilder } from "./components/auth/FormBuilder"

// Guest Pages
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const HomePage = lazy(() => import("./pages/guest/Home"));
const AboutPage = lazy(() => import("./pages/guest/About"));
const DocumentValidationPage = lazy(() => import("./pages/guest/DocumentValidation"));
const LoginPage = lazy(() => import("./pages/auth/Login"));

// FormBuilder Page Component
const FormBuilderPage = () => {
  return (
    <div className="form-builder-container p-6">
      <h1 className="text-3xl font-bold mb-6">Form Builder</h1>
      <FormBuilder />
    </div>
  );
};

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
        <Route path="/validasi" element={<DocumentValidationPage />} />
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
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Home dengan FormBuilder */}
        <Route path="/dashboard" element={<FormBuilderPage />} />
        {/* Atau jika ingin route terpisah */}
        <Route path="/dashboard/form-builder" element={<FormBuilderPage />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}