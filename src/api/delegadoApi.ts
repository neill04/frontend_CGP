import cliente from "./cliente";

export interface DelegadoDTO {
  id?: string;
  dni: string;
  apellidos: string;
  nombres: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  fotoUrl: string;
  fechaRegistro?: string;
  fechaActualizacion?: string;
}

export const registrarDelegado = (academiaId: string, data: DelegadoDTO) =>
  cliente.post<DelegadoDTO>(`/api/academias/${academiaId}/delegados`, data);

export const editarDelegado = (academiaId: string, id: string, data: DelegadoDTO) =>
  cliente.put<DelegadoDTO>(`/api/academias/${academiaId}/delegados/${id}`, data);

export const buscarDelegado = (academiaId: string, id: string) =>
  cliente.get<DelegadoDTO>(`/api/academias/${academiaId}/delegados/${id}`);

export const listarDelegadosPorAcademia = (academiaId: string) =>
  cliente.get<DelegadoDTO[]>(`/api/academias/${academiaId}/delegados`);