import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import DelegadoMetaCard from "../../components/UserProfile/DelegadoMetaCard";
import DelegadoInfoCard from "../../components/UserProfile/DelegadoInfoCard";

export default function DelegadoProfile() {
  const { academiaId, delegadoId } = useParams<{ academiaId: string, delegadoId: string }>();
  return (
    <>
      <PageMeta
        title="Perfil del Delegado"
        description="En esta página se verá la información completa del delegado."
      />
      <PageBreadcrumb pageTitle="Perfil del Delegado" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Perfil
        </h3>
        <div className="space-y-6">
          <DelegadoMetaCard academiaId={academiaId!} delegadoId={delegadoId!} />
          <DelegadoInfoCard academiaId={academiaId!} delegadoId={delegadoId!} />
        </div>
      </div>
    </>
  );
}
