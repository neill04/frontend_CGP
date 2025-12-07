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
                className="relative bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col h-full"
              >
                <Link 
                  to={`/formEquipo/edit/${cat.id}`} 
                  className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-sm transition z-10"
                  title="Editar Categoria"
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

                {/* Badge de categoría */}
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md flex-shrink-0">
                  <span className="text-2xl font-bold">
                    {cat.categoria.replace(/\D/g, "")}
                  </span>
                </div>

                {/* Estado */}
                <div className="text-center mt-3 flex-shrink-0">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    cat.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {cat.activo ? "Activa" : "Inactiva"}
                  </span>
                </div>

                {/* Información del equipo - Crece para ocupar espacio disponible */}
                <div className="mt-4 text-sm text-gray-700 space-y-2 bg-gray-50 rounded-lg p-3 flex-grow">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="break-words"><strong>Entrenador:</strong> {cat.nombresEntrenador} {cat.apellidosEntrenador}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="break-words"><strong>Delegado:</strong> {cat.nombresDelegado} {cat.apellidosDelegado}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p><strong>Jugadores:</strong> {cat.totalJugadores}</p>
                  </div>
                </div>

                {/* Fecha de registro - Siempre en la misma posición */}
                <div className="mt-3 flex-shrink-0 h-5">
                  {cat.fechaRegistro && (
                    <p className="text-xs text-gray-400 text-center">
                      Registrado: {formatDate(cat.fechaRegistro)}
                    </p>
                  )}
                </div>

                {/* Botón - Siempre al final */}
                <Link
                  to={`/academias/${academiaId}/equipos/${cat.id}`}
                  className="mt-4 block w-full text-center bg-gray-900 hover:bg-black text-white border rounded-xl py-2.5 text-sm font-medium transition flex-shrink-0"
                >
                  Ver categoría →
                </Link>
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