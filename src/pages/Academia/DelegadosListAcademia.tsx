/*
import { Link, useParams } from "react-router";
import { useDelegados } from "../../hooks/Academia/useDelegado";

export default function DelegadosListAcademia() {
  const { academiaId } = useParams<{academiaId: string}>();
  const { delegados, loading } = useDelegados(academiaId!);

  if (loading) return <p className="text-center mt-10">Cargando delegados...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Delegados</h2>
        <Link
          to={`/academias/${academiaId}/formDelegado`}
          className="inline-flex select-none items-center gap-3 rounded-lg bg-red-600 py-2 px-4 text-center font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
          Registrar Delegado
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {delegados?.map((del) => (
          <div
            key={del.id}
            className="relative bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
          >
            <Link
              to={`/academias/${academiaId}/delegados/${del.id}`}
              className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full shadow-sm transition"
              title="Editar Delegado"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
              </svg>
            </Link>

            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md">
              {del.fotoUrl ? (
                <img
                  src={del.fotoUrl}
                  alt="Foto delegado"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                  Sin foto
                </div>
              )}
            </div>

            <h4 className="text-center font-bold text-lg mt-3">
              {del.nombres} {del.apellidos}
            </h4>

            <div className="mt-4 text-sm text-gray-700 space-y-2">
              <p><strong>DNI:</strong> {del.dni}</p>
              <p><strong>Email:</strong> {del.email || "No registrado"}</p>
              <p><strong>Teléfono:</strong> {del.telefono || "No registrado"}</p>
              <p><strong>Fecha nacimiento:</strong> {del.fechaNacimiento}</p>
            </div>

            <Link
              to={`/delegados/${del.id}`}
              className="mt-5 block w-full text-center bg-gray-100 hover:bg-gray-200 border rounded-xl py-2 text-sm font-medium transition"
            >
              Ver Delegado →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
*/
import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useDelegados } from "../../hooks/Academia/useDelegado";
import PageMeta from "../../components/common/PageMeta";

const getInitials = (nombres?: string, apellidos?: string) => {
  if (!nombres && !apellidos) return "DL";
  const n = nombres?.split(" ")[0] || "";
  const a = apellidos?.split(" ")[0] || "";
  return `${n[0] || ""}${a[0] || ""}`.toUpperCase();
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "No registrada";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

const truncateText = (text: string, maxLength: number = 25) => {
  if (!text) return "No registrado";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function DelegadosListAcademia() {
  const { academiaId } = useParams<{ academiaId: string }>();
  const { delegados, loading } = useDelegados(academiaId!);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !delegados) {
      setError("Error al cargar los delegados");
    }
  }, [loading, delegados]);

  // Loading Skeleton
  if (loading) {
    return (
      <>
        <PageMeta title="Cargando delegados..." description="Cargando lista de delegados" />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <PageMeta title="Error" description="Error al cargar delegados" />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-red-900 mb-2">Error al cargar</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta 
        title="Delegados" 
        description="Lista de delegados registrados en la academia"
      />
      
      <div className="p-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <Link to={`/academias/${academiaId}`} className="hover:text-black">
            ← Volver a la academia
          </Link>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Delegados</h2>
            <p className="text-gray-600 text-sm mt-1">
              {delegados?.length || 0} delegado{delegados?.length !== 1 ? 's' : ''} registrado{delegados?.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <Link
            to={`/academias/${academiaId}/formDelegado`}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-2.5 px-4 text-sm font-medium text-white shadow-md transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
            Registrar Delegado
          </Link>
        </div>

        {/* Lista de delegados o estado vacío */}
        {delegados && delegados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {delegados.map((del) => (
              <div
                key={del.id}
                className="relative bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
              >
                {/* Botón Editar */}
                <Link
                  to={`/academias/${academiaId}/delegados/${del.id}`}
                  className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full shadow-sm transition z-10"
                  title="Editar Delegado"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </Link>

                {/* Foto o Iniciales */}
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md">
                  {del.fotoUrl ? (
                    <img
                      src={del.fotoUrl}
                      alt={`${del.nombres} ${del.apellidos}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(del.nombres, del.apellidos)}
                    </div>
                  )}
                </div>

                {/* Nombre */}
                <h4 className="text-center font-bold text-lg mt-3">
                  {del.nombres} {del.apellidos}
                </h4>

                {/* Badge de estado (si existe) */}
                {/*
                {del.activo !== undefined && (
                  <div className="text-center mt-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        del.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {del.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                )}
                */}

                {/* Datos del delegado */}
                <div className="mt-4 text-sm text-gray-700 space-y-2 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <p className="break-all"><strong>DNI:</strong> {del.dni}</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="break-all" title={del.email}>
                      <strong>Email:</strong> {truncateText(del.email, 20)}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p><strong>Teléfono:</strong> {del.telefono || "No registrado"}</p>
                  </div>
                </div>

                {/* Ver Delegado */}
                <Link
                  to={`/delegados/${del.id}`}
                  className="mt-4 block w-full text-center bg-gray-900 hover:bg-black text-white border rounded-xl py-2.5 text-sm font-medium transition"
                >
                  Ver detalles →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          // Estado vacío
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No hay delegados registrados
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando el primer delegado a esta academia
            </p>
            <Link
              to={`/academias/${academiaId}/formDelegado`}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-2.5 px-5 text-sm font-medium text-white shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              Registrar primer delegado
            </Link>
          </div>
        )}
      </div>
    </>
  );
}