// frontend/src/App.jsx
import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { GuestLayout, AuthenticatedLayout } from "./components/layout";
import { useAuth } from "./context/AuthContext";

// Import all pages using barrel exports
const {
  // Guest pages
  HomePage,
  AboutPage,
  DocumentValidationPage,
  // Auth pages
  LoginPage,
  // Authenticated pages
  DashboardPage,
  FormBuilderPage,
  FormTakerPage,
  // Other pages
  NotFoundPage
} = {
  HomePage: lazy(() => import("./pages/guest/Home")),
  AboutPage: lazy(() => import("./pages/guest/About")),
  DocumentValidationPage: lazy(() => import("./pages/guest/DocumentValidation")),
  LoginPage: lazy(() => import("./pages/auth/Login")),
  DashboardPage: lazy(() => import("./pages/authenticated/User/Dashboard")),
  FormBuilderPage: lazy(() => import("./pages/authenticated/User/FormBuilderPage")),
  FormTakerPage: lazy(() => import("./pages/authenticated/User/FormTakerPage")),
  NotFoundPage: lazy(() => import("./pages/NotFound"))
};

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
        <Route path="/form/:formId" element={<FormTakerPage />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}