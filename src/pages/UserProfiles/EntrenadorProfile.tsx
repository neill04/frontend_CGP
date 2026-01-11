import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useEntrenadores } from "../../hooks/Academia/useEntrenador";
import { EntrenadorDTO } from "../../api/entrenadorApi";
import { CLOUDINARY_FOLDERS, uploadToCloudinary } from "../../utils/uploadImage";

type ToastType = "success" | "error" | "info";

const getInitials = (nombres?: string, apellidos?: string) => {
  if (!nombres && !apellidos) return "ET";
  const n = nombres?.split(" ")[0] || "";
  const a = apellidos?.split(" ")[0] || "";
  return `${n[0] || ""}${a[0] || ""}`.toUpperCase();
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "No registrada";
  
  // ⭐ Evitar problemas de timezone parseando directamente el string
  const [year, month, day] = dateString.split('-');
  
  // Crear fecha en zona horaria local sin conversión UTC
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

const calculateAge = (dateString?: string) => {
  if (!dateString) return null;
  
  // ⭐ Evitar problemas de timezone parseando directamente
  const [year, month, day] = dateString.split('-').map(Number);
  
  const today = new Date();
  const birthDate = new Date(year, month - 1, day); // Crear en zona local
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default function EntrenadorProfile() {
  const { academiaId, entrenadorId } = useParams<{ academiaId: string, entrenadorId: string }>();
  const navigate = useNavigate();
  const { getEntrenador, updateEntrenador } = useEntrenadores(academiaId!);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [entrenador, setEntrenador] = useState<EntrenadorDTO | null>(null);

  // Refs para fecha
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Toast
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
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<EntrenadorDTO>({
    mode: "onChange",
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 4000);
  };

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

  // ⭐ Cargar fecha en inputs cuando se abre el modal
  useEffect(() => {
    if (showEditModal && entrenador?.fechaNacimiento) {
      const [year, month, day] = entrenador.fechaNacimiento.split('-');
      
      if (dayRef.current) dayRef.current.value = day.padStart(2, "0");
      if (monthRef.current) monthRef.current.value = month.padStart(2, "0");
      if (yearRef.current) yearRef.current.value = year;
    }
  }, [showEditModal, entrenador?.fechaNacimiento]);

  const handleEditClick = () => {
    if (!entrenador) return;
    
    // Resetear form con datos actuales
    reset(entrenador);
    setPreviewUrl(entrenador.fotoUrl || "");
    
    setShowEditModal(true);
    
    // ⭐ Setear fecha en los inputs separados DESPUÉS de que el modal se renderice
    setTimeout(() => {
      if (entrenador.fechaNacimiento) {
        // Parsear la fecha correctamente (formato: YYYY-MM-DD)
        const [year, month, day] = entrenador.fechaNacimiento.split('-');
        
        if (dayRef.current) dayRef.current.value = day.padStart(2, "0");
        if (monthRef.current) monthRef.current.value = month.padStart(2, "0");
        if (yearRef.current) yearRef.current.value = year;
        
        console.log("Fecha cargada:", { day, month, year });
      }
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Por favor selecciona una imagen válida", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("La imagen no debe superar los 5MB", "error");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

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

  const updateFechaNacimiento = () => {
    const day = dayRef.current?.value.padStart(2, "0");
    const month = monthRef.current?.value.padStart(2, "0");
    const year = yearRef.current?.value;

    if (day && month && year && year.length === 4) {
      const fecha = `${year}-${month}-${day}`;
      setValue("fechaNacimiento", fecha, { shouldValidate: true });
    }
  };

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

  const onSubmit = async (data: EntrenadorDTO) => {
    try {
      showToast("Actualizando información...", "info");

      // Subir nueva foto si se seleccionó
      let fotoUrl = data.fotoUrl;
      if (selectedFile) {
        fotoUrl = await uploadToCloudinary(selectedFile, CLOUDINARY_FOLDERS.ENTRENADORES);
      }

      const updatedData = { ...data, fotoUrl };
      await updateEntrenador(entrenadorId!, updatedData);
      
      setEntrenador(updatedData);
      setShowEditModal(false);
      setSelectedFile(null);
      showToast("¡Información actualizada exitosamente!", "success");
    } catch (err) {
      showToast("Error al actualizar la información", "error");
      console.error(err);
    }
  };

  // Loading State
  if (loading) {
    return (
      <>
        <PageMeta title="Cargando..." description="Cargando perfil del entrenador" />
        <PageBreadcrumb pageTitle="Perfil del Entrenador" />
        <div className="space-y-6 animate-pulse">
          <div className="rounded-2xl border border-gray-200 bg-gray-200 h-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-200 h-48"></div>
            <div className="rounded-2xl border border-gray-200 bg-gray-200 h-48"></div>
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error || !entrenador) {
    return (
      <>
        <PageMeta title="Error" description="Error al cargar perfil" />
        <PageBreadcrumb pageTitle="Perfil del Entrenador" />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-900 mb-2">Error al cargar</h2>
          <p className="text-red-700 mb-4">{error || "No se encontró el entrenador"}</p>
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

  const edad = calculateAge(entrenador.fechaNacimiento);

  return (
    <>
      <PageMeta
        title={`${entrenador.nombres} ${entrenador.apellidos} - Perfil`}
        description="Información completa del entrenador"
      />
      <PageBreadcrumb pageTitle="Perfil del Entrenador" />

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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[99999] p-4 overflow-y-auto">
          <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-6 lg:p-8 shadow-2xl my-8">
            <button
              onClick={() => {
                setShowEditModal(false);
                // Limpiar inputs de fecha al cerrar
                if (dayRef.current) dayRef.current.value = "";
                if (monthRef.current) monthRef.current.value = "";
                if (yearRef.current) yearRef.current.value = "";
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Editar Información</h3>
              </div>
              <p className="text-sm text-gray-500 ml-15">
                Actualiza los datos del entrenador
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto del Entrenador
                </label>
                {!previewUrl ? (
                  <label className="cursor-pointer block">
                    <div className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Click para cambiar foto</p>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG hasta 5MB</p>
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
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <label className="cursor-pointer">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl("");
                          setSelectedFile(null);
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

              {/* Datos Personales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("nombres", {
                      required: "Los nombres son requeridos",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message: "Solo se permiten letras",
                      },
                    })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.nombres ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.nombres && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombres.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("apellidos", {
                      required: "Los apellidos son requeridos",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message: "Solo se permiten letras",
                      },
                    })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.apellidos ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.apellidos && (
                    <p className="mt-1 text-sm text-red-600">{errors.apellidos.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    {...register("dni", {
                      required: "El DNI es requerido",
                      pattern: {
                        value: /^[0-9]{8}$/,
                        message: "Debe tener 8 dígitos",
                      },
                    })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.dni ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dni && (
                    <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={dayRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="DD"
                      onChange={handleDayChange}
                      onBlur={updateFechaNacimiento}
                      className="w-16 px-3 py-2.5 border border-gray-300 rounded-lg text-center"
                    />
                    <span className="text-gray-500 self-center">/</span>
                    <input
                      ref={monthRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="MM"
                      onChange={handleMonthChange}
                      onBlur={updateFechaNacimiento}
                      className="w-16 px-3 py-2.5 border border-gray-300 rounded-lg text-center"
                    />
                    <span className="text-gray-500 self-center">/</span>
                    <input
                      ref={yearRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="AAAA"
                      onChange={handleYearChange}
                      onBlur={updateFechaNacimiento}
                      className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg text-center"
                    />
                    <input
                      type="hidden"
                      {...register("fechaNacimiento", {
                        required: "La fecha es requerida",
                        validate: validateAge,
                      })}
                    />
                  </div>
                  {errors.fechaNacimiento && (
                    <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={9}
                    {...register("telefono", {
                      required: "El teléfono es requerido",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Debe tener 9 dígitos",
                      },
                    })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "El email es requerido",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email no válido",
                      },
                    })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Licencia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("licencia", {
                      required: "La licencia es requerida",
                    })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.licencia ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.licencia && (
                    <p className="mt-1 text-sm text-red-600">{errors.licencia.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    // Limpiar inputs de fecha al cancelar
                    if (dayRef.current) dayRef.current.value = "";
                    if (monthRef.current) monthRef.current.value = "";
                    if (yearRef.current) yearRef.current.value = "";
                  }}
                  className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header Card - Foto y Nombre Principal */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {/* Banner Superior */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
              {/* Foto de perfil */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0 bg-white">
                  {entrenador.fotoUrl ? (
                    <img 
                      src={entrenador.fotoUrl} 
                      alt={`${entrenador.nombres} ${entrenador.apellidos}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                      {getInitials(entrenador.nombres, entrenador.apellidos)}
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {entrenador.nombres} {entrenador.apellidos}
                  </h1>
                  <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Entrenador de {entrenador.nombreAcademia}
                  </p>
                  {edad && (
                    <p className="text-sm text-gray-500 mt-1">{edad} años</p>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 justify-center md:justify-end">
                <button
                  onClick={handleEditClick}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información de Contacto */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Información de Contacto
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-gray-800 break-all">
                    {entrenador.email || "No registrado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Teléfono</p>
                  <p className="text-sm font-medium text-gray-800">
                    {entrenador.telefono || "No registrado"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información Personal
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">DNI</p>
                  <p className="text-sm font-medium text-gray-800">{entrenador.dni}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Fecha de Nacimiento</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(entrenador.fechaNacimiento)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Licencia Profesional</p>
                  <p className="text-sm font-medium text-gray-800">{entrenador.licencia}</p>
                </div>
              </div>
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
    </>
  );
}