import { useState } from "react";
import { registrarAcademia, editarAcademia, buscarAcademia, listarAcademias, AcademiaDTO } from "../../api/academiaApi";
import { AxiosError } from "axios";

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
            const axiosError = err as AxiosError<{ message: string }>;

            if (axiosError.response?.status === 400) {
                const errorMessage = axiosError.response.data?.message || "Error de validación";
                setError(errorMessage);
                throw new Error(errorMessage);
            } else {
                setError("Error al registrar la academia");
                throw new Error("Error al registrar la academia");
            }
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
            const axiosError = err as AxiosError<{ message: string }>;

            if (axiosError.response?.status === 400) {
                const errorMessage = axiosError.response.data?.message || "Error de validación";
                setError(errorMessage);
                throw new Error(errorMessage);
            } else {
                setError("Error al editar la academia");
                throw new Error("Error al editar la academia");
            }
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