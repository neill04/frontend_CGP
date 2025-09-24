import { useState, useEffect } from "react";
import { registrarDelegado, editarDelegado, buscarDelegado, listarDelegadosPorAcademia, DelegadoDTO } from "../../api/delegadoApi";

export function useDelegados(academiaId: string) {
  const [delegados, setDelegados] = useState<DelegadoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDelegados = async() => {
    if (!academiaId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listarDelegadosPorAcademia(academiaId);
      console.log(res.data);
      setDelegados(res.data);
    } catch (err) {
      setError("No se pudieron cargar los delegados de esta academia");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelegados();
  }, [academiaId]);

  const registerDelegado = async (data: DelegadoDTO) => {
    setLoading(true);
    setError(null);
    try {
      await registrarDelegado(academiaId, data);
      await fetchDelegados();
    } catch (err) {
      setError("Hubo un error al registrar al delegado.");
    } finally {
      setLoading(false);
    }
  };

  const updateDelegado = async (id: string, data: DelegadoDTO) => {
    setLoading(true);
    setError(null);
    try {
      await editarDelegado(academiaId, id, data);
      await fetchDelegados();
    } catch (err) {
      setError("Hubo un error al editar el delegado.");
    } finally {
      setLoading(false);
    }
  };

  const getDelegado = async (id: string) => {
    try {
      const res = await buscarDelegado(academiaId, id);
      console.log(res.data);
      return res.data;
    } catch (err) {
      setError("Hubo un error al obtener la información de este delegado");
    }
  };

  return {
    delegados,
    loading,
    error,
    fetchDelegados,
    registerDelegado,
    updateDelegado,
    getDelegado,
  };
}