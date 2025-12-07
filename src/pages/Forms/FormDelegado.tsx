import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams, useNavigate } from "react-router";
import { useDelegados } from "../../hooks/Academia/useDelegado";
import { DelegadoDTO } from "../../api/delegadoApi";
import DefaultDelegadoInputs from "../../components/form/form-elements/Academia/DefaultDelegadoInputs";
import FileInputDelegado from "../../components/form/form-elements/Academia/FileInputDelegado";

type ToastType = "success" | "error" | "info";

export default function FormDelegado() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { registerDelegado, loading, error } = useDelegados(id!);
  
  const [formData, setFormData] = useState<DelegadoDTO>({
    dni: "",
    apellidos: "",
    nombres: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    fotoUrl: "",
  });

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
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof DelegadoDTO, string>>>({});

  // Mostrar toast
  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 4000);
  };

  // Validación de campos
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof DelegadoDTO, string>> = {};

    if (!formData.dni || formData.dni.length < 8) {
      errors.dni = "El DNI debe tener al menos 8 caracteres";
    }

    if (!formData.apellidos || formData.apellidos.trim().length < 2) {
      errors.apellidos = "Los apellidos son requeridos";
    }

    if (!formData.nombres || formData.nombres.trim().length < 2) {
      errors.nombres = "Los nombres son requeridos";
    }

    if (!formData.telefono || formData.telefono.length < 9) {
      errors.telefono = "El teléfono debe tener al menos 9 dígitos";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "El correo electrónico no es válido";
    }

    if (!formData.fechaNacimiento) {
      errors.fechaNacimiento = "La fecha de nacimiento es requerida";
    } else {
      const fechaNac = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      if (edad < 18 || edad > 100) {
        errors.fechaNacimiento = "La edad debe estar entre 18 y 100 años";
      }
    }

    if (!selectedFile && !formData.fotoUrl) {
      errors.fotoUrl = "La foto del delegado es requerida";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof DelegadoDTO, value: string) => {
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
      // Limpiar error de foto cuando se selecciona un archivo
      if (formErrors.fotoUrl) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.fotoUrl;
          return newErrors;
        });
      }
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
      // Por ahora, si hay un archivo seleccionado, usamos un placeholder
      if (selectedFile) {
        formData.fotoUrl = URL.createObjectURL(selectedFile);
      }

      await registerDelegado(formData);
      showToast("¡Delegado registrado exitosamente!", "success");
      
      // Resetear formulario
      setFormData({
        dni: "",
        apellidos: "",
        nombres: "",
        fechaNacimiento: "",
        telefono: "",
        email: "",
        fotoUrl: "",
      });
      setSelectedFile(null);
      setFormErrors({});

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate(`/academias/${id}`);
      }, 2000);
      
    } catch (err) {
      showToast("Error al registrar el delegado. Intenta nuevamente.", "error");
    }
  };

  const handleCancel = () => {
    navigate(`/academias/${id}/delegados`);
  };

  const isFormValid = () => {
    return (
      formData.dni &&
      formData.apellidos &&
      formData.nombres &&
      formData.telefono &&
      formData.email &&
      formData.fechaNacimiento &&
      (selectedFile || formData.fotoUrl)
    );
  };

  return (
    <div>
      <PageMeta
        title="Registrar Delegado"
        description="Página para registrar a los delegados de la academia"
      />
      
      <PageBreadcrumb pageTitle="Registrar Delegado" />

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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirmar Registro</h3>
            </div>
            
            <div className="mb-6 space-y-2 text-sm text-gray-700">
              <p><strong>DNI:</strong> {formData.dni}</p>
              <p><strong>Nombre completo:</strong> {formData.nombres} {formData.apellidos}</p>
              <p><strong>Teléfono:</strong> {formData.telefono}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Fecha de nacimiento:</strong> {new Date(formData.fechaNacimiento).toLocaleDateString()}</p>
            </div>

            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas registrar a este delegado?</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <DefaultDelegadoInputs 
                onChange={handleChange} 
                initialData={formData}
                errors={formErrors}
                isEdit={true}
              />

              <FileInputDelegado 
                onChange={handleFileChange}
                initialPhotoUrl={formData.fotoUrl}
                error={formErrors.fotoUrl}
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
                      Registrar Delegado
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
      `}</style>
    </div>
  );
}