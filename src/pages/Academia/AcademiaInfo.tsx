import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useAcademias } from "../../hooks/Academia/useAcademia";
import { useEffect, useState } from "react";
import { AcademiaDTO } from "../../api/academiaApi";
import TableEquipos from "../../components/tables/TableEquipos";
import { Link } from "react-router";

export default function AcademiaInfo() {
  const { id } = useParams<{ id: string }>();
  const { getAcademia } = useAcademias();

  const [data, setData] = useState<AcademiaDTO>({
    nombreAcademia: "",
    nombreRepresentante: "",
    dniRepresentante: "",
    telefonoRepresentante: "",
    logoUrl: "",
    distritoId: 0,
  });

  useEffect(() => {
    const fetchAcademiaData = async () => {
      if (id) {
        const academia = await getAcademia(id);
        if (academia) {
          setData(academia);
        }
      }
    };
    fetchAcademiaData();
  }, [id]);

  return (
    <>
      <PageMeta
        title="Equipos registrados de la academia"
        description="Página que muestra una tabla con todos los equipos registrados por la academia"
      />
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{data.nombreAcademia}</h1>
          {data.logoUrl && (
            <img 
              src={data.logoUrl}
              className="mx-auto h-40 w-40 object-contain rounded-lg shadow-md border-4 border-black"
            />
          )}
        </div>
        <div className="flex gap-4">
          <Link
          to="/formEquipo"
          className="inline-flex select-none items-center gap-3 rounded-lg bg-red-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Registrar Equipo
          </Link>
          <Link
            to="/formEntrenador"
            className="inline-flex select-none items-center gap-3 rounded-lg bg-red-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Registrar Entrenador
          </Link>
          <Link
            to="/formDelegado"
            className="inline-flex select-none items-center gap-3 rounded-lg bg-red-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Registrar Delegado
          </Link>
        </div>
        <TableEquipos academiaId={id!} />
      </div>
    </>
  );
}