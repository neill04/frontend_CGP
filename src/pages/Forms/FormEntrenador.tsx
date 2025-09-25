import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import { useEntrenadores } from "../../hooks/Academia/useEntrenador";
import { EntrenadorDTO } from "../../api/entrenadorApi";
import DefaultEntrenadorInputs from "../../components/form/form-elements/Academia/DefaultEntrenadorInputs";
import FileInputEntrenador from "../../components/form/form-elements/Academia/FileInputEntrenador";

export default function FormEntrenador() {
  const { id } = useParams<{ id: string }>();
  const { registerEntrenador, loading, error } = useEntrenadores(id!);

  const [ formData, setFormData ] = useState<EntrenadorDTO>({
    dni: "",
    apellidos: "",
    nombres: "",
    licencia: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    fotoUrl: "",
  });

  const handleChange = (field: keyof EntrenadorDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await registerEntrenador(formData);
    alert("Entrenador registrado con éxito");

    setFormData({
      dni: "",
      apellidos: "",
      nombres: "",
      licencia: "",
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
                      <DefaultEntrenadorInputs onChange={handleChange} initialData={formData} />
                      <FileInputEntrenador onChange={(url) => handleChange("fotoUrl", url)} />

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