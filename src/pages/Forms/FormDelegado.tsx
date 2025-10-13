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

  const [isEdit] = useState(true);

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
              title="Form Delegados"
              description="Página para registrar a los delegados de la academia"
          />
          <PageBreadcrumb pageTitle="Registrar Delegado" />
          <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="space-y-6">
                      <DefaultDelegadoInputs onChange={handleChange} initialData={formData} isEdit={isEdit} />
                      <FileInputDelegado onChange={(url) => handleChange("fotoUrl", url)} />

                      {error && <p className="text-red-500">{error}</p>}
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex select-none items-center gap-3 rounded-lg border border-black bg-white py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-black/40 transition-all hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black-/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>

                        {loading ? "Guardando..." : "Registrar Delegado"}
                      </button>
                  </div>
              </div>   
          </form>
      </div>
  );
}