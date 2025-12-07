import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import { useEquipos } from "../../hooks/Academia/useEquipo";
import { EquipoDTO } from "../../api/equipoApi";
import DefaultEquipoInputs from "../../components/form/form-elements/Academia/DefaultEquipoInputs";
import SelectEquipoInputs from "../../components/form/form-elements/Academia/SelectEquipoInputs";
import SelectCategoriaInputs from "../../components/form/form-elements/Academia/SelectCategoriaInputs";

export default function FormEquipo() {
  const { id } = useParams<{ id: string }>();
  const { registerEquipo, loading, error } = useEquipos(id!);

  const [ formData, setFormData ] = useState<EquipoDTO>({
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
      dniEntrenador: "",
      apellidosEntrenador: "",
      nombresEntrenador: "",
      telefonoEntrenador: "",
      dniDelegado: "",
      apellidosDelegado: "",
      nombresDelegado: "",
      telefonoDelegado: "",
      });
  };

  return (
      <div>
          <PageMeta
              title="Form Categorías"
              description="Página para registrar las categorías de la academia"
          />
          <PageBreadcrumb pageTitle="Registrar Categoría" />
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
                      className="inline-flex select-none items-center gap-3 rounded-lg border border-black bg-white py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-black/40 transition-all hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black-/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                      </svg>

                      {loading ? "Guardando..." : "Registrar Categoría"}
                    </button>
                  </div>
              </div>   
          </form>
      </div>
  );
}