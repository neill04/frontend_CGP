import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useEquipos } from "../../hooks/Academia/useEquipo";
import { useAcademias } from "../../hooks/Academia/useAcademia";
import { AcademiaDTO } from "../../api/academiaApi";
import { useAuthContext } from "../../context/AuthContext";

const getInitials = (nombre?: string) => {
  if (!nombre) return "AC";
  const words = nombre.split(" ");
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
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

export default function AcademiaInfo() {
  const { id } = useParams<{ id: string }>();
  const { getAcademia } = useAcademias();
  const { equipos, loading: loadingEquipos } = useEquipos(id!);
  const { isAdmin, isAcademia, getAcademiaId } = useAuthContext();
  const academiaId = isAcademia() ? getAcademiaId() : id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [academia, setAcademia] = useState<AcademiaDTO>({
    nombreAcademia: "",
    nombreRepresentante: "",
    dniRepresentante: "",
    telefonoRepresentante: "",
    liga: "",
    logoUrl: "",
    distritoId: 0,
  });

  useEffect(() => {
    const fetchAcademiaData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (academiaId) {
          const academiaData = await getAcademia(academiaId);
          if (academiaData) {
            setAcademia(academiaData);
          }
        }
      } catch (err) {
        setError("Error al cargar la información de la academia");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademiaData();
  }, [academiaId]);

  // Loading State
  if (loading || loadingEquipos) {
    return (
      <>
        <PageMeta title="Cargando..." description="Cargando información de la academia" />
        <div className="p-6 animate-pulse">
          <div className="bg-gray-200 rounded-xl h-40 mb-6"></div>
          <div className="flex justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
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
        <PageMeta title="Error" description="Error al cargar academia" />
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
        title={`${academia?.nombreAcademia} | Detalle`} 
        description="Detalle de la academia y sus categorías"
      />

      <div className="p-6">
        {/* Card principal de academia */}
        <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
          {isAdmin() && (
            <Link to="/academias" className="text-sm text-gray-600 hover:text-black inline-flex items-center gap-1 mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a academias
            </Link>
          )}

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-3">
            {/* Logo */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-md flex-shrink-0">
              {academia?.logoUrl ? (
                <img 
                  src={academia.logoUrl} 
                  alt={academia.nombreAcademia}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(academia?.nombreAcademia)}
                </div>
              )}
            </div>
            
            {/* Información */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{academia?.nombreAcademia}</h2>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span><strong>Representante:</strong> {academia?.nombreRepresentante}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <span><strong>DNI:</strong> {academia?.dniRepresentante}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span><strong>Teléfono:</strong> {academia?.telefonoRepresentante}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-2 items-center md:items-end">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                {academia?.totalEquipos || 0} Categoría{academia?.totalEquipos !== 1 ? 's' : ''}
              </span>
              {/*
              {academia?.activo !== undefined && (
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  academia.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {academia.activo ? "Activa" : "Inactiva"}
                </span>
              )}
              */}
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/academias/${academiaId}/entrenadores`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Ver Entrenadores
              </Link>
              <Link
                to={`/academias/${academiaId}/delegados`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver Delegados
              </Link>
              <Link
                to={`/academias/${academiaId}/jugadores`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ver Jugadores
              </Link>
            </div>
          </div>
        </div>

        {/* Header de categorías */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Categorías de la Academia</h3>
          
          <div className="relative">
            <Link
                to={`/academias/${academia.id}/formEquipo`}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-2.5 px-4 text-sm font-medium text-white shadow-md transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Agregar categoría
              </Link>
          </div>
        </div>

        {/* Grid de categorías o estado vacío */}
        {equipos && equipos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipos.map((cat) => (
              <div
                key={cat.id}
                className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.15)] transition-all flex flex-col h-full"
              >
                {/* Header de la card: Círculo y Estado */}
                <div className="flex flex-col items-center mt-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md flex-shrink-0 border-4 border-red-50">
                    <span className="text-2xl font-bold">
                      {cat.categoria.replace(/\D/g, "")}
                    </span>
                  </div>
                  <span className={`mt-3 text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                    cat.activo ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    {cat.activo ? "Activa" : "Inactiva"}
                  </span>
                </div>

                {/* Información del equipo - Mejor estructurada para valores nulos */}
                <div className="mt-5 space-y-3 bg-gray-50 border border-gray-100 rounded-xl p-4 flex-grow">
                  
                  {/* Fila Entrenador */}
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Entrenador</p>
                      {cat.nombresEntrenador ? (
                         <p className="text-sm font-medium text-gray-800 break-words leading-tight mt-0.5">
                           {cat.nombresEntrenador} {cat.apellidosEntrenador}
                         </p>
                      ) : (
                        <p className="text-sm text-amber-600 italic font-medium leading-tight mt-0.5">
                          Sin asignar
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fila Delegado */}
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Delegado</p>
                      {cat.nombresDelegado ? (
                         <p className="text-sm font-medium text-gray-800 break-words leading-tight mt-0.5">
                           {cat.nombresDelegado} {cat.apellidosDelegado}
                         </p>
                      ) : (
                        <p className="text-sm text-amber-600 italic font-medium leading-tight mt-0.5">
                          Sin asignar
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Fila Jugadores */}
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-xs font-semibold uppercase tracking-wide">Plantilla</span>
                     </div>
                     <span className="bg-white border border-gray-200 px-3 py-1 rounded-lg text-sm font-bold text-gray-800 shadow-sm">
                       {cat.totalJugadores} jug.
                     </span>
                  </div>
                </div>

                {/* Footer: Fecha y Botón */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex-shrink-0">
                  <Link
                    to={`/academias/${academiaId}/equipos/${cat.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-2.5 text-sm font-semibold transition-all shadow-sm hover:shadow"
                  >
                    Gestionar Categoría
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {cat.fechaRegistro && (
                    <p className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-wider font-medium">
                      Creado el {formatDate(cat.fechaRegistro)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No hay categorías registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando la primera categoría a esta academia
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-2.5 px-5 text-sm font-medium text-white shadow-md transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar categoría
            </button>
          </div>
        )}
      </div>
    </>
  );
}