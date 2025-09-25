import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import DatePicker from "../../date-picker";
import { DelegadoDTO } from "../../../../api/delegadoApi";

interface DefaultDelegadoInputsProps {
  onChange: (field: keyof DelegadoDTO, value: string) => void;
  initialData?: DelegadoDTO;
  isEdit?: boolean;
}

export default function DefaultDelegadoInputs({ onChange, initialData, isEdit = false }: DefaultDelegadoInputsProps) {
  return (
    <ComponentCard title="Datos del Delegado">
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
          <Label htmlFor="telefono">Telefono</Label>
          <Input 
            type="text" 
            id="telefono" 
            onChange={(e) => onChange("telefono", e.target.value)}
            value={initialData?.telefono || ""}
          />
        </div>
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input 
            type="text" 
            id="email" 
            placeholder="delegado@example.com"
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
        {/*
        {isEdit && (
          <>
            <div>
            <Label htmlFor="activo">Estado de la Academia</Label>
            <Input 
              type="text" 
              id="activo" 
              value={initialData?.activo ? "Activo" : "Inactivo"}
              disabled
            />
            </div>
            <div>
              <Label htmlFor="fechaRegistro">Fecha de Registro</Label>
              <Input 
                type="text" 
                id="fechaRegistro" 
                value={initialData?.fechaRegistro || ""}
                disabled  
              />
            </div>
            <div>
              <Label htmlFor="fechaActualizacion">Fecha de la ultima modificación de datos</Label>
              <Input 
                type="text" 
                id="fechaActualizacion" 
                value={initialData?.fechaActualizacion || ""}
                disabled  
              />
            </div>
          </>
        )}
        */}
      </div>
    </ComponentCard>
  );
}