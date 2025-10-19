import cliente from "./cliente";

export interface JugadorDTO {
  id?: string;
  dni: string;
  apellidos: string;
  nombres: string;
  fechaNacimiento: string;
  fotoUrl: string;
  activo?: boolean;
  equipoId?: string;
  apoderadoId?: string;
}

export const registrarJugador = (academiaId: string, equipoId: string, data: JugadorDTO) =>
  cliente.post<JugadorDTO>(`/api/academias/${academiaId}/equipos/${equipoId}/jugadores`, data);

export const editarJugador = (academiaId: string, equipoId: string, id: string, data: JugadorDTO) =>
  cliente.put<JugadorDTO>(`/api/academias/${academiaId}/equipos/${equipoId}/jugadores/${id}`, data);

export const buscarJugador = (academiaId: string, equipoId: string, id: string) =>
  cliente.get<JugadorDTO>(`/api/academias/${academiaId}/equipos/${equipoId}/jugadores/${id}`);

export const listarJugadoresPorEquipo = (academiaId: string, equipoId: string) =>
  cliente.get<JugadorDTO[]>(`/api/academias/${academiaId}/equipos/${equipoId}/jugadores`);

