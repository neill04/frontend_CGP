import cliente from "./cliente";

export interface EquipoDTO {
    id?: string;
    categoria: string;
    colorCamiseta: string;
    totalJugadores?: number;
    fechaRegistro?: string;
    fechaActualizacion?: string;
    activo?: boolean;
    academiaId?: string;
    nombreAcademia?: string;
    logoUrlAcademia?: string;
    entrenadorId?: string;
    dniEntrenador: string;
    apellidosEntrenador: string;
    nombresEntrenador: string;
    telefonoEntrenador: string;
    fotoUrlEntrenador?: string;
    delegadoId?: string;
    dniDelegado: string;
    apellidosDelegado: string;
    nombresDelegado: string;
    telefonoDelegado: string;
    fotoUrlDelegado?: string;
}

export const registrarEquipo = (academiaId: string, data: EquipoDTO) =>
    cliente.post<EquipoDTO>(`/api/academias/${academiaId}/equipos`, data);

export const editarEquipo = (academiaId: string, id: string, data: EquipoDTO) =>
    cliente.put<EquipoDTO>(`/api/academias/${academiaId}/equipos/${id}`, data);

export const buscarEquipo = (academiaId: string, id: string) =>
    cliente.get<EquipoDTO>(`/api/academias/${academiaId}/equipos/${id}`);

export const listarEquiposPorAcademia = (academiaId: string) =>
    cliente.get<EquipoDTO[]>(`/api/academias/${academiaId}/equipos`);

export const exportarPlanilla = (academiaId: string, equipoId: string) =>
    cliente.get(`/api/academias/${academiaId}/equipos/${equipoId}/planilla`, {
        responseType: "blob",
    });