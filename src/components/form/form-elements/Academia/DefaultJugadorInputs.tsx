import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import DatePicker from "../../date-picker";
import { JugadorDTO } from "../../../../api/jugadorApi";

interface DefaultJugadorInputsProps {
  onChange: (field: keyof JugadorDTO, value: string) => void;
  initialData?: JugadorDTO;
  errors?: Partial<Record<keyof JugadorDTO, string>>;
}

export default function DefaultJugadorInputs({ 
  onChange, 
  initialData, 
  errors = {} 
}: DefaultJugadorInputsProps) {
  return (
    <ComponentCard title="Datos del Jugador">
      <div className="space-y-6">
        <div>
          <Label htmlFor="numeroCamiseta">
            Número de Camiseta <span className="text-red-500">*</span>
          </Label>
          <Input 
            type="number" 
            id="numeroCamiseta" 
            onChange={(e) => onChange("numeroCamiseta", e.target.value)}
            value={initialData?.numeroCamiseta ?? ""}
            className={errors.numeroCamiseta ? "border-red-500 focus:border-red-500" : ""}
            placeholder="Ej: 10"
            min="1"
            max="99"
          />
          {errors.numeroCamiseta && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.numeroCamiseta}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="dni">
            DNI <span className="text-red-500">*</span>
          </Label>
          <Input 
            type="text" 
            id="dni" 
            onChange={(e) => onChange("dni", e.target.value)}
            value={initialData?.dni || ""}
            className={errors.dni ? "border-red-500 focus:border-red-500" : ""}
            placeholder="Ej: 12345678"
            maxLength={8}
          />
          {errors.dni && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.dni}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="apellidos">
            Apellidos completos <span className="text-red-500">*</span>
          </Label>
          <Input 
            type="text" 
            id="apellidos" 
            onChange={(e) => onChange("apellidos", e.target.value)}
            value={initialData?.apellidos || ""}
            className={errors.apellidos ? "border-red-500 focus:border-red-500" : ""}
            placeholder="Ej: García López"
          />
          {errors.apellidos && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.apellidos}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="nombres">
            Nombres completos <span className="text-red-500">*</span>
          </Label>
          <Input 
            type="text" 
            id="nombres" 
            onChange={(e) => onChange("nombres", e.target.value)}
            value={initialData?.nombres || ""}
            className={errors.nombres ? "border-red-500 focus:border-red-500" : ""}
            placeholder="Ej: Juan Carlos"
          />
          {errors.nombres && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.nombres}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="fechaNacimiento">
            Fecha de Nacimiento <span className="text-red-500">*</span>
          </Label>
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
          {errors.fechaNacimiento && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
          {errors.fechaNacimiento}
            </p>
          )}
        </div>
      </div>
    </ComponentCard>
  );
} 