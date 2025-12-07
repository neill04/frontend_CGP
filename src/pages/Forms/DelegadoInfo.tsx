import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { DelegadoDTO } from "../../api/delegadoApi";
import { useDelegados } from "../../hooks/Academia/useDelegado";
import DefaultDelegadoInputs from "../../components/form/form-elements/Academia/DefaultDelegadoInputs";

export default function DelegadoInfo() {
    const { academiaId, delegadoId } = useParams<{ academiaId: string; delegadoId: string }>();
    const { getDelegado, updateDelegado, loading, error } = useDelegados(academiaId!);

    const [ formData, setFormData ] = useState<DelegadoDTO>({
      dni: "",
      apellidos: "",
      nombres: "",
      fechaNacimiento: "",
      telefono: "",
      email: "",
      fotoUrl: "",
    });

    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const fetchDelegadoData = async () => {
          const delegado = await getDelegado(delegadoId!);
          console.log(delegado);
          if (delegado) {
              setFormData(delegado);
          }
        };
        fetchDelegadoData();
    }, [delegadoId]); 

    const handleChange = (field: keyof DelegadoDTO, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await updateDelegado(delegadoId!, formData); 
        alert("Delegado actualizado con éxito");
    };

    return (
        <div>
            <PageMeta
                title="Info del delegado"
                description="Página para poder visualizar toda la información del delegado y también con opción a poder editar esta."
            />
            <PageBreadcrumb pageTitle={formData.nombres} />
            {!isEdit && (
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => setIsEdit(true)}
                  className="inline-flex select-none items-center gap-3 rounded-lg border border-black bg-white py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-black/40 transition-all hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black-/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                  Activar Edición
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="space-y-6">
                        <DefaultDelegadoInputs
                         onChange={handleChange}
                         initialData={formData}
                         isEdit={isEdit}
                        />

                        {error && <p className="text-red-500">{error}</p>}
                        {isEdit && (
                          <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex select-none items-center gap-3 rounded-lg border border-black bg-white py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-black/40 transition-all hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black-/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                            {loading ? "Guardando..." : "Guardar cambios"}
                          </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}