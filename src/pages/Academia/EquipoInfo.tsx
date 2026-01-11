import { useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { useEquipos } from "../../hooks/Academia/useEquipo";
import { EquipoDTO } from "../../api/equipoApi";
import { useJugadores } from "../../hooks/Academia/useJugador";
import { useAuthContext } from "../../context/AuthContext";

const getInitials = (nombres?: string, apellidos?: string) => {
  if (!nombres && !apellidos) return "";
  const n = nombres?.split(" ")[0] || "";
  const a = apellidos?.split(" ")[0] || "";
  return `${n[0] || ""}${a[0] || ""}`.toUpperCase();
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

export default function EquipoInfo() {
  const { academiaId, equipoId } = useParams<{ academiaId: string, equipoId: string }>();
  const { getEquipo, downloadPlanilla, loading: equipoLoading} = useEquipos(academiaId!);
  const { jugadores, fetchJugadores } = useJugadores(academiaId!, equipoId!);
  const { isAdmin } = useAuthContext();

  const [equipo, setEquipo] = useState<EquipoDTO>({
    categoria: "",
    colorCamiseta: "",
    nombreAcademia: "",
    dniEntrenador: "",
    apellidosEntrenador: "",
    nombresEntrenador: "",
    telefonoEntrenador: "",
    fotoUrlEntrenador: "",
    dniDelegado: "",
    apellidosDelegado: "",
    nombresDelegado: "",
    telefonoDelegado: "",
    fotoUrlDelegado: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPlanilla, setDownloadingPlanilla] = useState(false);

  // Toast para mensajes de descarga
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "info"
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 4000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (equipoId) {
          const data = await getEquipo(equipoId);
          if (data) setEquipo(data);
        }
        await fetchJugadores();
      } catch (err) {
        setError("Error al cargar la información del equipo");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [academiaId, equipoId]);

  const handleDownloadPlanilla = async () => {
    if (!equipoId) return;
    
    setDownloadingPlanilla(true);
    try {
      // Generar nombre del archivo: "NombreAcademia_Categoria.xlsx"
      const nombreArchivo = `${equipo.nombreAcademia}_${equipo.categoria}.xlsx`
        .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
        .replace(/[^a-zA-Z0-9_.-]/g, ''); // Eliminar caracteres especiales
      
      await downloadPlanilla(equipoId, nombreArchivo);
      showToast("¡Planilla descargada exitosamente!", "success");
    } catch (err) {
      showToast("Error al descargar la planilla. Intenta nuevamente.", "error");
      console.error(err);
    } finally {
      setDownloadingPlanilla(false);
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <>
        <PageMeta title="Cargando..." description="Cargando información del equipo" />
        <div className="space-y-6 p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-200 rounded-2xl h-32"></div>
            <div className="bg-gray-200 rounded-2xl h-32"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-64"></div>
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
        <PageMeta title="Error" description="Error al cargar información" />
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
        title={`${equipo.nombreAcademia} - ${equipo.categoria}`}
        description="Página que muestra una tabla con todos los jugadores registrados en el equipo"
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] ${
            toast.type === "success" ? "bg-green-500 text-white" :
            toast.type === "error" ? "bg-red-500 text-white" :
            "bg-blue-500 text-white"
          }`}>
            {toast.type === "success" && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === "error" && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="hover:opacity-80">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6 p-6">

        {/* BREADCRUMB */}
        <nav className="text-sm text-gray-600">
          <Link to={`/academias/${academiaId}`} className="hover:text-black">
            ← Volver a {equipo.nombreAcademia}
          </Link>
        </nav>

        {/* TÍTULO Y ESTADÍSTICAS */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {equipo.nombreAcademia}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Categoría {equipo.categoria}
              </p>
            </div>
            
            <div className="flex gap-3 text-xs">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                Total Jugadores: {jugadores?.length || 0} 
              </span>
            </div>
          </div>
        </div>

        {/* INFORMACIÓN DEL ENTRENADOR Y DELEGADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CARD ENTRENADOR */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="font-bold text-lg">Entrenador</h3>
            </div>

            <div className="flex items-start gap-4">
              {/* Foto del entrenador */}
              {equipo.fotoUrlEntrenador ? (
                <img 
                  src={equipo.fotoUrlEntrenador} 
                  alt={`${equipo.nombresEntrenador} ${equipo.apellidosEntrenador}`}
                  className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-blue-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                  {getInitials(equipo.nombresEntrenador, equipo.apellidosEntrenador)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base text-gray-900 truncate">
                  {equipo.nombresEntrenador} {equipo.apellidosEntrenador}
                </p>
                
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  {equipo.dniEntrenador && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span className="truncate"><strong>DNI:</strong> {equipo.dniEntrenador}</span>
                    </div>
                  )}
                  
                  {equipo.telefonoEntrenador && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="truncate"><strong>Teléfono:</strong> {equipo.telefonoEntrenador}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARD DELEGADO */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-bold text-lg">Delegado</h3>
            </div>

            <div className="flex items-start gap-4">
              {/* Foto del delegado */}
              {equipo.fotoUrlDelegado ? (
                <img 
                  src={equipo.fotoUrlDelegado} 
                  alt={`${equipo.nombresDelegado} ${equipo.apellidosDelegado}`}
                  className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-red-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                  {getInitials(equipo.nombresDelegado, equipo.apellidosDelegado)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base text-gray-900 truncate">
                  {equipo.nombresDelegado} {equipo.apellidosDelegado}
                </p>
                
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  {equipo.dniDelegado && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span className="truncate"><strong>DNI:</strong> {equipo.dniDelegado}</span>
                    </div>
                  )}
                  
                  {equipo.telefonoDelegado && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="truncate"><strong>Teléfono:</strong> {equipo.telefonoDelegado}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HEADER DE JUGADORES CON BOTONES */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Jugadores</h2>
          
          <div className="flex flex-wrap gap-3">
            {isAdmin() && (
              <button
              onClick={handleDownloadPlanilla}
              disabled={downloadingPlanilla || equipoLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 py-2.5 px-4 text-sm font-medium text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
              title="Descargar planilla del equipo"
            >
              {downloadingPlanilla ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Descargando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Descargar Planilla
                </>
              )}
            </button>
            )}

            {/* Botón Registrar Jugador */}
            <Link
              to={`/academias/${academiaId}/equipos/${equipoId}/jugadores`}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-2.5 px-4 text-sm font-medium text-white shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Registrar Jugador
            </Link>
          </div>
        </div>

        {/* LISTA DE JUGADORES */}
        {jugadores && jugadores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jugadores.map((jug) => (
              <div
                key={jug.id}
                className="relative bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
              >
                {/* Número de camiseta - Badge */}
                {jug.numeroCamiseta && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
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

                {/* Estado */}
                <div className="text-center mt-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      jug.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {jug.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>

                {/* Datos del jugador */}
                <div className="mt-4 text-sm text-gray-700 space-y-2 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <p><strong>DNI:</strong> {jug.dni}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p><strong>Nacimiento:</strong> {formatDate(jug.fechaNacimiento)}</p>
                  </div>
                </div>

                {isAdmin() && (
                  <Link
                  to={`/academias/${academiaId}/equipos/${equipoId}/jugadores/${jug.id}`}
                  className="mt-4 block w-full text-center bg-gray-900 hover:bg-black text-white border rounded-xl py-2.5 text-sm font-medium transition"
                  >
                  Ver detalles →
                  </Link>
                )}
              </div>
            ))}
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
              Comienza agregando jugadores a esta categoría
            </p>
            <Link
              to={`/academias/${academiaId}/equipos/${equipoId}/jugadores`}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-2.5 px-5 text-sm font-medium text-white shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Registrar Jugador
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}