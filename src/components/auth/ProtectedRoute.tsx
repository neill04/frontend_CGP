import { ReactNode } from "react";
import { Navigate, useParams } from "react-router";
import { useAuthContext } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
  requireAcademiaAccess?: boolean;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}

function UnauthorizedPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-gray-600 mb-4">No tienes permisos para acceder a este recurso.</p>
      <a href="/" className="text-blue-500 hover:underline">
        Volver al inicio
      </a>
    </div>
  );
}

export default function ProtectedRoute({ children, roles, requireAcademiaAccess = false } : ProtectedRouteProps) {
  const { loading, authenticated, user, canAccessAcademia } = useAuthContext();
  const params = useParams();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Verificar roles si se especificaron
  if (roles && roles.length > 0) {
    if (!user || !roles.includes(user.role)) {
      return <UnauthorizedPage />;
    }
  }

  // Verificar acceso a academia específica si se requiere
  if (requireAcademiaAccess) {
    const academiaId = params.academiaId || params.id;
    
    if (academiaId && !canAccessAcademia(academiaId)) {
      return <UnauthorizedPage />;
    }
  }

  return <>{children}</>;
}