import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import { useJugadores } from "../../hooks/Academia/useJugador";
import { JugadorDTO } from "../../api/jugadorApi";
import DefaultJugadorInputs from "../../components/form/form-elements/Academia/DefaultJugadorInputs";
import FileInputJugador from "../../components/form/form-elements/Academia/FileInputJugador";
import SelectApoderadoInputs from "../../components/form/form-elements/Academia/SelectApoderadoInputs";

export default function FormJugador() {
  const { academiaId, equipoId } = useParams<{ academiaId: string, equipoId: string }>();
  const { registerJugador, loading, error } = useJugadores(academiaId!, equipoId!);

  const [ formData, setFormData ] = useState<JugadorDTO>({
    dni: "",
    apellidos: "",
    nombres: "",
    fechaNacimiento: "",
    fotoUrl: "",
    apoderadoId: "",
  });

  const handleChange = (field: keyof JugadorDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await registerJugador(formData);
    alert("Jugador registrado con éxito");

    setFormData({
      dni: "",
      apellidos: "",
      nombres: "",
      fechaNacimiento: "",
      fotoUrl: "",
    });
  };

  return (
    <div>
      <PageMeta
          title="Form Jugadores"
          description="Página para registrar a los jugadores de la categoría"
      />
      <PageBreadcrumb pageTitle="Registrar Jugador" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <DefaultJugadorInputs onChange={handleChange} initialData={formData} />
            <FileInputJugador onChange={(url) => handleChange("fotoUrl", url)} />
            <SelectApoderadoInputs 
              equipoId={equipoId!}
              onApoderadoChange={(apoderadoId) =>
                handleChange("apoderadoId", apoderadoId ?? "")
              } 
              initialApoderadoId={formData.apoderadoId}
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

              {loading ? "Guardando..." : "Registrar Entrenador"}
            </button>
          </div>
        </div>   
      </form>
    </div>
  );
}