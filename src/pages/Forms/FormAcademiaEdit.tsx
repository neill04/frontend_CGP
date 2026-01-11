import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useAcademias } from "../../hooks/Academia/useAcademia";
import { AcademiaDTO } from "../../api/academiaApi";
import { uploadToCloudinary } from "../../utils/uploadImage";

type ToastType = "success" | "error" | "info";

interface FormInputs {
  nombreAcademia: string;
  nombreRepresentante: string;
  dniRepresentante: string;
  telefonoRepresentante: string;
  liga: string;
  distritoId?: number;
  activo: boolean;
  logoFile?: FileList;
}

export default function FormEditAcademia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAcademia, updateAcademia, loading } = useAcademias();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
  } = useForm<FormInputs>({
    mode: "onChange",
    defaultValues: {
      activo: true
    }
  });

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: "",
    type: "info"
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<FormInputs | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentAcademia, setCurrentAcademia] = useState<AcademiaDTO | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchAcademia = async () => {
      if (!id) return;
      
      try {
        setLoadingData(true);
        const data = await getAcademia(id); 

        if (!data) {
          showToast("No se encontró la información de la academia", "error");
          navigate('/academias'); 
          return;
        }

        setCurrentAcademia(data);
        
        reset({
          nombreAcademia: data.nombreAcademia,
          nombreRepresentante: data.nombreRepresentante,
          dniRepresentante: data.dniRepresentante,
          telefonoRepresentante: data.telefonoRepresentante,
          liga: data.liga,
          activo: data.activo ?? true
        });
        
        if (data.logoUrl) {
          setPreviewLogo(data.logoUrl);
        }
        
      } catch (err) {
        console.error(err);
        showToast("Error al cargar los datos de la academia", "error");
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchAcademia();
  }, [id, reset, navigate]); 

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 4000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewLogo("");
    }
  };

  const onSubmit = (data: FormInputs) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    if (!pendingData || !id) return;

    setShowConfirmModal(false);
    
    try {
      let logoUrl = previewLogo;

      if (selectedFile) {
        console.log("📤 Subiendo nuevo logo...");
        logoUrl = await uploadToCloudinary(selectedFile);
        console.log("✅ Logo subido:", logoUrl);
      }

      const payload: AcademiaDTO = {
        id,
        nombreAcademia: pendingData.nombreAcademia,
        nombreRepresentante: pendingData.nombreRepresentante,
        dniRepresentante: pendingData.dniRepresentante,
        telefonoRepresentante: pendingData.telefonoRepresentante,
        liga: pendingData.liga,
        activo: pendingData.activo,
        logoUrl: logoUrl || ""
      };

      await updateAcademia(id, payload);
      
      showToast("¡Academia actualizada exitosamente!", "success");

    } catch (err: any) {
      const errorMessage = err.message || "Error al actualizar la academia. Intenta nuevamente.";
      showToast(errorMessage, "error");
    }
  };

  const handleCancel = () => {
    navigate('/academias');
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="Editar Academia"
        description="Página para editar los datos de la academia"
      />
      
      <PageBreadcrumb pageTitle="Editar Academia" />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
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

      {/* Confirmation Modal */}
      {showConfirmModal && pendingData && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[9999] p-4">
          <div className="relative w-full max-w-[600px] rounded-3xl bg-white p-6 lg:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowConfirmModal(false)}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Confirmar Actualización</h3>
              </div>
              <p className="text-sm text-gray-500 ml-15">
                Revisa los cambios antes de confirmar
              </p>
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Datos Actualizados
              </h5>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="mb-1 text-xs text-gray-500 font-medium">Nombre de la Academia</p>
                  <p className="text-sm font-semibold text-gray-800">{pendingData.nombreAcademia}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="mb-1 text-xs text-gray-500 font-medium">Liga</p>
                  <p className="text-sm font-semibold text-gray-800">{pendingData.liga}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="mb-1 text-xs text-gray-500 font-medium">Representante</p>
                  <p className="text-sm font-semibold text-gray-800">{pendingData.nombreRepresentante}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">DNI</p>
                    <p className="text-sm font-semibold text-gray-800">{pendingData.dniRepresentante}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">Teléfono</p>
                    <p className="text-sm font-semibold text-gray-800">{pendingData.telefonoRepresentante}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  pendingData.activo ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`mb-1 text-xs font-medium ${
                    pendingData.activo ? 'text-green-600' : 'text-red-600'
                  }`}>Estado</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {pendingData.activo ? 'Activo' : 'Inactivo'}
                  </p>
                </div>

                {previewLogo && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="mb-2 text-xs text-blue-600 font-medium">Logo</p>
                    <img 
                      src={previewLogo} 
                      alt="Preview" 
                      style={{ width: '96px', height: '96px', objectFit: 'contain', backgroundColor: '#f0f0f0', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSubmit}
                disabled={loading}
                className="flex-1 px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </span>
                ) : (
                  "Confirmar Actualización"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="space-y-6">
            
            {/* Información del Sistema */}
            {currentAcademia && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información del Sistema
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="block text-xs font-medium text-blue-600 mb-1">
                      Fecha de Registro
                    </label>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {currentAcademia.fechaRegistro 
                        ? formatFecha(currentAcademia.fechaRegistro) 
                        : "—"}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <label className="block text-xs font-medium text-purple-600 mb-1">
                      Última Actualización
                    </label>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {currentAcademia.fechaActualizacion 
                        ? formatFecha(currentAcademia.fechaActualizacion) 
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Estado de la Academia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Estado de la Academia
              </h3>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register("activo")}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">
                      Academia {watch("activo") ? "Activa" : "Inactiva"}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {watch("activo") 
                        ? "La academia puede registrar equipos y participar en torneos" 
                        : "La academia no puede registrar nuevos equipos ni participar"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    watch("activo") 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {watch("activo") ? "ACTIVO" : "INACTIVO"}
                  </span>
                </label>
              </div>
            </div>

            {/* Información de la Academia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Información de la Academia
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Academia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("nombreAcademia", {
                    required: "El nombre de la academia es requerido",
                    minLength: {
                      value: 3,
                      message: "Debe tener al menos 3 caracteres"
                    },
                    maxLength: {
                      value: 100,
                      message: "No puede exceder 100 caracteres"
                    }
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                    errors.nombreAcademia ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.nombreAcademia && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombreAcademia.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liga <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("liga", {
                    required: "La liga es requerida",
                    minLength: {
                      value: 3,
                      message: "Debe tener al menos 3 caracteres"
                    }
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                    errors.liga ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.liga && (
                  <p className="mt-1 text-sm text-red-600">{errors.liga.message}</p>
                )}
              </div>
            </div>

            {/* Información del Representante */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Datos del Representante
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("nombreRepresentante", {
                    required: "El nombre del representante es requerido",
                    minLength: {
                      value: 3,
                      message: "Debe tener al menos 3 caracteres"
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: "Solo se permiten letras"
                    }
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                    errors.nombreRepresentante ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.nombreRepresentante && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombreRepresentante.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("dniRepresentante", {
                      required: "El DNI es requerido",
                      pattern: {
                        value: /^[0-9]{8}$/,
                        message: "Debe tener exactamente 8 dígitos"
                      }
                    })}
                    maxLength={8}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                      errors.dniRepresentante ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.dniRepresentante && (
                    <p className="mt-1 text-sm text-red-600">{errors.dniRepresentante.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("telefonoRepresentante", {
                      required: "El teléfono es requerido",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Debe tener exactamente 9 dígitos"
                      }
                    })}
                    maxLength={9}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                      errors.telefonoRepresentante ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.telefonoRepresentante && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefonoRepresentante.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Logo (Opcional)
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subir Logo
                </label>
                
                {!previewLogo ? (
                  <label className="cursor-pointer block">
                    <div className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          Click para subir imagen
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG hasta 5MB
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("logoFile")}
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <label className="cursor-pointer">
                        <img 
                          src={previewLogo} 
                          alt="Logo de la academia" 
                          style={{ width: '200px', height: '200px', objectFit: 'contain', backgroundColor: '#f0f0f0', borderRadius: '8px', border: '2px solid #e5e7eb' }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewLogo("");
                          setSelectedFile(null);
                          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition flex items-center gap-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar imagen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={loading || !isValid || !isDirty}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Actualizar Academia
                  </>
                )}
              </button>
            </div>

            {!isDirty && (
              <div className="text-xs text-amber-600 text-center pt-2 flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                No hay cambios para guardar
              </div>
            )}
          </div>
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
    </div>
  );
}