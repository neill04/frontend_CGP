import { useState, useEffect } from "react";
import { registrarAcademia, editarAcademia, buscarAcademia, listarAcademias, AcademiaDTO } from "../../api/academiaApi";

export function useAcademias() {
    const [academias, setAcademias] = useState<AcademiaDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAcademias = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await listarAcademias();
            setAcademias(res.data);
        } catch (err) {
            setError("No se pudieron cargar las academias");
        } finally {
            setLoading(false);
        }
    };

    const postAcademia = async (data: AcademiaDTO) => {
        setLoading(true);
        setError(null);
        try {
            await registrarAcademia(data);
            await fetchAcademias(); 
        } catch (err) {
            setError("Error al registrar la academia");
        } finally {
            setLoading(false);
        }
    };

    const updateAcademia = async (id: string, data: AcademiaDTO) => {
        setLoading(true);
        setError(null);
        try {
            await editarAcademia(id, data);
            await fetchAcademias(); // refresca lista
        } catch (err) {
            setError("Error al editar la academia");
        } finally {
            setLoading(false);
        }
    };

    const getAcademia = async (id: string) => {
        try {
            const res = await buscarAcademia(id);
            return res.data;
        } catch (err) {
            setError("No se pudo obtener la academia");
            return null;
        }
    };

    useEffect(() => {
        fetchAcademias();
    }, []);

    return {
        academias,
        loading,
        error,
        fetchAcademias,
        postAcademia,
        updateAcademia,
        getAcademia,
    };
}