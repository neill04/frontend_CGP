import { useState } from "react";
import {
  listarTodosLosEquipos,
  listarTodosLosEntrenadores,
  listarTodosLosDelegados,
  listarTodosLosJugadores,
} from "../api/adminApi";

import { EquipoDTO } from "../api/equipoApi";
import { EntrenadorDTO } from "../api/entrenadorApi";
import { DelegadoDTO } from "../api/delegadoApi";
import { JugadorDTO } from "../api/jugadorApi";

export function useAdmin() {
  const [equipos, setEquipos] = useState<EquipoDTO[]>([]);
  const [entrenadores, setEntrenadores] = useState<EntrenadorDTO[]>([]);
  const [delegados, setDelegados] = useState<DelegadoDTO[]>([]);
  const [jugadores, setJugadores] = useState<JugadorDTO[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    equipos,
    entrenadores,
    delegados,
    jugadores,

    loading,
    error,

    fetchEquipos,
    fetchEntrenadores,
    fetchDelegados,
    fetchJugadores,
  };
}