import cliente from "./cliente";

export interface EquipoDTO {
    id?: string;
    categoria: string;
    colorCamiseta: string;
    fechaRegistro?: string;
    fechaActualizacion?: string;
    activo?: boolean;
    academiaId?: string;
    nombreAcademia?: string;
    entrenadorId?: string;
    apellidosEntrenador: string;
    nombresEntrenador: string;
    delegadoId?: string;
    apellidosDelegado: string;
    nombresDelegado: string;
}

export const registrarEquipo = (academiaId: string, data: EquipoDTO) =>
    cliente.post<EquipoDTO>(`/api/academias/${academiaId}/equipos`, data);

export const editarEquipo = (academiaId: string, id: string, data: EquipoDTO) =>
    cliente.put<EquipoDTO>(`/api/academias/${academiaId}/equipos/${id}`, data);

export const buscarEquipo = (academiaId: string, id: string) =>
    cliente.get<EquipoDTO>(`/api/academias/${academiaId}/equipos/${id}`);

export const listarEquiposPorAcademia = (academiaId: string) =>
    cliente.get<EquipoDTO[]>(`/api/academias/${academiaId}/equipos`);