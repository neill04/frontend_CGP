import { useState, useEffect } from "react";
import { useEntrenadores } from "../../hooks/Academia/useEntrenador";
import { EntrenadorDTO } from "../../api/entrenadorApi";

interface EntrenadorMetaCardProps {
  academiaId: string;
  entrenadorId: string;
}

export default function EntrenadorMetaCard({ academiaId, entrenadorId }: EntrenadorMetaCardProps) {
  const { getEntrenador } = useEntrenadores(academiaId!);

  const [ formData, setFormData ] = useState<EntrenadorDTO>({
    dni: "",
    apellidos: "",
    nombres: "",
    licencia: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    fotoUrl: "",
    nombreAcademia: "",
  });

  useEffect(() => {
    const fetchEntrenadorData = async () => {
      const entrenador = await getEntrenador(entrenadorId!);
      console.log(entrenador);
      if (entrenador) {
          setFormData(entrenador);
      }
    };
    fetchEntrenadorData();
  }, [entrenadorId]); 

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src={formData.fotoUrl} alt="user" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {`${formData.nombres} ${formData.apellidos}`}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.nombreAcademia}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Arizona, United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
