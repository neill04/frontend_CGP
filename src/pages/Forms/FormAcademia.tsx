import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useAcademias } from "../../hooks/Academia/useAcademia";
import { AcademiaDTO } from "../../api/academiaApi";
import { useUbicacion } from "../../hooks/Academia/useUbicacion";
import { CLOUDINARY_FOLDERS, uploadToCloudinary } from "../../utils/uploadImage";

type ToastType = "success" | "error" | "info";

interface FormInputs {
  nombreAcademia: string;
  nombreRepresentante: string;
  dniRepresentante: string;
  telefonoRepresentante: string;
  liga: string;
  distritoId: number;
  logoFile?: FileList;
}

export default function FormAcademia() {
  const navigate = useNavigate();
  const { postAcademia, loading } = useAcademias();

  const {
    departamentos,
    provincias,
    distritos,
    selectedDepartamento,
    selectedProvincia,
    selectedDistrito,
    loading: loadingUbicacion,
    error: errorUbicacion,
    onDepartamentoChange,
    onProvinciaChange,
    onDistritoChange,
  } = useUbicacion();
  
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue
  } = useForm<FormInputs>({
    mode: "onChange",
    defaultValues: {
      nombreAcademia: "",
      nombreRepresentante: "",
      dniRepresentante: "",
      telefonoRepresentante: "",
      liga: "",
      distritoId: 0
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

  useEffect(() => {
    if (selectedDistrito) {
      setValue("distritoId", selectedDistrito, { shouldValidate: true });
    }
  }, [selectedDistrito, setValue]);

  // Mostrar toast
  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 4000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setSelectedFile(file); // ← Guardar el archivo en el estado
      
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
    setPendingData({
      ...data,
      logoFile: selectedFile as any 
    });
    
    setShowConfirmModal(true);
  };

  // Confirmar y enviar
  const confirmSubmit = async () => {
    if (!pendingData) return;
    
    setShowConfirmModal(false);
    
    try {
      let logoUrl = "";

      // Verificar si hay archivo guardado
      const file = selectedFile;
      if (file) {
        logoUrl = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.LOGOS);
      }

      const payload: AcademiaDTO = {
        nombreAcademia: pendingData.nombreAcademia,
        nombreRepresentante: pendingData.nombreRepresentante,
        dniRepresentante: pendingData.dniRepresentante,
        telefonoRepresentante: pendingData.telefonoRepresentante,
        liga: pendingData.liga,
        distritoId: pendingData.distritoId,
        logoUrl: logoUrl
      };

      await postAcademia(payload);
      showToast("¡Academia registrada exitosamente!", "success");
      
      // Resetear formulario
      reset();
      setPreviewLogo("");
      setPendingData(null);
      setSelectedFile(null); // ← Limpiar archivo

    } catch (err: any) {
      const errorMessage = err.message || "Error al registrar la academia. Intenta nuevamente.";
      showToast(errorMessage, "error");
    }
  };

  const handleCancel = () => {
    navigate('/academias');
  };

  const getDepartamentoNombre = () => {
    const dept = departamentos.find(d => d.id === selectedDepartamento);
    return dept?.nombre || "";
  };

  const getProvinciaNombre = () => {
    const prov = provincias.find(p => p.id === selectedProvincia);
    return prov?.nombre || "";
  };

  const getDistritoNombre = () => {
    const dist = distritos.find(d => d.id === selectedDistrito);
    return dist?.nombre || "";
  };

  return (
    <div>
      <PageMeta
        title="Registrar Academia"
        description="Página para registrar las academias"
      />
      
      <PageBreadcrumb pageTitle="Registrar Academia" />

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
          <div className="relative w-full max-w-[600px] rounded-3xl bg-white p-6 lg:p-8 shadow-2xl">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Confirmar Registro</h3>
              </div>
              <p className="text-sm text-gray-500 ml-15">
                Revisa la información antes de confirmar el registro
              </p>
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Datos de la Academia
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

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="mb-1 text-xs text-purple-600 font-medium">Ubicación</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {getDepartamentoNombre()} / {getProvinciaNombre()} / {getDistritoNombre()}
                  </p>
                </div>

                {previewLogo && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="mb-2 text-xs text-blue-600 font-medium">Logo</p>
                    <img src={previewLogo} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
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

      {/* Formulario */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="space-y-6">
            
            {/* Información de la Academia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Información de la Academia
              </h3>

              {/* Nombre Academia */}
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
                  placeholder="Ej: Academia Deportiva Los Campeones"
                />
                {errors.nombreAcademia && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.nombreAcademia.message}
                  </p>
                )}
              </div>

              {/* Liga */}
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
                    },
                    maxLength: {
                      value: 100,
                      message: "No puede exceder 100 caracteres"
                    }
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                    errors.liga ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Liga Distrital de Fútbol"
                />
                {errors.liga && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.liga.message}
                  </p>
                )}
              </div>
            </div>

            {/* Información del Representante */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Datos del Representante
              </h3>

              {/* Nombre Representante */}
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
                  placeholder="Ej: Juan Carlos Pérez García"
                />
                {errors.nombreRepresentante && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.nombreRepresentante.message}
                  </p>
                )}
              </div>

              {/* DNI y Teléfono en Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DNI */}
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
                    placeholder="12345678"
                  />
                  {errors.dniRepresentante && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.dniRepresentante.message}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
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
                    placeholder="987654321"
                  />
                  {errors.telefonoRepresentante && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.telefonoRepresentante.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Ubicación
              </h3>

              {/* Error general de ubicación */}
              {errorUbicacion && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{errorUbicacion}</p>
                </div>
              )}

              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDepartamento || ""}
                  onChange={(e) => onDepartamentoChange(Number(e.target.value))}
                  disabled={loadingUbicacion}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione departamento</option>
                  {departamentos.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Provincia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provincia <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProvincia || ""}
                  onChange={(e) => onProvinciaChange(Number(e.target.value))}
                  disabled={!selectedDepartamento || loadingUbicacion}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione provincia</option>
                  {provincias.map(prov => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>
                {!selectedDepartamento && (
                  <p className="mt-1 text-xs text-gray-500">Primero seleccione un departamento</p>
                )}
              </div>

              {/* Distrito */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distrito <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("distritoId", {
                    required: "Debe seleccionar un distrito",
                    validate: value => value > 0 || "Debe seleccionar un distrito válido"
                  })}
                  value={selectedDistrito || ""}
                  onChange={(e) => onDistritoChange(Number(e.target.value))}
                  disabled={!selectedProvincia || loadingUbicacion}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.distritoId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccione distrito</option>
                  {distritos.map(dist => (
                    <option key={dist.id} value={dist.id}>
                      {dist.nombre}
                    </option>
                  ))}
                </select>
                {!selectedProvincia && !errors.distritoId && (
                  <p className="mt-1 text-xs text-gray-500">Primero seleccione una provincia</p>
                )}
                {errors.distritoId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.distritoId.message}
                  </p>
                )}
              </div>

              {/* Loading indicator */}
              {loadingUbicacion && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando ubicaciones...
                </div>
              )}
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
                  // SIN IMAGEN: Mostrar área de subida
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
                  // CON IMAGEN: Exactamente igual a la prueba que funcionó
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
                    
                    {/* Botón eliminar */}
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
                disabled={loading || !isValid}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    Registrar Academia
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center pt-2">
              Los campos marcados con <span className="text-red-500">*</span> son obligatorios
            </div>
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