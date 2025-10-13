import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import EntrenadorInfoCard from "../../components/UserProfile/EntrenadorInfoCard";
import EntrenadorMetaCard from "../../components/UserProfile/EntrenadorMetaCard";

export default function EntrenadorProfile() {
  const { academiaId, entrenadorId } = useParams<{ academiaId: string, entrenadorId: string }>();
  return (
    <>
      <PageMeta
        title="Perfil del Entrenador"
        description="En esta página se verá la información completa del entrenador."
      />
      <PageBreadcrumb pageTitle="Perfil del Entrenador" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Perfil
        </h3>
        <div className="space-y-6">
          <EntrenadorMetaCard academiaId={academiaId!} entrenadorId={entrenadorId!} />
          <EntrenadorInfoCard academiaId={academiaId!} entrenadorId={entrenadorId!} />
        </div>
      </div>
    </>
  );
}
