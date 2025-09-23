import cliente from "./cliente";

export interface AcademiaDTO {
    id?: string;
    nombreAcademia: string;
    nombreRepresentante: string;
    dniRepresentante: string;
    telefonoRepresentante: string;
    logoUrl: string;
    activo?: boolean;
    fechaRegistro?: string;
    fechaActualizacion?: string;
    distritoId: number;
    nombreDistrito?: string;
}

export const registrarAcademia = (data: AcademiaDTO) =>
    cliente.post<AcademiaDTO>(`/api/academias`, data);

export const editarAcademia = (id: string, data: AcademiaDTO) =>
    cliente.put<AcademiaDTO>(`/api/academias/${id}`, data);

export const buscarAcademia = (id: string) =>
    cliente.get<AcademiaDTO>(`/api/academias/${id}`);

export const listarAcademias = () =>
    cliente.get<AcademiaDTO[]>(`/api/academias`);