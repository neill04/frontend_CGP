import cliente from "./cliente";
import { EquipoDTO } from "./equipoApi";
import { EntrenadorDTO } from "./entrenadorApi";
import { DelegadoDTO } from "./delegadoApi";
import { JugadorDTO } from "./jugadorApi";

export const listarTodosLosEquipos = () =>
  cliente.get<EquipoDTO[]>(`/api/equipos`);

export const listarTodosLosEntrenadores = () =>
  cliente.get<EntrenadorDTO[]>(`/api/entrenadores`);

export const listarTodosLosDelegados = () =>
  cliente.get<DelegadoDTO[]>(`/api/delegados`);

export const listarTodosLosJugadores = () =>
  cliente.get<JugadorDTO[]>(`/api/jugadores`);