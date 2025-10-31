// frontend/src/App.jsx
import { lazy, Suspense } from "react";
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
  FormsListPage,
  DocumentTemplates,
  // Other pages
  NotFoundPage,
  MenuManagementPage,
  TablePage,
  OutputTemplatesPage,
} = {
  HomePage: lazy(() => import("./pages/guest/Home")),
  AboutPage: lazy(() => import("./pages/guest/About")),
  DocumentValidationPage: lazy(() => import("./pages/guest/DocumentValidation")),
  LoginPage: lazy(() => import("./pages/auth/Login")),
  DashboardPage: lazy(() => import("./pages/authenticated/User/Dashboard")),
  FormBuilderPage: lazy(() => import("./pages/authenticated/Admin/Forms/FormBuilderPage")),
  FormTakerPage: lazy(() => import("./pages/authenticated/Admin/Forms/FormTakerPage")),
  FormsListPage: lazy(() => import("./pages/authenticated/Admin/Forms/FormsListPage")),
  DocumentTemplates: lazy(() => import("./pages/authenticated/User/DocumentTemplates")),
  NotFoundPage: lazy(() => import("./pages/NotFound")),
  MenuManagementPage: lazy(() => import("./pages/authenticated/Admin/Menu/MenuManagementPage")),
  TablePage: lazy(() => import("./pages/authenticated/Admin/Table/TablePage")),
  OutputTemplatesPage: lazy(() => import("./pages/authenticated/Admin/OutputTemplate/OutputTemplatesPage")),
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
    <Suspense fallback={<div>Loading...</div>}> 
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
        <Route path="/forms" element={<FormsListPage />} />
        <Route path="/forms/create" element={<FormBuilderPage />} />
        <Route path="/forms/edit/:formId" element={<FormBuilderPage />} />
        <Route path="/form/:formId" element={<FormTakerPage />} />
        <Route path="/menu" element={<MenuManagementPage />} />
        <Route path="/menu/:slug" element={<DocumentTemplates />} />
        <Route path="/table-demo" element={<TablePage />} />
        <Route path="/output-templates" element={<OutputTemplatesPage />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </Suspense>
  );
}