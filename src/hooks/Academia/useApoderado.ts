import { useState, useEffect } from "react";
import { registrarApoderado, editarApoderado, buscarApoderado, eliminarApoderado, listarApoderadosPorEquipo, ApoderadoDTO } from "../../api/apoderadoApi";

export function useApoderados(equipoId: string) {
  const [apoderados, setApoderados] = useState<ApoderadoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApoderados = async() => {
    if (!equipoId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listarApoderadosPorEquipo(equipoId);
      setApoderados(res.data);
    } catch (err) {
      setError("No se pudieron cargar los apoderados del equipo. ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApoderados();
  }, [equipoId]);

  const registerApoderado = async (data: ApoderadoDTO) => {
    setLoading(true);
    setError(null);
    try {
      await registrarApoderado(data);
      await fetchApoderados();
    } catch (err) {
      setError("Hubo un error al registrar al apoderado.");
    } finally {
      setLoading(false);
    }
  };

  const updateApoderado = async (id: string, data: ApoderadoDTO) => {
    setLoading(true);
    setError(null);
    try {
      await editarApoderado(id, data);
      await fetchApoderados();
    } catch (err) {
      setError("Hubo un error al editar el apoderado.");
    } finally {
      setLoading(false);
    }
  };

  const getApoderado = async (id: string) => {
    try {
      const res = await buscarApoderado(id);
      return res.data;
    } catch (err) {
      setError("Hubo un error al obtener la información del apoderado");
    }
  };

  const deleteApoderado = async (id: string) => {
    try {
      await eliminarApoderado(id);
    } catch (err) {
      setError("Hubo un error el eliminar al apoderado.");
    }
  };

  return {
    apoderados,
    loading,
    error,
    fetchApoderados,
    registerApoderado,
    updateApoderado,
    getApoderado,
    deleteApoderado,
  }
}