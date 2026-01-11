import cliente from "./cliente";
import { EquipoDTO } from "./equipoApi";
import { EntrenadorDTO } from "./entrenadorApi";
import { DelegadoDTO } from "./delegadoApi";
import { JugadorDTO } from "./jugadorApi";
import { UserInfo } from "../context/AuthContext";

export interface UserRequest {
  username: string;
  password: string;
  role: string;
}

export interface AsignarAcademiaRequest {
  academiaId: string;
}

export const listarTodosLosEquipos = () =>
  cliente.get<EquipoDTO[]>(`/api/equipos`);

export const listarTodosLosEntrenadores = () =>
  cliente.get<EntrenadorDTO[]>(`/api/entrenadores`);

export const listarTodosLosDelegados = () =>
  cliente.get<DelegadoDTO[]>(`/api/delegados`);

export const listarTodosLosJugadores = () =>
  cliente.get<JugadorDTO[]>(`/api/jugadores`);

export const listarTodosLosUsuarios = () =>
  cliente.get<UserInfo[]>(`/api/usuarios`);

export const registrarUsuario = (data: UserRequest) => 
  cliente.post<UserRequest>(`/api/auth/register`, data);

export const asignarAcademiaAUsuario = (id: string, data: AsignarAcademiaRequest) =>
  cliente.post<AsignarAcademiaRequest>(`/api/admin/users/${id}/academia`, data);

export const toggleUserStatus = (userId: string) =>
  cliente.patch(`/api/admin/users/${userId}/toggle-status`);