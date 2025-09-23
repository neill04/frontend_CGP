import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DefaultAcademiaInputs from "../../components/form/form-elements/Academia/DefaultAcademiaInputs";
import FileInputAcademia from "../../components/form/form-elements/Academia/FileInputAcademia";
import SelectAcademiaInputs from "../../components/form/form-elements/Academia/SelectAcademiaInputs";
import { useAcademias } from "../../hooks/Academia/useAcademia";
import { AcademiaDTO } from "../../api/academiaApi";

export default function FormAcademia() {
    const { postAcademia, loading, error } = useAcademias();

    const [ formData, setFormData ] = useState<AcademiaDTO>({
        nombreAcademia: "",
        nombreRepresentante: "",
        dniRepresentante: "",
        telefonoRepresentante: "",
        logoUrl: "",
        distritoId: 0,
    });

    const [distritoId, setDistritoId] = useState<number | null>(null);

    const handleChange = (field: keyof AcademiaDTO, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!distritoId) {
            alert("Seleccione un distrito");
            return;
        }

        const payload = { ...formData, distritoId };

        await postAcademia(payload);
        alert("Academia registrada con éxito");

        setFormData({
            nombreAcademia: "",
            nombreRepresentante: "",
            dniRepresentante: "",
            telefonoRepresentante: "",
            logoUrl: "",
            distritoId: 0,
        });
    };

    return (
        <div>
            <PageMeta
                title="Form Academias"
                description="Página para registrar las academias"
            />
            <PageBreadcrumb pageTitle="Form Academias" />
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="space-y-6">
                        <DefaultAcademiaInputs onChange={handleChange} initialData={formData} />
                        <SelectAcademiaInputs onDistritoChange={setDistritoId} />
                        <FileInputAcademia onChange={(url) => handleChange("logoUrl", url)} />

                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            {loading ? "Guardando..." : "Registrar Academia"}
                        </button>
                    </div>
                </div>   
            </form>
        </div>
    );
}