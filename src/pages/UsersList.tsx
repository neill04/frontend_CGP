import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PageMeta from "../components/common/PageMeta";
import { useAdmin } from "../hooks/useAdmin";
import { UserRequest } from "../api/adminApi";
import { useAcademias } from "../hooks/Academia/useAcademia";
import { asignarAcademiaAUsuario, toggleUserStatus } from "../api/adminApi";
import { UserInfo } from "../context/AuthContext";

type ToastType = "success" | "error" | "info";

export default function UserManagement() {
  const { registerUsuario, fetchUsuarios, usuarios, loading, error } = useAdmin();
  const { academias, fetchAcademias } = useAcademias();
  
  const [showModal, setShowModal] = useState(false);
  const [showAcademiaModal, setShowAcademiaModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [selectedAcademiaId, setSelectedAcademiaId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [isBulkDeactivating, setIsBulkDeactivating] = useState(false);
  
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: "",
    type: "info"
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm<UserRequest>({
    defaultValues: {
      username: "",
      password: "",
      role: "ACADEMIA",
    },
    mode: "onChange",
  });

  useEffect(() => {
    fetchUsuarios();
    fetchAcademias();
  }, []);

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 4000);
  };

  const onSubmit = async (data: UserRequest) => {
    try {
      await registerUsuario(data);
      showToast("¡Usuario registrado exitosamente!", "success");
      setShowModal(false);
      reset();
      fetchUsuarios();
    } catch (err: any) {
      const errorMessage = 
        err?.response?.data?.mensaje || 
        err?.response?.data?.message ||
        error || 
        "Error al registrar el usuario";
      showToast(errorMessage, "error");
    }
  };

  const handleOpenAcademiaModal = (usuario: UserInfo) => {
    setSelectedUser(usuario);
    setSelectedAcademiaId(usuario.academiaId || "");
    setShowAcademiaModal(true);
  };

  const handleAssignAcademia = async () => {
    if (!selectedUser || !selectedAcademiaId) {
      showToast("Por favor selecciona una academia", "error");
      return;
    }

    setIsAssigning(true);
    try {
      await asignarAcademiaAUsuario(selectedUser.id, { academiaId: selectedAcademiaId });
      showToast("¡Academia asignada exitosamente!", "success");
      setShowAcademiaModal(false);
      setSelectedUser(null);
      setSelectedAcademiaId("");
      fetchUsuarios();
    } catch (err: any) {
      const errorMessage = 
        err?.response?.data?.mensaje || 
        err?.response?.data?.message ||
        "Error al asignar la academia";
      showToast(errorMessage, "error");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleOpenConfirmModal = (usuario: UserInfo) => {
    setSelectedUser(usuario);
    setShowConfirmModal(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;

    setTogglingUserId(selectedUser.id);
    setShowConfirmModal(false);
    
    try {
      await toggleUserStatus(selectedUser.id);
      const successMessage = selectedUser.activo 
        ? "Usuario inactivado exitosamente" 
        : "Usuario activado exitosamente";
      showToast(successMessage, "success");
      fetchUsuarios();
    } catch (err: any) {
      const errorMessage = 
        err?.response?.data?.mensaje || 
        err?.response?.data?.message ||
        "Error al cambiar el estado del usuario";
      showToast(errorMessage, "error");
    } finally {
      setTogglingUserId(null);
      setSelectedUser(null);
    }
  };

  const handleBulkDeactivate = async () => {
    setShowBulkConfirmModal(false);
    setIsBulkDeactivating(true);

    const academiaUsers = usuarios.filter(
      u => (u.role === "ACADEMIA" || u.role === "Academia") && u.activo !== false
    );

    try {
      let success = 0;
      let failed = 0;

      for (const user of academiaUsers) {
        try {
          await toggleUserStatus(user.id);
          success++;
        } catch {
          failed++;
        }
      }

      if (failed === 0) {
        showToast(`${success} usuarios de academia inactivados exitosamente`, "success");
      } else {
        showToast(`${success} usuarios inactivados, ${failed} fallaron`, "error");
      }
      
      fetchUsuarios();
    } catch (err) {
      showToast("Error al inactivar usuarios", "error");
    } finally {
      setIsBulkDeactivating(false);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "ADMINISTRADOR" || role === "ADMIN") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Administrador
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Academia
      </span>
    );
  };

  const activeAcademiaUsers = usuarios.filter(
    u => (u.role === "ACADEMIA" || u.role === "Academia") && u.activo !== false
  ).length;

  return (
    <>
      <PageMeta
        title="Gestión de Usuarios"
        description="Administración de usuarios del sistema"
      />

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

      {/* Modal de Confirmación Toggle */}
      {showConfirmModal && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-[99999] p-4">
          <div className="relative w-full max-w-[450px] rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
            <div className="mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                selectedUser.activo ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {selectedUser.activo ? (
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {selectedUser.activo ? '¿Inactivar Usuario?' : '¿Activar Usuario?'}
              </h3>
              
              <p className="text-gray-600 text-center mb-4">
                <span className="font-semibold text-gray-900">{selectedUser.username}</span>
              </p>

              {selectedUser.activo ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800 flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                      Este usuario no podrá iniciar sesión hasta que lo actives nuevamente.
                    </span>
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800 flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      El usuario podrá iniciar sesión nuevamente en el sistema.
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmToggle}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition ${
                  selectedUser.activo 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedUser.activo ? 'Sí, Inactivar' : 'Sí, Activar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación Bulk */}
      {showBulkConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-[99999] p-4">
          <div className="relative w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                ¿Inactivar Todos los Usuarios de Academia?
              </h3>
              
              <p className="text-gray-600 text-center mb-4">
                Estás a punto de inactivar <span className="font-bold text-orange-600">{activeAcademiaUsers} usuarios</span>
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-orange-800 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>
                    <strong>Advertencia:</strong> Todos los usuarios con rol de Academia activos no podrán iniciar sesión hasta que los actives manualmente.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkConfirmModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkDeactivate}
                className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium text-white transition"
              >
                Sí, Inactivar Todos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Asignar Academia */}
      {showAcademiaModal && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[99999] p-4">
          <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 lg:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowAcademiaModal(false);
                setSelectedUser(null);
                setSelectedAcademiaId("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">Asignar Academia</h3>
                  <p className="text-sm text-gray-500">Usuario: {selectedUser.username}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedUser.nombreAcademia && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Academia actual: <span className="font-semibold">{selectedUser.nombreAcademia}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecciona una Academia <span className="text-red-500">*</span>
                </label>
                
                {academias.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-gray-500 text-sm">No hay academias registradas</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {academias.map((academia) => (
                      <label
                        key={academia.id}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50 ${
                          selectedAcademiaId === academia.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="academia"
                          value={academia.id}
                          checked={selectedAcademiaId === academia.id}
                          onChange={(e) => setSelectedAcademiaId(e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          {academia.logoUrl ? (
                            <img 
                              src={academia.logoUrl} 
                              alt={academia.nombreAcademia}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {academia.nombreAcademia.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{academia.nombreAcademia}</p>
                            <p className="text-xs text-gray-500">{academia.nombreDistrito}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAcademiaModal(false);
                  setSelectedUser(null);
                  setSelectedAcademiaId("");
                }}
                className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignAcademia}
                disabled={isAssigning || !selectedAcademiaId}
                className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAssigning ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Asignando...
                  </span>
                ) : (
                  "Asignar Academia"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[99999] p-4">
          <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 lg:p-8 shadow-2xl">
            <button
              onClick={() => {
                setShowModal(false);
                reset();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Nuevo Usuario</h3>
              </div>
              <p className="text-sm text-gray-500 ml-15">
                Registra un nuevo usuario en el sistema
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="usuario123"
                  {...register("username", {
                    required: "El nombre de usuario es requerido",
                    minLength: {
                      value: 4,
                      message: "Debe tener al menos 4 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_-]+$/,
                      message: "Solo letras, números, guiones y guiones bajos",
                    },
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                    errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 6,
                      message: "Debe tener al menos 6 caracteres",
                    },
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("role", {
                    required: "El rol es requerido",
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                    errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="ACADEMIA">Academia</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
                
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {watch("role") === "ADMINISTRADOR" 
                        ? "Acceso total al sistema y gestión de usuarios"
                        : "Acceso a gestión de su academia (jugadores, equipos, etc.)"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    reset();
                  }}
                  className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || isSubmitting || !isValid}
                  className="flex-1 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading || isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrando...
                    </span>
                  ) : (
                    "Registrar Usuario"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header con botones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Usuarios del Sistema</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los usuarios y sus permisos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeAcademiaUsers > 0 && (
            <button
              onClick={() => setShowBulkConfirmModal(true)}
              disabled={isBulkDeactivating}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition shadow-sm disabled:opacity-50"
            >
              {isBulkDeactivating ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Inactivar Academias ({activeAcademiaUsers})
                </>
              )}
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Tabla Responsive */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Academia
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-sm text-gray-500">Cargando usuarios...</p>
                    </div>
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">No hay usuarios registrados</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Comienza registrando tu primer usuario
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {usuario.logoUrl ? (
                          <img 
                            src={usuario.logoUrl} 
                            alt={usuario.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {usuario.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{usuario.username}</p>
                          <p className="text-xs text-gray-500">ID: {usuario.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(usuario.role)}
                    </td>
                    <td className="px-6 py-4">
                      {usuario.nombreAcademia ? (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-sm text-gray-600">{usuario.nombreAcademia}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleOpenConfirmModal(usuario)}
                          disabled={togglingUserId === usuario.id}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            togglingUserId === usuario.id
                              ? 'opacity-50 cursor-not-allowed'
                              : usuario.activo !== false
                              ? 'bg-green-600 focus:ring-green-500'
                              : 'bg-gray-300 focus:ring-gray-400'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              usuario.activo !== false ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {(usuario.role === "ACADEMIA" || usuario.role === "Academia") && (
                          <button
                            onClick={() => handleOpenAcademiaModal(usuario)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {usuario.nombreAcademia ? 'Cambiar' : 'Asignar'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-gray-500 mt-3">Cargando usuarios...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">No hay usuarios</p>
                  <p className="text-sm text-gray-500 mt-1">Registra tu primer usuario</p>
                </div>
              </div>
            </div>
          ) : (
            usuarios.map((usuario) => (
              <div key={usuario.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {usuario.logoUrl ? (
                    <img 
                      src={usuario.logoUrl} 
                      alt={usuario.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                      {usuario.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{usuario.username}</p>
                    <p className="text-xs text-gray-500">ID: {usuario.id.substring(0, 8)}</p>
                  </div>
                  <button
                    onClick={() => handleOpenConfirmModal(usuario)}
                    disabled={togglingUserId === usuario.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      togglingUserId === usuario.id
                        ? 'opacity-50 cursor-not-allowed'
                        : usuario.activo !== false
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        usuario.activo !== false ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="space-y-2 ml-15">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Rol:</span>
                    {getRoleBadge(usuario.role)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Academia:</span>
                    {usuario.nombreAcademia ? (
                      <span className="text-xs text-gray-600">{usuario.nombreAcademia}</span>
                    ) : (
                      <span className="text-xs text-gray-400">Sin asignar</span>
                    )}
                  </div>

                  {(usuario.role === "ACADEMIA" || usuario.role === "Academia") && (
                    <button
                      onClick={() => handleOpenAcademiaModal(usuario)}
                      className="w-full mt-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {usuario.nombreAcademia ? 'Cambiar Academia' : 'Asignar Academia'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
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
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}