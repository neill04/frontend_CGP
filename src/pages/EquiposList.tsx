import { useEffect, useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { Link } from "react-router";
import PageMeta from "../components/common/PageMeta";

const formatDate = (dateString?: string) => {
  if (!dateString) return "No registrada";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

const getInitials = (nombre?: string) => {
  if (!nombre) return "EQ";
  const words = nombre.split(" ");
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};

export default function EquiposList() {
  const { equipos, loading, fetchEquipos } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterCategoria, setFilterCategoria] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEquipos = async () => {
      try {
        await fetchEquipos();
      } catch (err) {
        setError("Error al cargar los equipos");
        console.error(err);
      }
    };
    loadEquipos();
  }, []);

  // Extraer categorías únicas para el filtro
  const categorias = Array.from(
    new Set(equipos?.map((eq) => eq.categoria).filter(Boolean))
  ).sort();

  // Filtrar equipos
  const filteredEquipos = equipos?.filter((eq) => {
    // Filtro por búsqueda (nombre de academia, entrenador o delegado)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      eq.nombreAcademia?.toLowerCase().includes(searchLower) ||
      eq.nombresEntrenador?.toLowerCase().includes(searchLower) ||
      eq.apellidosEntrenador?.toLowerCase().includes(searchLower) ||
      eq.nombresDelegado?.toLowerCase().includes(searchLower) ||
      eq.apellidosDelegado?.toLowerCase().includes(searchLower);

    // Filtro por estado
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && eq.activo) ||
      (filterStatus === "inactive" && !eq.activo);

    // Filtro por categoría
    const matchesCategoria = 
      filterCategoria === "all" || 
      eq.categoria === filterCategoria;

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
        <PageMeta title="Cargando..." description="Cargando equipos" />
        <div className="p-6 animate-pulse">
          <div className="flex justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="h-20 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96"></div>
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
        <PageMeta title="Error" description="Error al cargar equipos" />
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
        title="Equipos Registrados | Administrador"
        description="Listado de todos los equipos registrados en Copa Gol Perú 2025."
      />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Equipos Registrados</h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredEquipos?.length || 0} de {equipos?.length || 0} equipo{equipos?.length !== 1 ? 's' : ''}
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
                  placeholder="Buscar por academia, entrenador o delegado..."
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
        {filteredEquipos && filteredEquipos.length === 0 && equipos && equipos.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center mb-6">
            <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-bold text-yellow-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-yellow-700 mb-4">
              No hay equipos que coincidan con los filtros seleccionados
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

        {/* Grid de equipos */}
        {filteredEquipos && filteredEquipos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipos.map((eq) => (
              <div
                key={eq.id}
                className="relative bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
              >
                {/* Botón Editar */}
                <Link
                  to={`/formEquipo/edit/${eq.id}`}
                  className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-sm transition z-10"
                  title="Editar Equipo"
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

                {/* Logo de academia */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                    {eq.logoUrlAcademia ? (
                      <img
                        src={eq.logoUrlAcademia}
                        alt={eq.nombreAcademia}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(eq.nombreAcademia)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mt-2 text-center">{eq.nombreAcademia}</h3>
                </div>

                {/* Badge de categoría */}
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md">
                  <span className="text-2xl font-bold">
                    {eq.categoria.replace(/\D/g, "")}
                  </span>
                </div>

                {/* Estado */}
                <div className="text-center mt-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    eq.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {eq.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>

                {/* Información del equipo */}
                <div className="mt-4 text-sm text-gray-700 space-y-2 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-xs">
                      <strong>Entrenador:</strong><br/>
                      {eq.nombresEntrenador} {eq.apellidosEntrenador}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs">
                      <strong>Delegado:</strong><br/>
                      {eq.nombresDelegado} {eq.apellidosDelegado}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-xs">
                      <strong>Jugadores:</strong> {eq.totalJugadores}
                    </p>
                  </div>
                </div>

                {/* Fecha de registro */}
                {eq.fechaRegistro && (
                  <p className="mt-3 text-xs text-gray-400 text-center">
                    Registrado: {formatDate(eq.fechaRegistro)}
                  </p>
                )}

                {/* Ver equipo */}
                <Link
                  to={`/academias/${eq.academiaId}/equipos/${eq.id}`}
                  className="mt-4 block w-full text-center bg-gray-900 hover:bg-black text-white border rounded-xl py-2.5 text-sm font-medium transition"
                >
                  Ver equipo →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          !loading && equipos?.length === 0 && (
            // Estado vacío
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No hay equipos registrados
              </h3>
              <p className="text-gray-600">
                Los equipos se registran desde cada academia
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}