import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Link } from "react-router";
import { useAcademias } from "../../hooks/Academia/useAcademia";

const getInitials = (nombre?: string) => {
  if (!nombre) return "AC";
  const words = nombre.split(" ");
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};

export default function AcademiasList() {
  const { academias, fetchAcademias, loading } = useAcademias();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAcademias = async () => {
      try {
        await fetchAcademias();
      } catch (err) {
        setError("Error al cargar las academias");
        console.error(err);
      }
    };
    loadAcademias();
  }, []);

  // Filtrar academias por búsqueda y estado
  const filteredAcademias = academias?.filter((academia) => {
    // Filtro por búsqueda
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      academia.nombreAcademia?.toLowerCase().includes(searchLower) ||
      academia.nombreRepresentante?.toLowerCase().includes(searchLower) ||
      academia.dniRepresentante?.toLowerCase().includes(searchLower);

    // Filtro por estado
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && academia.activo) ||
      (filterStatus === "inactive" && !academia.activo);

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
        <PageMeta title="Cargando..." description="Cargando academias" />
        <div className="animate-pulse">
          <div className="w-full h-64 bg-gray-200 rounded-xl mb-8"></div>
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <div className="h-8 bg-gray-200 rounded w-40"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <PageMeta title="Error" description="Error al cargar academias" />
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
        title="Academias | Copa Gol Perú 2025" 
        description="En esta página se mostrarán todas las academias registradas."
      />

      {/* Banner de Copa */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8 shadow-lg">
        <img
          src="/images/logo/portada.jpg"
          alt="Banner Copa Gol"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/70 to-yellow-400/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-2xl md:text-4xl font-bold drop-shadow-2xl mb-2">
            Copa Gol Perú 2025
          </h2>
          <p className="text-sm md:text-lg drop-shadow-lg mb-4">
            📅 Octubre 10 - Octubre 26, 2025
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <span className="px-4 py-2 bg-white/25 backdrop-blur-md rounded-full text-sm md:text-base font-medium shadow-lg">
              ⚽ 16 Equipos
            </span>
            <span className="px-4 py-2 bg-white/25 backdrop-blur-md rounded-full text-sm md:text-base font-medium shadow-lg">
              🏟️ 32 Partidos
            </span>
            <span className="px-4 py-2 bg-white/25 backdrop-blur-md rounded-full text-sm md:text-base font-medium shadow-lg">
              🏆 4 Grupos
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Academias Registradas</h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredAcademias?.length || 0} de {academias?.length || 0} academia{academias?.length !== 1 ? 's' : ''}
            </p>
          </div>

          <Link
            to="/formAcademia"
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar Academia
          </Link>
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
                placeholder="Buscar por nombre, representante o DNI..."
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
                Todas
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterStatus === "active"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Activas
              </button>
              <button
                onClick={() => setFilterStatus("inactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterStatus === "inactive"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Inactivas
              </button>
            </div>

            {/* Botón limpiar */}
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
        {filteredAcademias && filteredAcademias.length === 0 && academias && academias.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center mb-6">
            <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-bold text-yellow-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-yellow-700 mb-4">
              No hay academias que coincidan con tu búsqueda
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

        {/* Grid de academias */}
        {filteredAcademias && filteredAcademias.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAcademias.map((item) => (
              <div
                key={item.id}
                className="relative bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
              >
                {/* Botón Editar */}
                <Link
                  to={`/formAcademia/edit/${item.id}`}
                  className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-sm transition z-10"
                  title="Editar Academia"
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

                {/* Logo o Iniciales */}
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-gray-200 overflow-hidden shadow-md">
                  {item.logoUrl ? (
                    <img 
                      src={item.logoUrl} 
                      alt={item.nombreAcademia}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(item.nombreAcademia)}
                    </div>
                  )}
                </div>

                {/* Nombre y estado */}
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-lg">{item.nombreAcademia}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full mt-2 inline-block font-medium ${
                      item.activo 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.activo ? "Activa" : "Inactiva"}
                  </span>
                </div>

                {/* Información del representante */}
                <div className="mt-4 text-sm text-gray-700 space-y-2 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p><strong>Representante:</strong> {item.nombreRepresentante}</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <p><strong>DNI:</strong> {item.dniRepresentante}</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p><strong>Teléfono:</strong> {item.telefonoRepresentante}</p>
                  </div>
                </div>

                {/* Categorías registradas */}
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-xs font-medium">
                      <span className="font-bold text-base">{item.totalEquipos}</span> Categoría{item.totalEquipos !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Ver academia */}
                <Link
                  to={`/academias/${item.id}`}
                  className="mt-4 block w-full text-center bg-gray-900 hover:bg-black text-white border rounded-xl py-2.5 text-sm font-medium transition"
                >
                  Ver academia →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          !loading && academias?.length === 0 && (
            // Estado vacío inicial
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No hay academias registradas
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza registrando la primera academia para la Copa Gol Perú 2025
              </p>
              <Link
                to="/formAcademia"
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-2.5 px-5 text-sm font-medium text-white shadow-md transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar primera academia
              </Link>
            </div>
          )
        )}
      </div>
    </>
  );
}