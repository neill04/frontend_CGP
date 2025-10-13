import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useAcademias } from "../../hooks/Academia/useAcademia";
import { useEffect, useState } from "react";
import { AcademiaDTO } from "../../api/academiaApi";
import TableEquipos from "../../components/tables/TableEquipos";
import { Link } from "react-router";
import { useEntrenadores } from "../../hooks/Academia/useEntrenador";
import { useDelegados } from "../../hooks/Academia/useDelegado";
import TableDelegados from "../../components/tables/TableDelegados";
import TableEntrenadores from "../../components/tables/TableEntrenadores";

export default function AcademiaInfo() {
  const { id } = useParams<{ id: string }>();
  const { getAcademia } = useAcademias();

  const { fetchEntrenadores } = useEntrenadores(id!);
  const { fetchDelegados } = useDelegados(id!);

  const [academia, setAcademia] = useState<AcademiaDTO>({
    nombreAcademia: "",
    nombreRepresentante: "",
    dniRepresentante: "",
    telefonoRepresentante: "",
    logoUrl: "",
    distritoId: 0,
  });

  const [activeView, setActiveView] = useState<"equipos" | "entrenadores" | "delegados">(() => {
    return (localStorage.getItem("academiaActiveView") as "equipos" | "entrenadores" | "delegados") || "equipos";
  });

  useEffect(() => {
    const fetchAcademiaData = async () => {
      if (id) {
        const academia = await getAcademia(id);
        if (academia) {
          setAcademia(academia);
        }
      }
    };
    fetchAcademiaData();
    fetchEntrenadores();
    fetchDelegados();
  }, [id]);

  useEffect(() => {
    localStorage.setItem("academiaActiveView", activeView);
  }, [activeView]);

  return (
    <>
      <PageMeta
        title="Equipos registrados de la academia"
        description="Página que muestra una tabla con todos los equipos registrados por la academia"
      />
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{academia.nombreAcademia}</h1>
          <div className="mx-auto h-40 w-40 rounded-lg shadow-md border-4 border-black flex items-center justify-center bg-gray-100">
            {academia.logoUrl && (
              <img 
                src={academia.logoUrl}
                className="mx-auto h-40 w-40 object-contain"
              />
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
          to={`/academias/${academia.id}/formEquipo`}
          className="inline-flex select-none items-center gap-3 rounded-lg bg-red-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Registrar categoría
          </Link>
          <Link
            to={`/academias/${academia.id}/formEntrenador`}
            className="inline-flex select-none items-center gap-3 rounded-lg bg-red-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Registrar Entrenador
          </Link>
          <Link
            to={`/academias/${academia.id}/formDelegado`}
            className="inline-flex select-none items-center gap-3 rounded-lg bg-red-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Registrar Delegado
          </Link>
          <button
            onClick={() => setActiveView("equipos")}
            className="inline-flex select-none items-center gap-3 rounded-lg border border-black bg-white py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-black/40 transition-all hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black-/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Ver equipos
          </button>
          <button
            onClick={() => setActiveView("entrenadores")}
            className="inline-flex select-none items-center gap-3 rounded-lg border border-black bg-white py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-black/40 transition-all hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black-/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Ver entrenadores
          </button>
          <button
            onClick={() => setActiveView("delegados")}
            className="inline-flex select-none items-center gap-3 rounded-lg border border-black bg-white py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-black/40 transition-all hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black-/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Ver delegados
          </button>
        </div>
        {activeView === "equipos" && <TableEquipos academiaId={id!} />}
        {activeView === "entrenadores" && <TableEntrenadores academiaId={id!} />} 
        {activeView === "delegados" && <TableDelegados academiaId={id!} />} 
      </div>
    </>
  );
}