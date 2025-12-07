import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { useEntrenadores } from "../../hooks/Academia/useEntrenador";
import { EntrenadorDTO } from "../../api/entrenadorApi";
import EntrenadorInfoCard from "../../components/UserProfile/EntrenadorInfoCard";

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

export default function EntrenadorProfile() {
  const { academiaId, entrenadorId } = useParams<{ academiaId: string, entrenadorId: string }>();
  const { getEntrenador } = useEntrenadores(academiaId!);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [entrenador, setEntrenador] = useState<EntrenadorDTO>({
    dni: "",
    apellidos: "",
    nombres: "",
    licencia: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    fotoUrl: "",
    nombreAcademia: "",
  });

  useEffect(() => {
    const fetchEntrenadorData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEntrenador(entrenadorId!);
        if (data) {
          setEntrenador(data);
        }
      } catch (err) {
        setError("Error al cargar la información del entrenador");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntrenadorData();
  }, [entrenadorId]);

  // Loading State
  if (loading) {
    return (
      <>
        <PageMeta title="Cargando..." description="Cargando perfil del entrenador" />
        <PageBreadcrumb pageTitle="Perfil del Entrenador" />
        <div className="space-y-6 animate-pulse">
          <div className="rounded-2xl border border-gray-200 bg-gray-200 h-48"></div>
          <div className="rounded-2xl border border-gray-200 bg-gray-200 h-96"></div>
        </div>
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <PageMeta title="Error" description="Error al cargar perfil" />
        <PageBreadcrumb pageTitle="Perfil del Entrenador" />
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
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${entrenador.nombres} ${entrenador.apellidos} - Perfil`}
        description="Información completa del entrenador"
      />
      <PageBreadcrumb pageTitle="Perfil del Entrenador" />

      {/* Breadcrumb de navegación */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link to={`/academias/${academiaId}`} className="hover:text-black">
          ← Volver a {entrenador.nombreAcademia || "Academia"}
        </Link>
      </nav>

      <div className="space-y-6">
        {/* Card de Meta/Header con foto */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
              {/* Foto o Iniciales */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-md flex-shrink-0">
                {entrenador.fotoUrl ? (
                  <img 
                    src={entrenador.fotoUrl} 
                    alt={`${entrenador.nombres} ${entrenador.apellidos}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials(entrenador.nombres, entrenador.apellidos)}
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className="text-center lg:text-left">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {entrenador.nombres} {entrenador.apellidos}
                </h4>
                
                <div className="flex flex-col lg:flex-row items-center gap-3 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-medium">{entrenador.nombreAcademia}</span>
                  </div>
                  
                  {entrenador.licencia && (
                    <>
                      <div className="hidden lg:block h-4 w-px bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span>Licencia: {entrenador.licencia}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {entrenador.estadoDisciplina && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      entrenador.estadoDisciplina === "ACTIVO"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {entrenador.estadoDisciplina}
                    </span>
                  )}
                  {/*
                  {entrenador.activo !== undefined && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      entrenador.activo
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {entrenador.activo ? "Disponible" : "No disponible"}
                    </span>
                  )}
                  */}
                </div>
              </div>
            </div>

            {/* Botón de acciones rápidas */}
            <div className="flex gap-2">
              <Link
                to={`/academias/${academiaId}/entrenadores`}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </Link>
            </div>
          </div>
        </div>

        {/* Card de información detallada con edición */}
        <EntrenadorInfoCard 
          academiaId={academiaId!} 
          entrenadorId={entrenadorId!}
          onUpdate={(updatedData) => setEntrenador(updatedData)}
        />

        {/* Card adicional con estadísticas o información extra */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información Adicional
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500 mb-1">Fecha de Nacimiento</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(entrenador.fechaNacimiento)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <div>
                <p className="text-xs text-gray-500 mb-1">DNI</p>
                <p className="text-sm font-medium text-gray-800">{entrenador.dni}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-800 break-all">
                  {entrenador.email || "No registrado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                <p className="text-sm font-medium text-gray-800">
                  {entrenador.telefono || "No registrado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
