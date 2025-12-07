import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import DatePicker from "../form/date-picker";
import { useEntrenadores } from "../../hooks/Academia/useEntrenador";
import { EntrenadorDTO } from "../../api/entrenadorApi";

interface EntrenadorInfoCardProps {
  academiaId: string;
  entrenadorId: string;
  onUpdate?: (data: EntrenadorDTO) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "No registrada";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

export default function EntrenadorInfoCard({ 
  academiaId, 
  entrenadorId,
  onUpdate 
}: EntrenadorInfoCardProps) {
  const { getEntrenador, updateEntrenador } = useEntrenadores(academiaId);
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success"
  });

  const [formData, setFormData] = useState<EntrenadorDTO>({
    dni: "",
    apellidos: "",
    nombres: "",
    licencia: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    fotoUrl: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof EntrenadorDTO, string>>>({});

  useEffect(() => {
    const fetchEntrenadorData = async () => {
      const entrenador = await getEntrenador(entrenadorId);
      if (entrenador) {
        setFormData(entrenador);
      }
    };
    fetchEntrenadorData();
  }, [entrenadorId]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof EntrenadorDTO, string>> = {};

    if (!formData.dni || formData.dni.length < 8) {
      errors.dni = "El DNI debe tener al menos 8 caracteres";
    }

    if (!formData.nombres || formData.nombres.trim().length < 2) {
      errors.nombres = "Los nombres son requeridos";
    }

    if (!formData.apellidos || formData.apellidos.trim().length < 2) {
      errors.apellidos = "Los apellidos son requeridos";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "El email no es válido";
    }

    if (!formData.licencia) {
      errors.licencia = "La licencia es requerida";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof EntrenadorDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
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

    try {
      setLoading(true);
      await updateEntrenador(entrenadorId, formData);
      showToast("Entrenador actualizado exitosamente", "success");
      
      // Notificar al componente padre
      if (onUpdate) {
        onUpdate(formData);
      }
      
      closeModal();
    } catch (error) {
      showToast("Error al actualizar el entrenador", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {toast.type === "success" ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="flex-1">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="p-5 border border-gray-200 rounded-2xl shadow-sm lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-6">
              Información del Entrenador
            </h4>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-2 text-xs text-gray-500">DNI</p>
                <p className="text-sm font-medium text-gray-800">{formData.dni}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-2 text-xs text-gray-500">Nombres</p>
                <p className="text-sm font-medium text-gray-800">{formData.nombres}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-2 text-xs text-gray-500">Apellidos</p>
                <p className="text-sm font-medium text-gray-800">{formData.apellidos}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-2 text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800 break-all">
                  {formData.email || "No registrado"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-2 text-xs text-gray-500">Celular</p>
                <p className="text-sm font-medium text-gray-800">
                  {formData.telefono || "No registrado"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-2 text-xs text-gray-500">Licencia</p>
                <p className="text-sm font-medium text-gray-800">{formData.licencia}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg lg:col-span-2">
                <p className="mb-2 text-xs text-gray-500">Fecha de nacimiento</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(formData.fechaNacimiento)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition lg:inline-flex"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
          <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-6 lg:p-8">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h4 className="text-2xl font-semibold text-gray-800 mb-2">
                Editar Información
              </h4>
              <p className="text-sm text-gray-500">
                Actualiza la información del entrenador
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="max-h-[500px] overflow-y-auto space-y-5 px-1">
                <h5 className="text-lg font-medium text-gray-800">
                  Información Personal
                </h5>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div>
                    <Label htmlFor="dni">DNI <span className="text-red-500">*</span></Label>
                    <Input 
                      type="text" 
                      id="dni"
                      onChange={(e) => handleChange("dni", e.target.value)} 
                      value={formData.dni || ""}
                      className={formErrors.dni ? "border-red-500" : ""}
                      maxLength={8}
                    />
                    {formErrors.dni && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.dni}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="licencia">Licencia <span className="text-red-500">*</span></Label>
                    <Input 
                      type="text" 
                      id="licencia"
                      onChange={(e) => handleChange("licencia", e.target.value)} 
                      value={formData.licencia || ""}
                      className={formErrors.licencia ? "border-red-500" : ""}
                    />
                    {formErrors.licencia && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.licencia}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="nombres">Nombres <span className="text-red-500">*</span></Label>
                    <Input 
                      type="text" 
                      id="nombres"
                      onChange={(e) => handleChange("nombres", e.target.value)} 
                      value={formData.nombres || ""}
                      className={formErrors.nombres ? "border-red-500" : ""}
                    />
                    {formErrors.nombres && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.nombres}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apellidos">Apellidos <span className="text-red-500">*</span></Label>
                    <Input 
                      type="text" 
                      id="apellidos"
                      onChange={(e) => handleChange("apellidos", e.target.value)} 
                      value={formData.apellidos || ""}
                      className={formErrors.apellidos ? "border-red-500" : ""}
                    />
                    {formErrors.apellidos && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.apellidos}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      type="email" 
                      id="email"
                      onChange={(e) => handleChange("email", e.target.value)} 
                      value={formData.email || ""}
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telefono">Celular</Label>
                    <Input 
                      type="text" 
                      id="telefono"
                      onChange={(e) => handleChange("telefono", e.target.value)} 
                      value={formData.telefono || ""}
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                    <DatePicker
                      id="fechaNacimiento"
                      placeholder="Seleccione la fecha"
                      defaultDate={formData.fechaNacimiento}
                      onChange={(selectedDates) => {
                        const date = selectedDates[0];
                        if (date) {
                          handleChange("fechaNacimiento", date.toISOString().split("T")[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline" 
                  onClick={closeModal}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
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