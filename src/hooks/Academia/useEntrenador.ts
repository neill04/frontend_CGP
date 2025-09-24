import { useState, useEffect } from "react";
import { registrarEntrenador, editarEntrenador, buscarEntrenador, listarEntrenadoresPorAcademia, EntrenadorDTO } from "../../api/entrenadorApi";

export function useEntrenadores(academiaId: string) {
  const [entrenadores, setEntrenadores] = useState<EntrenadorDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntrenadores = async() => {
    if (!academiaId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listarEntrenadoresPorAcademia(academiaId);
      console.log(res.data);
      setEntrenadores(res.data);
    } catch (err) {
      setError("No se pudieron cargar los entrenadores de esta academia");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrenadores();
  }, [academiaId]);

  const registerEntrenador = async (data: EntrenadorDTO) => {
    setLoading(true);
    setError(null);
    try {
      await registrarEntrenador(academiaId, data);
      await fetchEntrenadores();
    } catch (err) {
      setError("Hubo un error al registrar al entrenador.");
    } finally {
      setLoading(false);
    }
  };

  const updateEntrenador = async (id: string, data: EntrenadorDTO) => {
    setLoading(true);
    setError(null);
    try {
      await editarEntrenador(academiaId, id, data);
      await fetchEntrenadores();
    } catch (err) {
      setError("Hubo un error al editar el entrenador.");
    } finally {
      setLoading(false);
    }
  };

  const getEntrenador = async (id: string) => {
    try {
      const res = await buscarEntrenador(academiaId, id);
      console.log(res.data);
      return res.data;
    } catch (err) {
      setError("Hubo un error al obtener la información de este entrenador");
    }
  };

  return {
    entrenadores,
    loading,
    error,
    fetchEntrenadores,
    registerEntrenador,
    updateEntrenador,
    getEntrenador,
  };
}