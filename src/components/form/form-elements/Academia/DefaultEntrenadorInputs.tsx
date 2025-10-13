import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import { EntrenadorDTO } from "../../../../api/entrenadorApi";
import DatePicker from "../../date-picker";

interface DefaultEntrenadorInputsProps {
  onChange: (field: keyof EntrenadorDTO, value: string) => void;
  initialData?: EntrenadorDTO;
  isEdit?: boolean;
}

export default function DefaultEntrenadorInputs({ onChange, initialData, isEdit = false }: DefaultEntrenadorInputsProps) {
  return (
    <ComponentCard title="Datos del Entrenador">
      <div className="space-y-6">
        <div>
          <Label htmlFor="dni">Dni</Label>
          <Input 
            type="text" 
            id="dni" 
            disabled={!isEdit}
            onChange={(e) => onChange("dni", e.target.value)}
            value={initialData?.dni || ""}
          />
        </div>
        <div>
          <Label htmlFor="apellidos">Apellidos completos</Label>
          <Input 
            type="text" 
            id="apellidos" 
            disabled={!isEdit}
            onChange={(e) => onChange("apellidos", e.target.value)}
            value={initialData?.apellidos || ""}
          />
        </div>
        <div>
          <Label htmlFor="nombres">Nombres completos</Label>
          <Input 
            type="text" 
            id="nombres" 
            disabled={!isEdit}
            onChange={(e) => onChange("nombres", e.target.value)}
            value={initialData?.nombres || ""}
          />
        </div>
        <div>
          <Label htmlFor="licencia">Licencia de entrenador</Label>
          <Input 
            type="text" 
            id="licencia" 
            disabled={!isEdit}
            onChange={(e) => onChange("licencia", e.target.value)}
            value={initialData?.licencia || ""}
          />
        </div>
        <div>
          <Label htmlFor="telefono">Telefono</Label>
          <Input 
            type="text" 
            id="telefono" 
            disabled={!isEdit}
            onChange={(e) => onChange("telefono", e.target.value)}
            value={initialData?.telefono || ""}
          />
        </div>
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input 
            type="text" 
            id="email" 
            disabled={!isEdit}
            placeholder="entrenador@example.com"
            onChange={(e) => onChange("email", e.target.value)}
            value={initialData?.email || ""}
          />
        </div>
        <div>
          <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
          <DatePicker 
            id="fechaNacimiento"
            placeholder="Seleccione la fecha"
            restrictAdult
            defaultDate={initialData?.fechaNacimiento}
            onChange={(selectedDates) => {
              const date = selectedDates[0];
              if (date) {
                onChange("fechaNacimiento", date.toISOString().split("T")[0]);
              }
            }}
            />
        </div>
      </div>
    </ComponentCard>
  );
}