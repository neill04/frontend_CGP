import cliente from "./cliente";

export interface ApoderadoDTO {
  id?: string;
  dni: string;
  apellidos: string;
  nombres: string;
  fechaNacimiento: string;
  parentesco: string;
  telefono: string;
}

export const registrarApoderado = (data: ApoderadoDTO) =>
  cliente.post<ApoderadoDTO>(`/api/apoderados`, data);

export const editarApoderado = (id: string, data: ApoderadoDTO) =>
  cliente.put<ApoderadoDTO>(`/api/apoderados/${id}`, data);

export const buscarApoderado = (id: string) =>
  cliente.get<ApoderadoDTO>(`/api/apoderados/${id}`);

export const eliminarApoderado = (id: string) =>
  cliente.delete<ApoderadoDTO>(`/api/apoderados/${id}`);

export const listarApoderadosPorEquipo = (equipoId: string) =>
  cliente.get<ApoderadoDTO[]>(`/api/apoderados/equipo/${equipoId}`);