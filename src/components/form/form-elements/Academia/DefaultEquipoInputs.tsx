import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import { EquipoDTO } from "../../../../api/equipoApi";

interface DefaultEquipoInputsProps {
  onChange: (field: keyof EquipoDTO, value: string) => void;
  initialData?: EquipoDTO;
  isEdit?: boolean;
}

export default function DefaultEquipoInputs({ onChange, initialData, isEdit = false }: DefaultEquipoInputsProps) {
  return (
    <ComponentCard title="Datos del Equipo">
      <div className="space-y-6">
        <div>
          <Label htmlFor="colorCamiseta">Color de la Camiseta</Label>
          <Input 
            type="text" 
            id="colorCamiseta" 
            onChange={(e) => onChange("colorCamiseta", e.target.value)}
            value={initialData?.colorCamiseta || ""}
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
