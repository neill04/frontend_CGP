import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TableAcademias from "../../components/tables/TableAcademias";
import { Link } from "react-router";

export default function AcademiasList() {
  return (
    <>
      <PageMeta
        title="Academias registradas"
        description="Página que muestra una tabla de las academias registradas"
      />
      <PageBreadcrumb pageTitle="Academias" />
      <div className="space-y-6">
        <Link
          to="/formAcademia"
          className="inline-flex select-none items-center gap-3 rounded-lg bg-red-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Registrar Academia
        </Link>
        <TableAcademias />
      </div>
    </>
  );
}