import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Select from "../../Select";
import { useUbicacion } from "../../../../hooks/Academia/useUbicacion";

interface SelectAcademiaInputsProps {
  onDistritoChange: (distritoId: number | null) => void;
  initialDistritoId?: number | null;
  error?: string;
}

export default function SelectAcademiaInputs({ 
  onDistritoChange, 
  initialDistritoId,
  error 
}: SelectAcademiaInputsProps) {
  const {
    departamentos,
    provincias,
    distritos,
    selectedDepartamento,
    selectedProvincia,
    selectedDistrito,
    loading,
    error: ubicacionError,
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
          <Label>
            Departamento <span className="text-red-500">*</span>
          </Label>
          <Select
            options={mapUbicacionToOptions(departamentos)}
            placeholder={loading ? "Cargando..." : "Seleccione un departamento"}
            onChange={handleDepartamentoChange}
            className="dark:bg-dark-900"
            value={selectedDepartamento ? String(selectedDepartamento) : ''}
          />
        </div>

        <div>
          <Label>
            Provincia <span className="text-red-500">*</span>
          </Label>
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
          <Label>
            Distrito <span className="text-red-500">*</span>
          </Label>
          <Select
            options={mapUbicacionToOptions(distritos)}
            placeholder={loading ? "Cargando..." : "Seleccione un distrito"}
            onChange={handleDistritoChange}
            className={`dark:bg-dark-900 ${error ? 'border-red-500' : ''}`}
            disabled={!selectedProvincia || loading}
            value={selectedDistrito ? String(selectedDistrito) : ''}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {ubicacionError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{ubicacionError}</p>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}