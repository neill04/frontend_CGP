import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useEntrenadores } from "../../hooks/Academia/useEntrenador";
import PageMeta from "../../components/common/PageMeta";

const getInitials = (nombres?: string, apellidos?: string) => {
  if (!nombres && !apellidos) return "ET";
  const n = nombres?.split(" ")[0] || "";
  const a = apellidos?.split(" ")[0] || "";
  return `${n[0] || ""}${a[0] || ""}`.toUpperCase();
};

const truncateText = (text: string, maxLength: number = 25) => {
  if (!text) return "No registrado";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function EntrenadoresListAcademia() {
  const { academiaId } = useParams<{ academiaId: string }>();
  const { entrenadores, loading } = useEntrenadores(academiaId!);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !entrenadores) {
      setError("Error al cargar los entrenadores");
    }
  }, [loading, entrenadores]);

  // Loading Skeleton
  if (loading) {
    return (
      <>
        <PageMeta title="Cargando entrenadores..." description="Cargando lista de entrenadores" />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-52 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
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
        <PageMeta title="Error" description="Error al cargar entrenadores" />
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
        title="Entrenadores" 
        description="Lista de entrenadores registrados en la academia"
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
            <h2 className="text-2xl font-bold">Entrenadores</h2>
            <p className="text-gray-600 text-sm mt-1">
              {entrenadores?.length || 0} entrenador{entrenadores?.length !== 1 ? 'es' : ''} registrado{entrenadores?.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <Link
            to={`/academias/${academiaId}/formEntrenador`}
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
            Registrar Entrenador
          </Link>
        </div>

        {/* Lista de entrenadores o estado vacío */}
        {entrenadores && entrenadores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entrenadores.map((ent) => (
              <div
                key={ent.id}
                className="relative bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
              >

                {/* Badge de disciplina en la esquina superior izquierda */}
                {ent.estadoDisciplina && (
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${
                        ent.estadoDisciplina === "ACTIVO"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {ent.estadoDisciplina}
                    </span>
                  </div>
                )}

                {/* Foto o Iniciales */}
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md mt-6">
                  {ent.fotoUrl ? (
                    <img
                      src={ent.fotoUrl}
                      alt={`${ent.nombres} ${ent.apellidos}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(ent.nombres, ent.apellidos)}
                    </div>
                  )}
                </div>

                {/* Nombre */}
                <h4 className="text-center font-bold text-lg mt-3">
                  {ent.nombres} {ent.apellidos}
                </h4>

                {/* Badge de licencia */}
                {ent.licencia && (
                  <div className="text-center mt-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                      Licencia: {ent.licencia}
                    </span>
                  </div>
                )}

                {/* Datos del entrenador */}
                <div className="mt-4 text-sm text-gray-700 space-y-2 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <p className="break-all"><strong>DNI:</strong> {ent.dni}</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="break-all" title={ent.email}>
                      <strong>Email:</strong> {truncateText(ent.email, 20)}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p><strong>Teléfono:</strong> {ent.telefono || "No registrado"}</p>
                  </div>
                </div>

                {/* Ver Entrenador */}
                <Link
                  to={`/academias/${academiaId}/entrenadores/${ent.id}`}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No hay entrenadores registrados
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando el primer entrenador a esta academia
            </p>
            <Link
              to={`/academias/${academiaId}/formEntrenador`}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-2.5 px-5 text-sm font-medium text-white shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              Registrar primer entrenador
            </Link>
          </div>
        )}
      </div>
    </>
  );
}