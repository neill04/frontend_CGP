import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import { AcademiaDTO } from "../../../../api/academiaApi";

interface DefaultAcademiaInputsProps {
  onChange: (field: keyof AcademiaDTO, value: string) => void;
  initialData?: AcademiaDTO;
  isEdit?: boolean;
}

export default function DefaultAcademiaInputs({ onChange, initialData, isEdit = false }: DefaultAcademiaInputsProps) {
  return (
    <ComponentCard title="Datos de la Academia">
      <div className="space-y-6">
        <div>
          <Label htmlFor="nombreAcademia">Nombre de la Academia</Label>
          <Input 
            type="text" 
            id="nombreAcademia" 
            onChange={(e) => onChange("nombreAcademia", e.target.value)}
            value={initialData?.nombreAcademia || ""}
          />
        </div>
        <div>
          <Label htmlFor="nombreRepresentante">Nombre del Representante</Label>
          <Input 
            type="text" 
            id="nombreRepresentante" 
            onChange={(e) => onChange("nombreRepresentante", e.target.value)}
            value={initialData?.nombreRepresentante || ""}  
          />
        </div>
        <div>
          <Label htmlFor="dniRepresentante">DNI del Representante</Label>
          <Input 
            type="text" 
            id="dniRepresentante" 
            onChange={(e) => onChange("dniRepresentante", e.target.value)}
            value={initialData?.dniRepresentante || ""}  
          />
        </div>
        <div>
          <Label htmlFor="telefonoRepresentante">Telefono del Representante</Label>
          <Input 
            type="text" 
            id="telefonoRepresentante" 
            onChange={(e) => onChange("telefonoRepresentante", e.target.value)}
            value={initialData?.telefonoRepresentante || ""}  
          />
        </div>
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
      </div>
    </ComponentCard>
  );
}
