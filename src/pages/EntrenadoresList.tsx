import { useEffect, useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { Link } from "react-router";
import PageMeta from "../components/common/PageMeta";

const getInitials = (nombres?: string, apellidos?: string) => {
  if (!nombres && !apellidos) return "ET";
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

export default function EntrenadoresList() {
  const { entrenadores, fetchEntrenadores, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterDisciplina, setFilterDisciplina] = useState<"all" | "ACTIVO" | "INACTIVO">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntrenadores = async () => {
      try {
        await fetchEntrenadores();
      } catch (err) {
        setError("Error al cargar los entrenadores");
        console.error(err);
      }
    };
    loadEntrenadores();
  }, []);

  // Filtrar entrenadores
  const filteredEntrenadores = entrenadores?.filter((ent) => {
    // Filtro por búsqueda (nombre, apellido, DNI, licencia o academia)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      ent.nombres?.toLowerCase().includes(searchLower) ||
      ent.apellidos?.toLowerCase().includes(searchLower) ||
      ent.dni?.toLowerCase().includes(searchLower) ||
      ent.licencia?.toLowerCase().includes(searchLower) ||
      ent.nombreAcademia?.toLowerCase().includes(searchLower);

    // Filtro por estado
    /*
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && ent.activo) ||
      (filterStatus === "inactive" && !ent.activo);
    */

    // Filtro por estado de disciplina
    const matchesDisciplina = 
      filterDisciplina === "all" || 
      ent.estadoDisciplina === filterDisciplina;

    //return matchesSearch && matchesStatus && matchesDisciplina;
    return matchesSearch && matchesDisciplina;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterDisciplina("all");
  };

  const hasActiveFilters = searchTerm || filterStatus !== "all" || filterDisciplina !== "all";

  // Loading Skeleton
  if (loading) {
    return (
      <>
        <PageMeta title="Cargando..." description="Cargando entrenadores" />
        <div className="p-6 animate-pulse">
          <div className="flex justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="h-20 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-[420px]"></div>
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
        title="Todos los Entrenadores | Copa Gol Perú" 
        description="Lista completa de entrenadores registrados"
      />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Todos los Entrenadores</h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredEntrenadores?.length || 0} de {entrenadores?.length || 0} entrenador{entrenadores?.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="space-y-4">
            {/* Buscador */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI, licencia o academia..."
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
            </div>

            {/* Filtros de estado y disciplina */}
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

              <span className="text-sm text-gray-600 font-medium ml-4">Disciplina:</span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterDisciplina("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterDisciplina === "all"
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterDisciplina("ACTIVO")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterDisciplina === "ACTIVO"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Habilitado
                </button>
                <button
                  onClick={() => setFilterDisciplina("INACTIVO")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterDisciplina === "INACTIVO"
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Sancionado
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
                {filterDisciplina !== "all" && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    filterDisciplina === "ACTIVO" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    Disciplina: {filterDisciplina === "ACTIVO" ? "Habilitado" : "Sancionado"}
                    <button onClick={() => setFilterDisciplina("all")} className="hover:opacity-80">
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
        {filteredEntrenadores && filteredEntrenadores.length === 0 && entrenadores && entrenadores.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center mb-6">
            <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-bold text-yellow-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-yellow-700 mb-4">
              No hay entrenadores que coincidan con los filtros seleccionados
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

        {/* Grid de entrenadores */}
        {filteredEntrenadores && filteredEntrenadores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntrenadores.map((ent) => (
              <div
                key={ent.id}
                className="relative bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col h-full"
              >
                {/* Botón Editar */}
                <Link
                  to={`/entrenadores/edit/${ent.id}`}
                  className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full shadow-sm transition z-10"
                  title="Editar Entrenador"
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

                {/* Badge de disciplina en esquina superior izquierda */}
                {ent.estadoDisciplina && (
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${
                        ent.estadoDisciplina === "ACTIVO"
                          ? "bg-green-500 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {ent.estadoDisciplina === "ACTIVO" ? "✓ Habilitado" : "⚠ Sancionado"}
                    </span>
                  </div>
                )}

                {/* Foto o Iniciales */}
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md mt-6 flex-shrink-0">
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
                <h4 className="text-center font-bold text-lg mt-3 flex-shrink-0">
                  {ent.nombres} {ent.apellidos}
                </h4>

                {/* Academia */}
                <p className="text-center text-sm text-gray-500 mt-1 flex-shrink-0">
                  {ent.nombreAcademia || "Sin academia asignada"}
                </p>

                {/* Badge de licencia */}
                {ent.licencia && (
                  <div className="text-center mt-2 flex-shrink-0">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                      Lic: {ent.licencia}
                    </span>
                  </div>
                )}

                {/* Datos del entrenador - Crece */}
                <div className="mt-4 text-sm text-gray-700 space-y-2 bg-gray-50 rounded-lg p-3 flex-grow">
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

                {/* Fecha de registro - Altura fija */}
                <div className="mt-3 flex-shrink-0 h-5">
                  {ent.fechaRegistro && (
                    <p className="text-xs text-gray-400 text-center">
                      Registrado: {formatDate(ent.fechaRegistro)}
                    </p>
                  )}
                </div>

                {/* Ver Entrenador - Siempre al final */}
                <Link
                  to={`/entrenadores/${ent.id}`}
                  className="mt-4 block w-full text-center bg-gray-900 hover:bg-black text-white border rounded-xl py-2.5 text-sm font-medium transition flex-shrink-0"
                >
                  Ver detalles →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          !loading && entrenadores?.length === 0 && (
            // Estado vacío
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No hay entrenadores registrados
              </h3>
              <p className="text-gray-600">
                Los entrenadores se registran desde cada academia
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}