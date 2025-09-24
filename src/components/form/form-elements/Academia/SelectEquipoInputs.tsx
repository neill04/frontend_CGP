import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Select from "../../Select";
import { useEntrenadores } from "../../../../hooks/Academia/useEntrenador";
import { useDelegados } from "../../../../hooks/Academia/useDelegado";

interface SelectEquipoInputsProps {
  onEntrenadorChange: (entrenadorId: string | null) => void;
  onDelegadoChange: (delegadoId: string | null) => void;
  initialEntrenadorId?: string | null;
  initialDelegadoId?: string | null;
  academiaId: string;
}

export default function SelectEquipoInputs({
  onEntrenadorChange,
  onDelegadoChange,
  initialEntrenadorId,
  initialDelegadoId,
  academiaId
}: SelectEquipoInputsProps) {
  const {
    entrenadores,
    loading: loadingEntrenadores,
    error: errorEntrenadores,
  } = useEntrenadores(academiaId);

  const {
    delegados,
    loading: loadingDelegados,
    error: errorDelegados,
  } = useDelegados(academiaId);

  const mapToOptions = (data: { id?: string; nombres: string; apellidos: string }[]) => {
    return data.map((item) => ({
      value: item.id ?? "",
      label: `${item.nombres} ${item.apellidos}`,
    }));
  };

  const handleEntrenadorChange = (value: string) => {
    onEntrenadorChange(value);
  };

  const handleDelegadoChange = (value: string) => {
    onDelegadoChange(value);
  };

  return (
      <ComponentCard title="Personal del Equipo">
      <div className="space-y-6">
          <div>
              <Label>Seleccione al entrenador de la categoría:</Label>
              <Select
                  options={mapToOptions(entrenadores)}
                  placeholder={loadingEntrenadores ? "Cargando..." : "Seleccione un entrenador"}
                  onChange={handleEntrenadorChange}
                  className="dark:bg-dark-900"
                  value={initialEntrenadorId ? String(initialEntrenadorId) : ""}
              />
              {errorEntrenadores && <p className="text-red-500">{errorEntrenadores}</p>}
          </div>
          <div>
              <Label>Seleccione el delegado de la categoría</Label>
              <Select
                  options={mapToOptions(delegados)}
                  placeholder={loadingDelegados ? "Cargando..." : "Seleccione un delegado"}
                  onChange={handleDelegadoChange}
                  className="dark:bg-dark-900"
                  value={initialDelegadoId ? String(initialDelegadoId) : ""}
              />
              {errorDelegados && <p className="text-red-500">{errorDelegados}</p>}
          </div>
      </div>
      </ComponentCard>
  );
}