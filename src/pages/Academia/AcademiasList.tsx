import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TableAcademias from "../../components/tables/TableAcademias";

export default function AcademiasList() {
  return (
    <>
      <PageMeta
        title="Academias Registradas"
        description="Página que muestra una tabla de las academias registradas"
      />
      <PageBreadcrumb pageTitle="Academias" />
      <div className="space-y-6">
          <TableAcademias />
      </div>
    </>
  );
}