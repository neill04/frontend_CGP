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
  const { jugadores, fetchJugadores, getJugadoresRefuerzo, registerRefuerzo, removeRefuerzo } = useJugadores(academiaId!, equipoId!);
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
  const [showRefuerzos, setShowRefuerzos] = useState(false);
  const [jugadoresRefuerzo, setJugadoresRefuerzo] = useState<any[]>([]);
  const [loadingRefuerzos, setLoadingRefuerzos] = useState(false);
  const [registrandoRefuerzo, setRegistrandoRefuerzo] = useState<string | null>(null);
  
  // Estados para modales de confirmación
  const [showConfirmRegister, setShowConfirmRegister] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedJugador, setSelectedJugador] = useState<any>(null);

  const listaRefuerzos = jugadores?.filter(j => j.equipoId !== equipoId) || [];
  const totalRefuerzos = listaRefuerzos.length;
  const cuposDisponibles = 3 - totalRefuerzos;
  const limiteAlcanzado = totalRefuerzos >= 3;

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
      const nombreArchivo = `${equipo.nombreAcademia}_${equipo.categoria}.xlsx`
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_.-]/g, '');
      
      await downloadPlanilla(equipoId, nombreArchivo);
      showToast("¡Planilla descargada exitosamente!", "success");
    } catch (err) {
      showToast("Error al descargar la planilla. Intenta nuevamente.", "error");
      console.error(err);
    } finally {
      setDownloadingPlanilla(false);
    }
  };

  const handleToggleRefuerzos = async () => {
    if (limiteAlcanzado && !showRefuerzos) {
      showToast("Límite alcanzado: Máximo 3 refuerzos por equipo.", "info");
      return;
    }
    
    if (!showRefuerzos) {
      setLoadingRefuerzos(true);
      try {
        const refuerzos = await getJugadoresRefuerzo();
        setJugadoresRefuerzo(refuerzos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRefuerzos(false);
      }
    }
    setShowRefuerzos(!showRefuerzos);
  };

  const handleOpenConfirmRegister = (jugador: any) => {
    setSelectedJugador(jugador);
    setShowConfirmRegister(true);
  };

  const handleConfirmRegister = async () => {
    if (!selectedJugador) return;
    
    setRegistrandoRefuerzo(selectedJugador.id);
    try {
      await registerRefuerzo(selectedJugador.id);
      showToast("¡Refuerzo registrado exitosamente!", "success");
      
      const refuerzos = await getJugadoresRefuerzo();
      setJugadoresRefuerzo(refuerzos || []);
      setShowConfirmRegister(false);
      setSelectedJugador(null);
    } catch (err) {
      showToast("Error al registrar el refuerzo. Intenta nuevamente.", "error");
      console.error(err);
    } finally {
      setRegistrandoRefuerzo(null);
    }
  };

  const handleOpenConfirmDelete = (jugador: any) => {
    setSelectedJugador(jugador);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedJugador) return;
    
    try {
      await removeRefuerzo(selectedJugador.id);
      showToast("Refuerzo eliminado exitosamente", "success");
      setShowConfirmDelete(false);
      setSelectedJugador(null);
    } catch (err) {
      showToast("Error al eliminar el refuerzo", "error");
      console.error(err);
    }
  };

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

      {/* Modal Confirmar Registro - Estilo FormJugador */}
      {showConfirmRegister && selectedJugador && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[99999] p-4">
          <div className="relative w-full max-w-[600px] rounded-3xl bg-white p-6 lg:p-8 shadow-2xl animate-scale-in">
            <button
              onClick={() => {
                setShowConfirmRegister(false);
                setSelectedJugador(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Confirmar Registro de Refuerzo</h3>
              </div>
              <p className="text-sm text-gray-500 ml-15">
                Revisa la información antes de confirmar
              </p>
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Datos del Jugador
              </h5>
              <div className="grid grid-cols-1 gap-4">
                {/* Datos Personales */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="mb-1 text-xs text-gray-500 font-medium">Nombre Completo</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedJugador.nombres} {selectedJugador.apellidos}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">DNI</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedJugador.dni}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">Categoría Actual</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedJugador.categoriaEquipo}</p>
                  </div>
                </div>

                {/* Advertencia */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-xs text-orange-600 font-medium mb-1">Información Importante</p>
                  <p className="text-sm text-orange-800">
                    El jugador podrá participar con este equipo manteniendo su categoría original.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmRegister(false);
                  setSelectedJugador(null);
                }}
                className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRegister}
                disabled={registrandoRefuerzo === selectedJugador.id}
                className="flex-1 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50"
              >
                {registrandoRefuerzo === selectedJugador.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  "Confirmar Registro"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación - Estilo FormJugador */}
      {showConfirmDelete && selectedJugador && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[99999] p-4">
          <div className="relative w-full max-w-[600px] rounded-3xl bg-white p-6 lg:p-8 shadow-2xl animate-scale-in">
            <button
              onClick={() => {
                setShowConfirmDelete(false);
                setSelectedJugador(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Confirmar Eliminación de Refuerzo</h3>
              </div>
              <p className="text-sm text-gray-500 ml-15">
                Esta acción no se puede deshacer
              </p>
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Datos del Jugador
              </h5>
              <div className="grid grid-cols-1 gap-4">
                {/* Datos Personales */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="mb-1 text-xs text-gray-500 font-medium">Nombre Completo</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedJugador.nombres} {selectedJugador.apellidos}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">DNI</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedJugador.dni}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">Categoría Original</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedJugador.categoriaEquipo}</p>
                  </div>
                </div>

                {/* Advertencia */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs text-red-600 font-medium mb-1">Advertencia</p>
                  <p className="text-sm text-red-800">
                    El jugador regresará únicamente a su equipo original y no podrá participar más con este equipo como refuerzo.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmDelete(false);
                  setSelectedJugador(null);
                }}
                className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none">
          <div className={`rounded-lg shadow-2xl p-6 flex items-center gap-4 min-w-[350px] max-w-md pointer-events-auto animate-scale-in ${
            toast.type === "success" ? "bg-green-500 text-white" :
            toast.type === "error" ? "bg-red-500 text-white" :
            "bg-blue-500 text-white"
          }`}>
            {toast.type === "success" && (
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {toast.type === "error" && (
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            {toast.type === "info" && (
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <p className="text-lg font-semibold">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast({ ...toast, show: false })} 
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6 p-6">
        <nav className="text-sm text-gray-600">
          <Link to={`/academias/${academiaId}`} className="hover:text-black">
            ← Volver a {equipo.nombreAcademia}
          </Link>
        </nav>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{equipo.nombreAcademia}</h1>
              <p className="text-gray-600 text-sm mt-1">Categoría {equipo.categoria}</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                Total Jugadores: {jugadores?.length || 0} 
              </span>
              <span className={`px-3 py-1 rounded-full font-bold shadow-sm ${
                limiteAlcanzado 
                ? "bg-red-100 text-red-700 border border-red-200" 
                : "bg-orange-100 text-orange-700 border border-orange-200"
              }`}>
                Refuerzos: {totalRefuerzos} / 3 {limiteAlcanzado ? '(Lleno)' : `(${cuposDisponibles} cupos)`}
              </span>
            </div>
          </div>
        </div>

        {/* INFORMACIÓN DEL ENTRENADOR Y DELEGADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD ENTRENADOR */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="font-bold text-lg">Entrenador</h3>
            </div>

            {/* VALIDACIÓN: ¿Tiene entrenador asignado? */}
            {equipo.nombresEntrenador ? (
              <div className="flex items-start gap-4">
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
            ) : (
              // ESTADO VACÍO - ENTRENADOR
              <div className="flex-1 bg-amber-50 border border-dashed border-amber-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm text-amber-800 font-medium mb-4">
                  Este equipo aún no tiene un entrenador asignado.
                </p>
                <Link 
                  to={`/academias/${academiaId}/formEntrenador`} 
                  state={{ equipoDestinoId: equipoId }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 hover:bg-amber-50 text-amber-700 text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Asignar Entrenador
                </Link>
              </div>
            )}
          </div>

          {/* CARD DELEGADO */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-bold text-lg">Delegado</h3>
            </div>

            {/* VALIDACIÓN: ¿Tiene delegado asignado? */}
            {equipo.nombresDelegado ? (
              <div className="flex items-start gap-4">
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
            ) : (
              // ESTADO VACÍO - DELEGADO
              <div className="flex-1 bg-amber-50 border border-dashed border-amber-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm text-amber-800 font-medium mb-4">
                  Este equipo aún no tiene un delegado asignado.
                </p>
                <Link 
                  to={`/academias/${academiaId}/formDelegado`} 
                  state={{ equipoDestinoId: equipoId }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 hover:bg-amber-50 text-amber-700 text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Asignar Delegado
                </Link>
              </div>
            )}
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
            <button
              onClick={handleToggleRefuerzos}
              disabled={limiteAlcanzado && !showRefuerzos}
              className={`inline-flex items-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium text-white shadow-md transition-all ${
                limiteAlcanzado && !showRefuerzos
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              {showRefuerzos ? 'Ocultar Refuerzos' : 'Registrar Refuerzo'}
            </button>
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

        {/* SECCIÓN DE REFUERZOS */}
        {showRefuerzos && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              <h3 className="text-xl font-bold text-orange-900">
                Jugadores Disponibles para Refuerzo
              </h3>
            </div>
            <p className="text-sm text-orange-700 mb-4">
              Jugadores de la categoría anterior disponibles para registrarse como refuerzos
            </p>

            {loadingRefuerzos ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-8 w-8 text-orange-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-orange-700">Cargando jugadores...</p>
              </div>
            ) : jugadoresRefuerzo.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-20 h-20 text-orange-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-lg font-bold text-orange-900 mb-2">
                  No hay jugadores disponibles
                </h4>
                <p className="text-orange-700">
                  La categoría inferior no existe o no tiene jugadores registrados
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jugadoresRefuerzo.map((jug) => (
                  <div
                    key={jug.id}
                    className="relative bg-white border-2 border-orange-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
                  >
                    {jug.numeroCamiseta && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                        {jug.numeroCamiseta}
                      </div>
                    )}
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-md mt-8">
                      {getInitials(jug.nombres, jug.apellidos)}
                    </div>
                    <h4 className="text-center font-bold text-lg mt-3">
                      {jug.nombres} {jug.apellidos}
                    </h4>
                    <div className="text-center mt-2">
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-orange-100 text-orange-700">
                        {jug.categoriaEquipo}
                      </span>
                    </div>
                    <div className="mt-4 text-sm text-gray-700 space-y-2 bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <p><strong>DNI:</strong> {jug.dni}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p><strong>Nacimiento:</strong> {formatDate(jug.fechaNacimiento)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenConfirmRegister(jug)}
                      disabled={registrandoRefuerzo === jug.id}
                      className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white border rounded-xl py-2.5 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {registrandoRefuerzo === jug.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registrando...
                        </span>
                      ) : (
                        'Registrar como Refuerzo'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LISTA DE JUGADORES */}
        {jugadores && jugadores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jugadores.map((jug) => {
              const esRefuerzo = jug.equipoId !== equipoId;
              
              return (
                <div
                  key={jug.id}
                  className={`relative border-2 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all ${
                    esRefuerzo ? "bg-white border-orange-200" : "bg-white border-gray-100"
                  }`}
                >
                  {jug.numeroCamiseta && (
                    <div className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md text-white ${
                      esRefuerzo ? "bg-orange-500" : "bg-red-500"
                    }`}>
                      {jug.numeroCamiseta}
                    </div>
                  )}

                  {/* Botón Eliminar Refuerzo - Solo para refuerzos */}
                  {esRefuerzo && isAdmin() && (
                    <button
                      onClick={() => handleOpenConfirmDelete(jug)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
                      title="Eliminar refuerzo"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}

                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md mt-8 ${
                    esRefuerzo ? "bg-gradient-to-br from-orange-500 to-orange-600" : "bg-gradient-to-br from-blue-500 to-blue-600"
                  }`}>
                    {getInitials(jug.nombres, jug.apellidos)}
                  </div>

                  <h4 className="text-center font-bold text-lg mt-3">
                    {jug.nombres} {jug.apellidos}
                  </h4>

                  <div className="text-center mt-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      esRefuerzo ? "bg-orange-100 text-orange-700" : (jug.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")
                    }`}>
                      {esRefuerzo ? `Refuerzo - ${jug.categoriaEquipo}` : (jug.activo ? "Activo" : "Inactivo")}
                    </span>
                  </div>

                  <div className={`mt-4 text-sm space-y-2 rounded-lg p-3 ${esRefuerzo ? "bg-orange-50" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2">
                      <svg className={`w-4 h-4 ${esRefuerzo ? "text-orange-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <p className={esRefuerzo ? "text-orange-900" : "text-gray-700"}><strong>DNI:</strong> {jug.dni}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className={`w-4 h-4 ${esRefuerzo ? "text-orange-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className={esRefuerzo ? "text-orange-900" : "text-gray-700"}>
                        <strong>Nacimiento:</strong> {formatDate(jug.fechaNacimiento)}
                      </p>
                    </div>
                  </div>

                  {isAdmin() && (
                    <Link
                      to={`/academias/${academiaId}/equipos/${equipoId}/jugadores/${jug.id}`}
                      className={`mt-4 block w-full text-center border rounded-xl py-2.5 text-sm font-medium transition text-white ${
                        esRefuerzo ? "bg-orange-600 hover:bg-orange-700 shadow-orange-200" : "bg-gray-900 hover:bg-black"
                      }`}
                    >
                      Ver detalles →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
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
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}