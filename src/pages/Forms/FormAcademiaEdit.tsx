import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DefaultAcademiaInputs from "../../components/form/form-elements/Academia/DefaultAcademiaInputs";
import { useAcademias } from "../../hooks/Academia/useAcademia";
import { AcademiaDTO } from "../../api/academiaApi";

export default function FormAcademiaEdit() {
    const { id } = useParams<{ id: string }>();
    const { getAcademia, updateAcademia, loading, error } = useAcademias();

    const [formData, setFormData] = useState<AcademiaDTO>({
        nombreAcademia: "",
        nombreRepresentante: "",
        dniRepresentante: "",
        telefonoRepresentante: "",
        logoUrl: "",
        distritoId: 0,
    });

    const [distritoId, setDistritoId] = useState<number | null>(null);

    useEffect(() => {
        const fetchAcademiaData = async () => {
            if (id) {
                const academia = await getAcademia(id);
                if (academia) {
                    setFormData(academia);
                    
                    if (academia.distritoId !== undefined) {
                      setDistritoId(academia.distritoId);
                    }
                }
            }
        };
        fetchAcademiaData();
    }, [id]); 

    const handleChange = (field: keyof AcademiaDTO, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) {
            alert("Información incompleta");
            return;
        }

        await updateAcademia(id, formData); 
        alert("Academia actualizada con éxito");
    };

    return (
        <div>
            <PageMeta
                title="Editar Academia"
                description="Página para editar los datos de una academia"
            />
            <PageBreadcrumb pageTitle="Editar Academia" />
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="space-y-6">
                        <DefaultAcademiaInputs
                            onChange={handleChange}
                            initialData={formData}
                            isEdit
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            {loading ? "Guardando..." : "Actualizar Academia"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}