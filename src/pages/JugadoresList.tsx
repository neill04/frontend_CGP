import { useEffect, useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import PageMeta from "../components/common/PageMeta";

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

export default function JugadoresList() {
  const { jugadores, fetchJugadores, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterCategoria, setFilterCategoria] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

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

  // Extraer categorías únicas para el filtro
  const categorias = Array.from(
    new Set(jugadores?.map((jug) => jug.categoriaEquipo).filter(Boolean))
  ).sort();

  // Filtrar jugadores
  const filteredJugadores = jugadores?.filter((jug) => {
    // Filtro por búsqueda (nombre, apellido o DNI)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      jug.nombres?.toLowerCase().includes(searchLower) ||
      jug.apellidos?.toLowerCase().includes(searchLower) ||
      jug.dni?.toLowerCase().includes(searchLower) ||
      jug.nombreAcademia?.toLowerCase().includes(searchLower);

    // Filtro por estado
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && jug.activo) ||
      (filterStatus === "inactive" && !jug.activo);

    // Filtro por categoría
    const matchesCategoria = 
      filterCategoria === "all" || 
      jug.categoriaEquipo === filterCategoria;

    return matchesSearch && matchesStatus && matchesCategoria;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterCategoria("all");
  };

  const hasActiveFilters = searchTerm || filterStatus !== "all" || filterCategoria !== "all";

  // Loading Skeleton
  if (loading) {
    return (
      <>
        <PageMeta title="Cargando..." description="Cargando jugadores" />
        <div className="p-6 animate-pulse">
          <div className="flex justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="h-20 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-80"></div>
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
        title="Todos los Jugadores | Copa Gol Perú" 
        description="Lista completa de jugadores registrados"
      />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Todos los Jugadores</h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredJugadores?.length || 0} de {jugadores?.length || 0} jugador{jugadores?.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="space-y-4">
            {/* Primera fila: Búsqueda y Categoría */}
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
                  placeholder="Buscar por nombre, apellido, DNI o academia..."
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

              {/* Select de Categoría */}
              <div className="relative md:w-64">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="w-full pl-10 pr-10 h-11 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm appearance-none bg-white cursor-pointer"
                >
                  <option value="all">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Segunda fila: Filtros de estado y botón limpiar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Estado:</span>
              
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
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-black transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Indicadores de filtros activos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-600">Filtros activos:</span>
                {searchTerm && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                    Búsqueda: "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} className="hover:text-blue-900">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {filterCategoria !== "all" && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1">
                    Categoría: {filterCategoria}
                    <button onClick={() => setFilterCategoria("all")} className="hover:text-purple-900">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {filterStatus !== "all" && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    filterStatus === "active" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    Estado: {filterStatus === "active" ? "Activos" : "Inactivos"}
                    <button onClick={() => setFilterStatus("all")} className="hover:opacity-80">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
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
              No hay jugadores que coincidan con los filtros seleccionados
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Grid de jugadores */}
        {filteredJugadores && filteredJugadores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJugadores.map((jug) => {
              const age = calculateAge(jug.fechaNacimiento);
              
              return (
                <div
                  key={jug.id}
                  className="relative bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
                >
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

                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="break-words">
                        <strong>Equipo:</strong>{" "}
                        {jug.categoriaEquipo && jug.nombreAcademia
                          ? `${jug.categoriaEquipo} - ${jug.nombreAcademia}`
                          : "Sin asignar"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && jugadores?.length === 0 && (
            // Estado vacío
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No hay jugadores registrados
              </h3>
              <p className="text-gray-600">
                Los jugadores se registran desde cada equipo de las academias
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}