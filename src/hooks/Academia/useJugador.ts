import { useState, useEffect } from "react";
import { registrarJugador, editarJugador, buscarJugador, listarJugadoresPorEquipo, listarTodosLosJugadoresPorAcademia, JugadorDTO } from "../../api/jugadorApi";

export function useJugadores(academiaId: string, equipoId?: string | null) {
  const [jugadores, setJugadores] = useState<JugadorDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJugadores = async() => {
    if (!academiaId) return;
    setLoading(true);
    setError(null);
    try {
      let res;
      if (typeof equipoId === "string") {
        res = await listarJugadoresPorEquipo(academiaId, equipoId);
      } else {
        res = await listarTodosLosJugadoresPorAcademia(academiaId);
      }
      setJugadores(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "No se pudieron cargar los jugadores del equipo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJugadores();
  }, [equipoId]);

  const registerJugador = async (data: JugadorDTO) => {
    if (typeof equipoId !== "string") {
      setError("Error");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await registrarJugador(academiaId, equipoId, data);
      await fetchJugadores();
    } catch (err: any) {
      setError(err.response?.data?.message || "No se pudo registrar al jugador.");
    } finally {
      setLoading(false);
    }
  };

  const updateJugador = async (id: string, data: JugadorDTO) => {
    if (typeof equipoId !== "string") {
      setError("Error");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await editarJugador(academiaId, equipoId, id, data);
      await fetchJugadores();
    } catch (err: any) {
      setError(err.response?.data?.message || "No se pudo actualizar la información del jugador.");
    } finally {
      setLoading(false);
    }
  };

  const getJugador = async (id: string) => {
    if (typeof equipoId !== "string") {
      setError("Error");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await buscarJugador(academiaId, equipoId, id);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Hubo un error al obtener la información de este jugador.");
    } finally {
      setLoading(false);
    }
  };

  return {
    jugadores,
    loading,
    error,
    fetchJugadores,
    registerJugador,
    updateJugador,
    getJugador,
  };
}