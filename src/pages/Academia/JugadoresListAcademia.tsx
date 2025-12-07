import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useJugadores } from "../../hooks/Academia/useJugador";
import PageMeta from "../../components/common/PageMeta";

const getInitials = (nombres?: string, apellidos?: string) => {
  if (!nombres && !apellidos) return "JG";
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

const calculateAge = (dateString?: string): number | null => {
  if (!dateString) return null;
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default function JugadoresListAcademia() {
  const { academiaId } = useParams<{ academiaId: string }>();
  const { jugadores, fetchJugadores, loading } = useJugadores(academiaId!);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    const loadJugadores = async () => {
      try {
        await fetchJugadores();
      } catch (err) {
        setError("Error al cargar los jugadores");
        console.error(err);
      }
    };
    loadJugadores();
  }, []);

  // Filtrar jugadores por búsqueda y estado
  const filteredJugadores = jugadores?.filter((jug) => {
    // Filtro por búsqueda (DNI, nombre o apellido)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      jug.dni?.toLowerCase().includes(searchLower) ||
      jug.nombres?.toLowerCase().includes(searchLower) ||
      jug.apellidos?.toLowerCase().includes(searchLower) ||
      jug.categoriaEquipo?.toLowerCase().includes(searchLower);

    // Filtro por estado
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && jug.activo) ||
      (filterStatus === "inactive" && !jug.activo);

    return matchesSearch && matchesStatus;
  });

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  // Loading Skeleton
  if (loading) {
    return (
      <>
        <PageMeta title="Cargando jugadores..." description="Cargando lista de jugadores" />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <PageMeta title="Error" description="Error al cargar jugadores" />
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
        title="Jugadores" 
        description="Lista de todos los jugadores registrados en la academia"
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
            <h2 className="text-2xl font-bold">Jugadores</h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredJugadores?.length || 0} de {jugadores?.length || 0} jugador{jugadores?.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por DNI, nombre, apellido o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 h-11 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filtros de estado */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterStatus === "all"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterStatus === "active"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setFilterStatus("inactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterStatus === "inactive"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Inactivos
              </button>
            </div>

            {/* Botón limpiar filtros */}
            {(searchTerm || filterStatus !== "all") && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-black transition"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Mensaje si no hay resultados */}
        {filteredJugadores && filteredJugadores.length === 0 && jugadores && jugadores.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center mb-6">
            <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-bold text-yellow-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-yellow-700 mb-4">
              No hay jugadores que coincidan con tu búsqueda "{searchTerm}"
            </p>
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Lista de jugadores o estado vacío */}
        {filteredJugadores && filteredJugadores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJugadores.map((jug) => {
              const age = calculateAge(jug.fechaNacimiento);
              
              return (
                <div
                  key={jug.id}
                  className="relative bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Botón Editar */}
                  <Link
                    to={`/jugadores/edit/${jug.id}`}
                    className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full shadow-sm transition"
                    title="Editar Jugador"
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

                  {/* Número de camiseta - Badge */}
                  {jug.numeroCamiseta && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      {jug.numeroCamiseta}
                    </div>
                  )}

                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md mt-8">
                    {getInitials(jug.nombres, jug.apellidos)}
                  </div>

                  {/* Nombre */}
                  <h4 className="text-center font-bold text-lg mt-3">
                    {jug.nombres} {jug.apellidos}
                  </h4>

                  {/* Badges de estado y edad */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {jug.activo !== undefined && (
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          jug.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {jug.activo ? "Activo" : "Inactivo"}
                      </span>
                    )}
                    
                    {age !== null && (
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                        {age} años
                      </span>
                    )}
                  </div>

                  {/* Datos del jugador */}
                  <div className="mt-4 text-sm text-gray-700 space-y-2 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <p className="break-all"><strong>DNI:</strong> {jug.dni}</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p><strong>Nacimiento:</strong> {formatDate(jug.fechaNacimiento)}</p>
                    </div>

                    {jug.categoriaEquipo && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p><strong>Categoría:</strong> {jug.categoriaEquipo}</p>
                      </div>
                    )}
                  </div>

                  {/* Ver Jugador */}
                  <Link
                    to={`/jugadores/${jug.id}`}
                    className="mt-4 block w-full text-center bg-gray-900 hover:bg-black text-white border rounded-xl py-2.5 text-sm font-medium transition"
                  >
                    Ver detalles →
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          // Estado vacío
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No hay jugadores registrados
            </h3>
            <p className="text-gray-600 mb-6">
              Los jugadores se registran por categoría desde cada equipo
            </p>
            <Link
              to={`/academias/${academiaId}`}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-2.5 px-5 text-sm font-medium text-white shadow-md transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a la academia
            </Link>
          </div>
        )}
      </div>
    </>
  );
}