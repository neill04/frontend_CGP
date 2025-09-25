import cliente from "./cliente";

export interface EntrenadorDTO {
  id?: string;
  dni: string;
  apellidos: string;
  nombres: string;
  licencia: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  fotoUrl?: string;
  estadoDisciplina?: string;
  observaciones?: string;
  fechaRegistro?: string;
  fechaActualizacion?: string;
}

export const registrarEntrenador = (academiaId: string, data: EntrenadorDTO) =>
  cliente.post<EntrenadorDTO>(`/api/academias/${academiaId}/entrenadores`, data);

export const editarEntrenador = (academiaId: string, id: string, data: EntrenadorDTO) =>
  cliente.put<EntrenadorDTO>(`/api/academias/${academiaId}/entrenadores/${id}`, data);

export const buscarEntrenador = (academiaId: string, id: string) =>
  cliente.get<EntrenadorDTO>(`/api/academias/${academiaId}/entrenadores/${id}`);

export const listarEntrenadoresPorAcademia = (academiaId: string) =>
  cliente.get<EntrenadorDTO[]>(`/api/academias/${academiaId}/entrenadores`);