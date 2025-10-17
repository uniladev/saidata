// frontend/src/App.jsx (Improved Version with AuthContext)
import { Routes, Route, Navigate } from "react-router-dom";
import { GuestLayout, AuthenticatedLayout } from "./components/layout";
import { useAuth } from "./context/AuthContext";
import { lazy } from "react";


// Guest Pages
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const HomePage = lazy(() => import("./pages/guest/Home"));
const AboutPage = lazy(() => import("./pages/guest/About"));
const DocumentValidationPage = lazy(() => import("./pages/guest/DocumentValidation"));
const LoginPage = lazy(() => import("./pages/auth/Login"));

// Authenticated Pages
const DashboardPage = lazy(() => import("./pages/authenticated/Dashboard"));
const FormBuilderPage = lazy(() => import("./pages/authenticated/FormBuilderPage"));
const FormTakerPage = lazy(() => import("./pages/authenticated/FormTakerPage")); // <-- ADD THIS LINE


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
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
        <Route path="/form/:formId" element={<FormTakerPage />} />
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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-form" element={<FormBuilderPage />} />


      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}