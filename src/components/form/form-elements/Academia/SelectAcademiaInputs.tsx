import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Select from "../../Select";
import { useUbicacion } from "../../../../hooks/Academia/useUbicacion";
import { useEffect } from "react";

interface SelectAcademiaInputsProps {
    onDistritoChange: (distritoId: number | null) => void;
    initialDistritoId?: number | null;
}

export default function SelectAcademiaInputs({ onDistritoChange, initialDistritoId }: SelectAcademiaInputsProps) {
    const {
        departamentos,
        provincias,
        distritos,
        selectedDepartamento,
        selectedProvincia,
        selectedDistrito,
        loading,
        error,
        onDepartamentoChange,
        onProvinciaChange,
        onDistritoChange: onDistritoChangeHook,
    } = useUbicacion(initialDistritoId);

    const handleDepartamentoChange = (value: string) => {
        onDepartamentoChange(Number(value));
    };

    const handleProvinciaChange = (value: string) => {
        onProvinciaChange(Number(value));
    };

    const handleDistritoChange = (value: string) => {
        const id = Number(value);
        onDistritoChangeHook(id);
        onDistritoChange(id);
    };

    const mapUbicacionToOptions = (data: { id: number; nombre: string }[]) => {
        return data.map((item) => ({
            value: String(item.id),
            label: item.nombre,
        }));
    };

    return (
        <ComponentCard title="Ubicación">
        <div className="space-y-6">
            <div>
                <Label>Departamento</Label>
                <Select
                    options={mapUbicacionToOptions(departamentos)}
                    placeholder={loading ? "Cargando..." : "Seleccione un departamento"}
                    onChange={handleDepartamentoChange}
                    className="dark:bg-dark-900"
                    value={selectedDepartamento ? String(selectedDepartamento) : ''}
                />
            </div>
            <div>
                <Label>Provincia</Label>
                <Select
                    options={mapUbicacionToOptions(provincias)}
                    placeholder={loading ? "Cargando..." : "Seleccione una provincia"}
                    onChange={handleProvinciaChange}
                    className="dark:bg-dark-900"
                    disabled={!selectedDepartamento || loading}
                    value={selectedProvincia ? String(selectedProvincia) : ''}
                />
            </div>
            <div>
                <Label>Distrito</Label>
                <Select
                    options={mapUbicacionToOptions(distritos)}
                    placeholder={loading ? "Cargando..." : "Seleccione un distrito"}
                    onChange={handleDistritoChange}
                    className="dark:bg-dark-900"
                    disabled={!selectedProvincia || loading}
                    value={selectedDistrito ? String(selectedDistrito): ''}
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
        </ComponentCard>
    );
}
