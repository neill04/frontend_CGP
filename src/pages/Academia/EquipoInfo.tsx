import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useEquipos } from "../../hooks/Academia/useEquipo";
import { EquipoDTO } from "../../api/equipoApi";
import TableJugadores from "../../components/tables/TableJugadores";

export default function EquipoInfo() {
  const { academiaId, equipoId } = useParams<{ academiaId: string, equipoId: string }>();
  const { getEquipo } = useEquipos(equipoId!);

  const [equipo, setEquipo] = useState<EquipoDTO>({
    categoria: "",
    colorCamiseta: "",
    nombreAcademia: "",
    apellidosEntrenador: "",
    nombresEntrenador: "",
    apellidosDelegado: "",
    nombresDelegado: "",
  });

  useEffect(() => {
    const fetchEquipoData = async () => {
      if (equipoId) {
        const equipo = await getEquipo(equipoId!);
        console.log(equipo);
        if (equipo) {
          setEquipo(equipo);
        }
      }
    };
    fetchEquipoData();
  }, [academiaId]);

  return (
    <>
      <PageMeta
        title="Información del equipo"
        description="Página que muestra una tabla con todos los jugadores registrados en el equipo"
      />
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{equipo.nombreAcademia} - {equipo.categoria}</h1>
        </div>
          <Link
          to={`/academias/${academiaId}/equipos/${equipoId}/jugadores`}
          className="inline-flex select-none items-center gap-3 rounded-lg bg-red-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Registrar Jugador
          </Link>
          <TableJugadores academiaId={academiaId!} equipoId={equipoId!} />
      </div>
    </>
  );
}