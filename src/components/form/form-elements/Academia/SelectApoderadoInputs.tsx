import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Select from "../../Select";
import { useApoderados } from "../../../../hooks/Academia/useApoderado";

interface SelectApoderadoInputsProps {
  onApoderadoChange: (apoderadoId: string | null) => void;
  initialApoderadoId?: string | null;
  equipoId: string;
}

export default function SelectApoderadoInputs({
  onApoderadoChange,
  initialApoderadoId,
  equipoId
}: SelectApoderadoInputsProps) {
  const {
    apoderados,
    loading: loadingApoderados,
    error: errorApoderados,
  } = useApoderados(equipoId);

  const mapToOptions = (data: { id?: string; nombres: string; apellidos: string }[]) => {
    return data.map((item) => ({
      value: item.id ?? "",
      label: `${item.nombres} ${item.apellidos}`,
    }));
  };

  const handleApoderadoChange = (value: string) => {
    onApoderadoChange(value);
  };

  return (
      <ComponentCard title="Apoderado">
      <div className="space-y-6">
          <div>
              <Label>Seleccione al apoderado del jugador</Label>
              <Select
                  options={mapToOptions(apoderados)}
                  placeholder={loadingApoderados ? "Cargando..." : "Seleccione al apoderado"}
                  onChange={handleApoderadoChange}
                  className="dark:bg-dark-900"
                  value={initialApoderadoId ? String(initialApoderadoId) : ""}
              />
              {errorApoderados && <p className="text-red-500">{errorApoderados}</p>}
          </div>
      </div>
      </ComponentCard>
  );
}