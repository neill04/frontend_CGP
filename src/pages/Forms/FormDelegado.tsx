import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import { useDelegados } from "../../hooks/Academia/useDelegado";
import { DelegadoDTO } from "../../api/delegadoApi";
import DefaultDelegadoInputs from "../../components/form/form-elements/Academia/DefaultDelegadoInputs";
import FileInputDelegado from "../../components/form/form-elements/Academia/FileInputDelegado";

export default function FormDelegado() {
  const { id } = useParams<{ id: string }>();
  const { registerDelegado, loading, error } = useDelegados(id!);

  const [ formData, setFormData ] = useState<DelegadoDTO>({
    dni: "",
    apellidos: "",
    nombres: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    fotoUrl: "",
  });

  const handleChange = (field: keyof DelegadoDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await registerDelegado(formData);
    alert("Delegado registrado con éxito");

    setFormData({
      dni: "",
      apellidos: "",
      nombres: "",
      fechaNacimiento: "",
      telefono: "",
      email: "",
      fotoUrl: "",
    });
  };

  return (
      <div>
          <PageMeta
              title="Form Entrenadores"
              description="Página para registrar a los entrenadores de la academia"
          />
          <PageBreadcrumb pageTitle="Registrar Entrenador" />
          <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="space-y-6">
                      <DefaultDelegadoInputs onChange={handleChange} initialData={formData} />
                      <FileInputDelegado onChange={(url) => handleChange("fotoUrl", url)} />

                      {error && <p className="text-red-500">{error}</p>}
                      <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md"
                      >
                          {loading ? "Guardando..." : "Registrar Entrenador"}
                      </button>
                  </div>
              </div>   
          </form>
      </div>
  );
}