// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute() {
  const { user, booting } = useAuth();
  const loc = useLocation();

  if (booting) return <div className="p-6">Loading…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;

  return <Outlet />;
}
