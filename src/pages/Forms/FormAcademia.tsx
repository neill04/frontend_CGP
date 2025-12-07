import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DefaultAcademiaInputs from "../../components/form/form-elements/Academia/DefaultAcademiaInputs";
import FileInputAcademia from "../../components/form/form-elements/Academia/FileInputAcademia";
import SelectAcademiaInputs from "../../components/form/form-elements/Academia/SelectAcademiaInputs";
import { useAcademias } from "../../hooks/Academia/useAcademia";
import { AcademiaDTO } from "../../api/academiaApi";

type ToastType = "success" | "error" | "info";

export default function FormAcademia() {
  const navigate = useNavigate();
  const { postAcademia, loading, error } = useAcademias();
  
  const [formData, setFormData] = useState<AcademiaDTO>({
    nombreAcademia: "",
    nombreRepresentante: "",
    dniRepresentante: "",
    telefonoRepresentante: "",
    logoUrl: "",
    distritoId: 0,
  });

  const [distritoId, setDistritoId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AcademiaDTO | 'distrito', string>>>({});

  // Mostrar toast
  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 4000);
  };

  // Validación de campos
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AcademiaDTO | 'distrito', string>> = {};

    if (!formData.nombreAcademia || formData.nombreAcademia.trim().length < 3) {
      errors.nombreAcademia = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.nombreRepresentante || formData.nombreRepresentante.trim().length < 3) {
      errors.nombreRepresentante = "El nombre del representante es requerido";
    }

    if (!formData.dniRepresentante || formData.dniRepresentante.length < 8) {
      errors.dniRepresentante = "El DNI debe tener al menos 8 caracteres";
    }

    if (!formData.telefonoRepresentante || formData.telefonoRepresentante.length < 9) {
      errors.telefonoRepresentante = "El teléfono debe tener al menos 9 dígitos";
    }

    if (!distritoId) {
      errors.distrito = "Debe seleccionar un distrito";
    }

    // Logo es opcional, no se valida

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof AcademiaDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      if (formErrors.logoUrl) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.logoUrl;
          return newErrors;
        });
      }
    }
  };

  const handleDistritoChange = (id: number | null) => {
    setDistritoId(id);
    if (id && formErrors.distrito) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.distrito;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Por favor corrige los errores en el formulario", "error");
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    
    try {
      // Aquí deberías subir el archivo al servidor y obtener la URL
      if (selectedFile) {
        formData.logoUrl = URL.createObjectURL(selectedFile);
      }

      const payload = { ...formData, distritoId: distritoId! };
      await postAcademia(payload);
      
      showToast("¡Academia registrada exitosamente!", "success");
      
      // Resetear formulario
      setFormData({
        nombreAcademia: "",
        nombreRepresentante: "",
        dniRepresentante: "",
        telefonoRepresentante: "",
        logoUrl: "",
        distritoId: 0,
      });
      setDistritoId(null);
      setSelectedFile(null);
      setFormErrors({});

    } catch (err) {
      showToast("Error al registrar la academia. Intenta nuevamente.", "error");
    }
  };

  const handleCancel = () => {
    navigate('/academias');
  };

  const isFormValid = () => {
    return (
      formData.nombreAcademia &&
      formData.nombreRepresentante &&
      formData.dniRepresentante &&
      formData.telefonoRepresentante &&
      distritoId
      // Logo es opcional, no se valida
    );
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
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
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
                  <p className="text-sm font-semibold text-gray-800">{formData.nombreAcademia}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="mb-1 text-xs text-gray-500 font-medium">Representante</p>
                  <p className="text-sm font-semibold text-gray-800">{formData.nombreRepresentante}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">DNI</p>
                    <p className="text-sm font-semibold text-gray-800">{formData.dniRepresentante}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-1 text-xs text-gray-500 font-medium">Teléfono</p>
                    <p className="text-sm font-semibold text-gray-800">{formData.telefonoRepresentante}</p>
                  </div>
                </div>

                {selectedFile && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="mb-1 text-xs text-blue-600 font-medium">Logo</p>
                    <p className="text-sm font-semibold text-gray-800">📎 {selectedFile.name}</p>
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

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <DefaultAcademiaInputs 
                onChange={handleChange} 
                initialData={formData}
                errors={formErrors}
              />

              <SelectAcademiaInputs 
                onDistritoChange={handleDistritoChange}
                error={formErrors.distrito}
              />

              <FileInputAcademia 
                onChange={handleFileChange}
                initialLogoUrl={formData.logoUrl}
                error={formErrors.logoUrl}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

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
                  disabled={loading || !isFormValid()}
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
          </form>
        </div>
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
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}