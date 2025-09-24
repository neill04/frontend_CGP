import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import { useEquipos } from "../../hooks/Academia/useEquipo";
import { EquipoDTO } from "../../api/equipoApi";
import DefaultEquipoInputs from "../../components/form/form-elements/Academia/DefaultEquipoInputs";
import SelectEquipoInputs from "../../components/form/form-elements/Academia/SelectEquipoInputs";
import Label from "../../components/form/Label";
import SelectCategoriaInputs from "../../components/form/form-elements/Academia/SelectCategoriaInputs";

export default function FormEquipo() {
  const { id } = useParams<{ id: string }>();
  const { registerEquipo, loading, error } = useEquipos(id!);

  const [ formData, setFormData ] = useState<EquipoDTO>({
    categoria: "",
    colorCamiseta: "",
    entrenadorId: "",
    delegadoId: "",
    apellidosEntrenador: "",
    nombresEntrenador: "",
    apellidosDelegado: "",
    nombresDelegado: "",
  });

  const handleChange = (field: keyof EquipoDTO, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      await registerEquipo(formData);
      alert("Equipo registrado con éxito");

      setFormData({
        categoria: "",
        colorCamiseta: "",
        entrenadorId: "",
        delegadoId: "",
        apellidosEntrenador: "",
        nombresEntrenador: "",
        apellidosDelegado: "",
        nombresDelegado: "",
      });
  };

  return (
      <div>
          <PageMeta
              title="Form Equipos"
              description="Página para registrar los equipos o sus categorías de la academia"
          />
          <PageBreadcrumb pageTitle="Registrar Equipo" />
          <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="space-y-6">
                    <DefaultEquipoInputs onChange={handleChange} initialData={formData} />
                    <SelectCategoriaInputs value={formData.categoria} onChange={(categoria) => handleChange("categoria", categoria)} />
                    <SelectEquipoInputs
                      academiaId={id!}
                      onEntrenadorChange={(entrenadorId) =>
                        handleChange("entrenadorId", entrenadorId ?? "")
                      }
                      onDelegadoChange={(delegadoId) =>
                        handleChange("delegadoId", delegadoId ?? "")
                      }
                      initialEntrenadorId={formData.entrenadorId}
                      initialDelegadoId={formData.delegadoId}
                    />

                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        {loading ? "Guardando..." : "Registrar Equipo"}
                    </button>
                  </div>
              </div>   
          </form>
      </div>
  );
}