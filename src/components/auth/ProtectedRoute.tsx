import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children } : ProtectedRouteProps) {
  const { loading, authenticated } = useAuth();

  if (loading) return <p>Cargando...</p>

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}