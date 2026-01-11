import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import { useEntrenadores } from "../../hooks/Academia/useEntrenador";
import { EntrenadorDTO } from "../../api/entrenadorApi";
import { CLOUDINARY_FOLDERS, uploadToCloudinary } from "../../utils/uploadImage";

type ToastType = "success" | "error" | "info";

export default function FormEntrenador() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { registerEntrenador, loading, error } = useEntrenadores(id!);

  // Refs para los campos de fecha
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Estados locales
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null); 
  const [isRegistering, setIsRegistering] = useState(false); 
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
    setValue,
    getValues,
  } = useForm<EntrenadorDTO>({
    defaultValues: {
      dni: "",
      apellidos: "",
      nombres: "",
      licencia: "",
      fechaNacimiento: "",
      telefono: "",
      email: "",
      fotoUrl: "",
    },
    mode: "onChange",
  });

  // Mostrar toast
  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 4000);
  };

  useEffect(() => {
    if (error && error !== lastError) {
      showToast(error, "error");
      setLastError(error);
    }
  }, [error]);

  useEffect(() => {
    if (!loading && isRegistering) {
      setIsRegistering(false);
      
      if (!error) {
        showToast("¡Entrenador registrado exitosamente!", "success");
        
        // Resetear formulario
        reset();
        setSelectedFile(null);
        setPreviewUrl("");
        if (dayRef.current) dayRef.current.value = "";
        if (monthRef.current) monthRef.current.value = "";
        if (yearRef.current) yearRef.current.value = "";

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    }
  }, [loading, isRegistering, error]);

  // Handlers para campos de fecha con auto-avance
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    e.target.value = value;

    if (value.length === 2) {
      const day = parseInt(value);
      if (day >= 1 && day <= 31) {
        monthRef.current?.focus();
      }
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    e.target.value = value;

    if (value.length === 2) {
      const month = parseInt(value);
      if (month >= 1 && month <= 12) {
        yearRef.current?.focus();
      }
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    e.target.value = value;
  };

  // Combinar día, mes y año en una fecha completa
  const updateFechaNacimiento = () => {
    const day = dayRef.current?.value.padStart(2, "0");
    const month = monthRef.current?.value.padStart(2, "0");
    const year = yearRef.current?.value;

    if (day && month && year && year.length === 4) {
      const fecha = `${year}-${month}-${day}`;
      setValue("fechaNacimiento", fecha, { shouldValidate: true });
    }
  };

  // Handler para archivo de foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        showToast("Por favor selecciona una imagen válida", "error");
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("La imagen no debe superar los 5MB", "error");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValue("fotoUrl", "temp"); // Valor temporal para validación
    }
  };

  // Handler para cancelar
  const handleCancel = () => {
    navigate(-1);
  };

  // Validación de edad
  const validateAge = (fecha: string): boolean | string => {
    if (!fecha) return "La fecha de nacimiento es requerida";
    
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      return edad - 1 >= 18 && edad - 1 <= 100 ? true : "La edad debe estar entre 18 y 100 años";
    }
    
    return edad >= 18 && edad <= 100 ? true : "La edad debe estar entre 18 y 100 años";
  };

  // Submit inicial - muestra modal de confirmación
  const onSubmitForm = (data: EntrenadorDTO) => {
    data;
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    
    // Subir foto a Cloudinary
    let fotoUrl = "";
    if (selectedFile) {
      showToast("Subiendo foto...", "info");
      try {
        fotoUrl = await uploadToCloudinary(
          selectedFile,
          CLOUDINARY_FOLDERS.ENTRENADORES
        );
      } catch (uploadError) {
        showToast("Error al subir la foto. Intenta nuevamente.", "error");
        console.error("Error al subir foto:", uploadError);
        return;
      }
    }

    // Preparar datos del formulario
    const formData = {
      ...getValues(),
      fotoUrl: fotoUrl
    };

    setIsRegistering(true);

    await registerEntrenador(formData);
  };

  return (
    <div>
      <PageMeta
        title="Registrar Entrenador"
        description="Página para registrar a los entrenadores de la academia"
      />
      
      <PageBreadcrumb pageTitle="Registrar Entrenador" />

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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[99999] p-4">
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
                Revisa la información antes de confirmar el registro del entrenador
              </p>
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Datos del Entrenador
              </h5>
              <div className="grid grid-cols-1 gap-4">
                {/* Foto */}
                {previewUrl && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="mb-2 text-xs text-blue-600 font-medium">Foto del Entrenador</p>
                    <div className="flex justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Preview entrenador" 
                        className="w-24 h-24 object-cover rounded-lg border-2 border-blue-300"
                      />
                    </div>
                  </div>
                )}

                {/* Datos Personales */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="mb-1 text-xs text-gray-500 font-medium">Nombre Completo</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {watch("nombres")} {watch("apellidos")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">DNI</p>
                    <p className="text-sm font-semibold text-gray-800">{watch("dni")}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">Fecha de Nacimiento</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {watch("fechaNacimiento") 
                        ? new Date(watch("fechaNacimiento")).toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: '2-digit', 
                            year: 'numeric'
                          })
                        : "No especificada"}
                    </p>
                  </div>
                </div>

                {/* Datos de Contacto */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="mb-2 text-xs text-purple-600 font-medium">Contacto</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">Teléfono:</span> {watch("telefono")}
                    </p>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">Email:</span> {watch("email")}
                    </p>
                  </div>
                </div>

                {/* Datos Profesionales */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="mb-1 text-xs text-green-600 font-medium">Licencia Profesional</p>
                  <p className="text-sm font-semibold text-gray-800">{watch("licencia")}</p>
                </div>
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
                disabled={loading || isSubmitting}
                className="flex-1 px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  "Confirmar Registro"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
            <div className="space-y-6">
              
              {/* Datos Personales */}
              <ComponentCard title="Datos Personales">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DNI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={8}
                      placeholder="12345678"
                      {...register("dni", {
                        required: "El DNI es requerido",
                        minLength: {
                          value: 8,
                          message: "El DNI debe tener 8 dígitos",
                        },
                        maxLength: {
                          value: 8,
                          message: "El DNI debe tener 8 dígitos",
                        },
                        pattern: {
                          value: /^[0-9]{8}$/,
                          message: "El DNI debe contener solo números",
                        },
                      })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.dni ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.dni && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.dni.message}
                      </p>
                    )}
                  </div>

                  {/* Apellidos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="García López"
                      {...register("apellidos", {
                        required: "Los apellidos son requeridos",
                        minLength: {
                          value: 2,
                          message: "Los apellidos deben tener al menos 2 caracteres",
                        },
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                          message: "Los apellidos solo pueden contener letras",
                        },
                      })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.apellidos ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.apellidos && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.apellidos.message}
                      </p>
                    )}
                  </div>

                  {/* Nombres */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Juan Carlos"
                      {...register("nombres", {
                        required: "Los nombres son requeridos",
                        minLength: {
                          value: 2,
                          message: "Los nombres deben tener al menos 2 caracteres",
                        },
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                          message: "Los nombres solo pueden contener letras",
                        },
                      })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.nombres ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.nombres && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.nombres.message}
                      </p>
                    )}
                  </div>

                  {/* Fecha de Nacimiento con auto-avance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        ref={dayRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        placeholder="DD"
                        onChange={handleDayChange}
                        onBlur={updateFechaNacimiento}
                        className={`w-16 px-3 py-2.5 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.fechaNacimiento ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <span className="text-gray-500">/</span>
                      <input
                        ref={monthRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        placeholder="MM"
                        onChange={handleMonthChange}
                        onBlur={updateFechaNacimiento}
                        className={`w-16 px-3 py-2.5 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.fechaNacimiento ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <span className="text-gray-500">/</span>
                      <input
                        ref={yearRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="AAAA"
                        onChange={handleYearChange}
                        onBlur={updateFechaNacimiento}
                        className={`w-24 px-3 py-2.5 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.fechaNacimiento ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {/* Campo oculto para react-hook-form */}
                      <input
                        type="hidden"
                        {...register("fechaNacimiento", {
                          required: "La fecha de nacimiento es requerida",
                          validate: validateAge,
                        })}
                      />
                    </div>
                    {errors.fechaNacimiento && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.fechaNacimiento.message}
                      </p>
                    )}
                  </div>
                </div>
              </ComponentCard>

              {/* Datos de Contacto */}
              <ComponentCard title="Datos de Contacto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="987654321"
                      {...register("telefono", {
                        required: "El teléfono es requerido",
                        pattern: {
                          value: /^[0-9]{9}$/,
                          message: "Debe tener exactamente 9 dígitos",
                        },
                      })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.telefono ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.telefono.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      {...register("email", {
                        required: "El correo electrónico es requerido",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "El correo electrónico no es válido",
                        },
                      })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </ComponentCard>

              {/* Datos Profesionales */}
              <ComponentCard title="Datos Profesionales">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Licencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Licencia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="LIC-12345"
                      {...register("licencia", {
                        required: "La licencia es requerida",
                        minLength: {
                          value: 3,
                          message: "La licencia debe tener al menos 3 caracteres",
                        },
                      })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.licencia ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.licencia && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.licencia.message}
                      </p>
                    )}
                  </div>

                  {/* Foto */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto del Entrenador <span className="text-red-500">*</span>
                    </label>
                    
                    {!previewUrl ? (
                      // SIN IMAGEN: Mostrar área de subida
                      <label className="cursor-pointer block">
                        <div className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg hover:border-red-400 hover:bg-red-50 transition ${
                          errors.fotoUrl ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}>
                          <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                              Click para subir foto del entrenador
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              PNG, JPG hasta 5MB
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      // CON IMAGEN: Mostrar preview con opción de eliminar
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <label className="cursor-pointer">
                            <img 
                              src={previewUrl} 
                              alt="Foto del entrenador" 
                              style={{ 
                                width: '200px', 
                                height: '200px', 
                                objectFit: 'contain', 
                                backgroundColor: '#f0f0f0', 
                                borderRadius: '8px', 
                                border: '2px solid #e5e7eb' 
                              }}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {/* Botón eliminar */}
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewUrl("");
                              setSelectedFile(null);
                              setValue("fotoUrl", "");
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
                    
                    <input
                      type="hidden"
                      {...register("fotoUrl", {
                        required: "La foto del entrenador es requerida",
                      })}
                    />
                    
                    {errors.fotoUrl && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.fotoUrl.message}
                      </p>
                    )}
                  </div>
                </div>
              </ComponentCard>

              {/* Error general del API */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

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
                  type="submit"
                  disabled={loading || isSubmitting || !isValid}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
                >
                  {loading || isSubmitting ? (
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75 Z" />
                      </svg>
                      Registrar Entrenador
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center pt-2">
                Los campos marcados con <span className="text-red-500">*</span> son obligatorios
              </div>
            </div>
          </form>
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