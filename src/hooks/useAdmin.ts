import { useState } from "react";
import {
  listarTodosLosEquipos,
  listarTodosLosEntrenadores,
  listarTodosLosDelegados,
  listarTodosLosJugadores,
  listarTodosLosUsuarios,
  registrarUsuario,
  UserRequest,
} from "../api/adminApi";

import { EquipoDTO } from "../api/equipoApi";
import { EntrenadorDTO } from "../api/entrenadorApi";
import { DelegadoDTO } from "../api/delegadoApi";
import { JugadorDTO } from "../api/jugadorApi";
import { UserInfo } from "../context/AuthContext";


export function useAdmin() {
  const [equipos, setEquipos] = useState<EquipoDTO[]>([]);
  const [entrenadores, setEntrenadores] = useState<EntrenadorDTO[]>([]);
  const [delegados, setDelegados] = useState<DelegadoDTO[]>([]);
  const [jugadores, setJugadores] = useState<JugadorDTO[]>([]);
  const [usuarios, setUsuarios] = useState<UserInfo[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleUserStatus = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await toggleUserStatus(userId);
      await fetchUsuarios(); 
    } catch (err) {
      setError("Error al cambiar el estado del usuario");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUsuario = async (data: UserRequest) => {
    setLoading(true);
    setError(null);
    try {
      await registrarUsuario(data);
    } catch (err) {
      setError("Hubo un error al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listarTodosLosUsuarios();
      setUsuarios(res.data);
    } catch (err) {
      setError("No se pudieron cargar a los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listarTodosLosEquipos();
      setEquipos(res.data);
    } catch (err) {
      setError("No se pudieron cargar los equipos");
    } finally {
      setLoading(false);
    }
  };

  const fetchEntrenadores = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listarTodosLosEntrenadores();
      setEntrenadores(res.data);
    } catch (err) {
      setError("No se pudieron cargar los entrenadores");
    } finally {
      setLoading(false);
    }
  };

  const fetchDelegados = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listarTodosLosDelegados();
      setDelegados(res.data);
    } catch (err) {
      setError("No se pudieron cargar los delegados");
    } finally {
      setLoading(false);
    }
  };

  const fetchJugadores = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listarTodosLosJugadores();
      setJugadores(res.data);
    } catch (err) {
      setError("No se pudieron cargar los jugadores");
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    equipos,
    entrenadores,
    delegados,
    jugadores,

    loading,
    error,

    toggleUserStatus,
    registerUsuario,
    fetchUsuarios,
    fetchEquipos,
    fetchEntrenadores,
    fetchDelegados,
    fetchJugadores,
  };
}