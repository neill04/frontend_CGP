import { useState, useEffect } from "react";
import { registrarEquipo, editarEquipo, buscarEquipo, listarEquiposPorAcademia, EquipoDTO } from "../../api/equipoApi";

export function useEquipos(academiaId: string) {
  const [equipos, setEquipos] = useState<EquipoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipos = async() => {
    if (!academiaId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listarEquiposPorAcademia(academiaId);
      setEquipos(res.data);
    } catch (err) {
      setError("No se pudieron cargar los equipos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, [academiaId]);

  const postEquipo = async (data: EquipoDTO) => {
    setLoading(true);
    setError(null);
    try {
      await registrarEquipo(academiaId, data);
      await fetchEquipos();
    } catch (err) {
      setError("No se puedo registrar al equipo");
    } finally {
      setLoading(false);
    }
  };

  const updateEquipo = async (id: string, data: EquipoDTO) => {
    setLoading(true);
    setError(null);
    try {
      await editarEquipo(academiaId, id, data);
      await fetchEquipos();
    } catch (err) {
      setError("Error al editar el equipo");
    } finally {
      setLoading(false);
    }
  };

  const getEquipo = async (id: string) => {
    try {
      const res = await buscarEquipo(academiaId, id);
      return res.data;
    } catch (err) {
      setError("No se pudo obtener al equipos");
    }
  };

  return {
    equipos,
    loading,
    error,
    fetchEquipos,
    postEquipo,
    updateEquipo,
    getEquipo,
  };
}