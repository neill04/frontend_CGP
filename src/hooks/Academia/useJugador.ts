import { useState, useEffect } from "react";
import { registrarJugador, editarJugador, buscarJugador, listarJugadoresPorEquipo, JugadorDTO } from "../../api/jugadorApi";

export function useJugadores(academiaId: string, equipoId: string) {
  const [jugadores, setJugadores] = useState<JugadorDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJugadores = async() => {
    if (!academiaId && !equipoId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listarJugadoresPorEquipo(academiaId, equipoId);
      setJugadores(res.data);
    } catch (err) {
      setError("No se pudieron cargar los jugadores del equipo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJugadores();
  }, [equipoId]);

  const registerJugador = async (data: JugadorDTO) => {
    setLoading(true);
    setError(null);
    try {
      await registrarJugador(academiaId, equipoId, data);
      await fetchJugadores();
    } catch (err) {
      setError("No se pudo registrar al jugador.");
    } finally {
      setLoading(false);
    }
  };

  const updateJugador = async (id: string, data: JugadorDTO) => {
    setLoading(true);
    setError(null);
    try {
      await editarJugador(academiaId, equipoId, id, data);
      await fetchJugadores();
    } catch (err) {
      setError("No se pudo actualizar la información del jugador.");
    } finally {
      setLoading(false);
    }
  };

  const getJugador = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await buscarJugador(academiaId, equipoId, id);
      return res.data;
    } catch (err) {
      setError("Hubo un error al obtener la información de este jugador.");
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