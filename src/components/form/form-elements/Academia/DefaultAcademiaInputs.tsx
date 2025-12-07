import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import { AcademiaDTO } from "../../../../api/academiaApi";

interface DefaultAcademiaInputsProps {
  onChange: (field: keyof AcademiaDTO, value: string) => void;
  initialData?: AcademiaDTO;
  errors?: Partial<Record<keyof AcademiaDTO, string>>;
  isEdit?: boolean;
}

export default function DefaultAcademiaInputs({ 
  onChange, 
  initialData, 
  errors = {},
  isEdit = false 
}: DefaultAcademiaInputsProps) {
  return (
    <ComponentCard title="Datos de la Academia">
      <div className="space-y-6">
        <div>
          <Label htmlFor="nombreAcademia">
            Nombre de la Academia <span className="text-red-500">*</span>
          </Label>
          <Input 
            type="text" 
            id="nombreAcademia" 
            onChange={(e) => onChange("nombreAcademia", e.target.value)}
            value={initialData?.nombreAcademia || ""}
            className={errors.nombreAcademia ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.nombreAcademia && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.nombreAcademia}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="nombreRepresentante">
            Nombre del Representante <span className="text-red-500">*</span>
          </Label>
          <Input 
            type="text" 
            id="nombreRepresentante" 
            onChange={(e) => onChange("nombreRepresentante", e.target.value)}
            value={initialData?.nombreRepresentante || ""}
            className={errors.nombreRepresentante ? "border-red-500 focus:border-red-500" : ""}
            placeholder="Ej: Juan Carlos García López"
          />
          {errors.nombreRepresentante && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.nombreRepresentante}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="dniRepresentante">
            DNI del Representante <span className="text-red-500">*</span>
          </Label>
          <Input 
            type="text" 
            id="dniRepresentante" 
            onChange={(e) => onChange("dniRepresentante", e.target.value)}
            value={initialData?.dniRepresentante || ""}
            className={errors.dniRepresentante ? "border-red-500 focus:border-red-500" : ""}
            placeholder="Ej: 12345678"
            maxLength={8}
          />
          {errors.dniRepresentante && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.dniRepresentante}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="telefonoRepresentante">
            Teléfono del Representante <span className="text-red-500">*</span>
          </Label>
          <Input 
            type="tel" 
            id="telefonoRepresentante" 
            onChange={(e) => onChange("telefonoRepresentante", e.target.value)}
            value={initialData?.telefonoRepresentante || ""}
            className={errors.telefonoRepresentante ? "border-red-500 focus:border-red-500" : ""}
            placeholder="Ej: 987654321"
            maxLength={9}
          />
          {errors.telefonoRepresentante && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.telefonoRepresentante}
            </p>
          )}
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
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="fechaRegistro">Fecha de Registro</Label>
              <Input 
                type="text" 
                id="fechaRegistro" 
                value={initialData?.fechaRegistro || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="fechaActualizacion">Fecha de la última modificación</Label>
              <Input 
                type="text" 
                id="fechaActualizacion" 
                value={initialData?.fechaActualizacion || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </>
        )}
      </div>
    </ComponentCard>
  );
}