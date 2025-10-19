import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import DatePicker from "../../date-picker";
import { JugadorDTO } from "../../../../api/jugadorApi";

interface DefaultJugadorInputsProps {
  onChange: (field: keyof JugadorDTO, value: string) => void;
  initialData?: JugadorDTO;
}

export default function DefaultJugadorInputs({ onChange, initialData}: DefaultJugadorInputsProps) {
  return (
    <ComponentCard title="Datos del Jugador">
      <div className="space-y-6">
        <div>
          <Label htmlFor="dni">Dni</Label>
          <Input 
            type="text" 
            id="dni" 
            onChange={(e) => onChange("dni", e.target.value)}
            value={initialData?.dni || ""}
          />
        </div>
        <div>
          <Label htmlFor="apellidos">Apellidos completos</Label>
          <Input 
            type="text" 
            id="apellidos" 
            onChange={(e) => onChange("apellidos", e.target.value)}
            value={initialData?.apellidos || ""}
          />
        </div>
        <div>
          <Label htmlFor="nombres">Nombres completos</Label>
          <Input 
            type="text" 
            id="nombres" 
            onChange={(e) => onChange("nombres", e.target.value)}
            value={initialData?.nombres || ""}
          />
        </div>
        <div>
          <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
          <DatePicker 
            id="fechaNacimiento"
            placeholder="Seleccione la fecha"
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