import cliente from "./cliente";

export interface AcademiaDTO {
    id?: number;
    nombreAcademia: string;
    nombreRepresentante: string;
    dniRepresentante: string;
    logoUrl: string;
    estado?: string;
    fechaRegistro?: string;
    fechaActualizacion?: string;
    distritoId?: number;
    nombreDistrito?: string;
}

export const registrarAcademia = (distritoId: number, data: AcademiaDTO) =>
    cliente.post<AcademiaDTO>(`/api/academias/${distritoId}`, data);

export const editarAcademia = (id: number, data: AcademiaDTO) =>
    cliente.put<AcademiaDTO>(`/api/academias/${id}`, data);

export const buscarAcademia = (id: number) =>
    cliente.get<AcademiaDTO>(`/api/academias/${id}`);

export const listarAcademias = () =>
    cliente.get<AcademiaDTO[]>(`/api/academias`);