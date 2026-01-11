import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Select from "../../components/form/Select";
import { useEquipos } from "../../hooks/Academia/useEquipo";
import { useEntrenadores } from "../../hooks/Academia/useEntrenador";
import { useDelegados } from "../../hooks/Academia/useDelegado";
import { EquipoDTO } from "../../api/equipoApi";

type ToastType = "success" | "error" | "info";

const CATEGORIAS = [
  "sub5", "sub6", "sub7", "sub8", "sub9", "sub10",
  "sub11", "sub12", "sub13", "sub14", "sub15", "sub16",
] as const;

export default function FormEquipo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { registerEquipo, loading, error } = useEquipos(id!);

  // Estados para toast y modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: "",
    type: "info"
  });

  // Hooks para obtener datos
  const {
    entrenadores,
    loading: loadingEntrenadores,
    error: errorEntrenadores,
  } = useEntrenadores(id!);

  const {
    delegados,
    loading: loadingDelegados,
    error: errorDelegados,
  } = useDelegados(id!);

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    getValues,
  } = useForm<EquipoDTO>({
    defaultValues: {
      categoria: "",
      colorCamiseta: "",
      entrenadorId: "",
      delegadoId: "",
      dniEntrenador: "",
      apellidosEntrenador: "",
      nombresEntrenador: "",
      telefonoEntrenador: "",
      dniDelegado: "",
      apellidosDelegado: "",
      nombresDelegado: "",
      telefonoDelegado: "",
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

  // Mapear datos a opciones para los Select
  const mapToOptions = (
    data: { id?: string; nombres: string; apellidos: string }[]
  ) => {
    return data.map((item) => ({
      value: item.id ?? "",
      label: `${item.nombres} ${item.apellidos}`,
    }));
  };

  const categoriaOptions = CATEGORIAS.map((cat) => ({
    value: cat,
    label: cat.toUpperCase(),
  }));

  const entrenadorOptions = mapToOptions(entrenadores);
  const delegadoOptions = mapToOptions(delegados);

  // Función para obtener nombre del entrenador seleccionado
  const getEntrenadorNombre = () => {
    const entrenador = entrenadores.find(e => e.id === watch("entrenadorId"));
    return entrenador ? `${entrenador.nombres} ${entrenador.apellidos}` : "No seleccionado";
  };

  // Función para obtener nombre del delegado seleccionado
  const getDelegadoNombre = () => {
    const delegado = delegados.find(d => d.id === watch("delegadoId"));
    return delegado ? `${delegado.nombres} ${delegado.apellidos}` : "No seleccionado";
  };

  // Handler para cancelar
  const handleCancel = () => {
    navigate(-1);
  };

  // Submit inicial - muestra modal de confirmación
  const onSubmitForm = (data: EquipoDTO) => {
    data;
    setShowConfirmModal(true);
  };

  // Confirmación final del registro
  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    
    try {
      const formData = getValues();
      await registerEquipo(formData);
      showToast("¡Equipo registrado exitosamente!", "success");
      
      // Resetear formulario
      reset();

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate(-1);
      }, 2000);
      
    } catch (err) {
      showToast("Error al registrar el equipo. Intenta nuevamente.", "error");
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <PageMeta
        title="Registrar Equipo"
        description="Página para registrar equipos de la academia"
      />
      <PageBreadcrumb pageTitle="Registrar Equipo" />

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
                Revisa la información antes de confirmar el registro del equipo
              </p>
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Datos del Equipo
              </h5>
              <div className="grid grid-cols-1 gap-4">
                {/* Categoría y Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="mb-1 text-xs text-blue-600 font-medium">Categoría</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {watch("categoria") ? watch("categoria").toUpperCase() : "No seleccionada"}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="mb-1 text-xs text-green-600 font-medium">Color de Camiseta</p>
                    <p className="text-sm font-semibold text-gray-800">{watch("colorCamiseta")}</p>
                  </div>
                </div>

                {/* Personal */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="mb-2 text-xs text-purple-600 font-medium">Personal del Equipo</p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">Entrenador:</span> {getEntrenadorNombre()}
                    </p>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">Delegado:</span> {getDelegadoNombre()}
                    </p>
                  </div>
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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
            
                {/* Datos del Equipo */}
                <ComponentCard title="Datos del Equipo">
                  <div className="space-y-6">
                    <div>
                      <label 
                        htmlFor="colorCamiseta"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Color de la Camiseta
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        id="colorCamiseta"
                        placeholder="Ej: Rojo, Azul, Verde"
                        {...register("colorCamiseta", {
                          required: "El color de camiseta es requerido",
                          minLength: {
                            value: 3,
                            message: "El color debe tener al menos 3 caracteres",
                          },
                          maxLength: {
                            value: 50,
                            message: "El color no puede exceder 50 caracteres",
                          },
                        })}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.colorCamiseta ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        aria-invalid={errors.colorCamiseta ? "true" : "false"}
                      />
                      {errors.colorCamiseta && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path 
                              fillRule="evenodd" 
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          {errors.colorCamiseta.message}
                        </p>
                      )}
                    </div>
                  </div>
                </ComponentCard>

                {/* Categoría del Equipo */}
                <ComponentCard title="Categoría del Equipo">
                  <div className="space-y-6">
                    <div>
                      <label 
                        htmlFor="categoria"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Categoría
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Controller
                        name="categoria"
                        control={control}
                        rules={{
                          required: "Debe seleccionar una categoría",
                        }}
                        render={({ field }) => (
                          <Select
                            options={categoriaOptions}
                            placeholder="Seleccione una categoría"
                            onChange={field.onChange}
                            value={field.value}
                            className="dark:bg-dark-900"
                          />
                        )}
                      />
                      {errors.categoria && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path 
                              fillRule="evenodd" 
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          {errors.categoria.message}
                        </p>
                      )}
                    </div>
                  </div>
                </ComponentCard>

                {/* Personal del Equipo */}
                <ComponentCard title="Personal del Equipo">
                  <div className="space-y-6">
                    {/* Entrenador */}
                    <div>
                      <label 
                        htmlFor="entrenador"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Entrenador
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Controller
                        name="entrenadorId"
                        control={control}
                        rules={{
                          required: "Debe seleccionar un entrenador",
                          validate: {
                            notEmpty: (value) =>
                              value !== "" || "Debe seleccionar un entrenador válido",
                          },
                        }}
                        render={({ field }) => (
                          <Select
                            options={entrenadorOptions}
                            placeholder={
                              loadingEntrenadores
                                ? "Cargando entrenadores..."
                                : "Seleccione un entrenador"
                            }
                            onChange={field.onChange}
                            value={field.value}
                            className="dark:bg-dark-900"
                            disabled={loadingEntrenadores}
                          />
                        )}
                      />
                      {errors.entrenadorId && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path 
                              fillRule="evenodd" 
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          {errors.entrenadorId.message}
                        </p>
                      )}
                      {errorEntrenadores && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path 
                              fillRule="evenodd" 
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          Error al cargar entrenadores: {errorEntrenadores}
                        </p>
                      )}
                      {!loadingEntrenadores && entrenadores.length === 0 && (
                        <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path 
                              fillRule="evenodd" 
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          No hay entrenadores disponibles. Por favor, registre uno primero.
                        </p>
                      )}
                    </div>

                    {/* Delegado */}
                    <div>
                      <label 
                        htmlFor="delegado"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Delegado
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Controller
                        name="delegadoId"
                        control={control}
                        rules={{
                          required: "Debe seleccionar un delegado",
                          validate: {
                            notEmpty: (value) =>
                              value !== "" || "Debe seleccionar un delegado válido",
                            notSameAsEntrenador: (value) => {
                              const entrenadorId = watch("entrenadorId");
                              return (
                                value !== entrenadorId ||
                                "El delegado no puede ser la misma persona que el entrenador"
                              );
                            },
                          },
                        }}
                        render={({ field }) => (
                          <Select
                            options={delegadoOptions}
                            placeholder={
                              loadingDelegados
                                ? "Cargando delegados..."
                                : "Seleccione un delegado"
                            }
                            onChange={field.onChange}
                            value={field.value}
                            className="dark:bg-dark-900"
                            disabled={loadingDelegados}
                          />
                        )}
                      />
                      {errors.delegadoId && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path 
                              fillRule="evenodd" 
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          {errors.delegadoId.message}
                        </p>
                      )}
                      {errorDelegados && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path 
                              fillRule="evenodd" 
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          Error al cargar delegados: {errorDelegados}
                        </p>
                      )}
                      {!loadingDelegados && delegados.length === 0 && (
                        <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path 
                              fillRule="evenodd" 
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          No hay delegados disponibles. Por favor, registre uno primero.
                        </p>
                      )}
                    </div>
                  </div>
                </ComponentCard>

                {/* Error general del API */}
                {error && (
                  <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                    <div className="flex items-start">
                      <svg
                        className="h-5 w-5 text-red-400 mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error al registrar el equipo
                        </h3>
                        <p className="mt-1 text-sm text-red-700">{error}</p>
                      </div>
                    </div>
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                        Registrar Equipo
                      </>
                    )}
                  </button>
                </div>
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