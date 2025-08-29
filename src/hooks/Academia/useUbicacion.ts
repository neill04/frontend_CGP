import { useState, useEffect } from "react";
import { getDepartamentos, getProvincias, getDistritos, Ubicacion } from "../../api/ubicacionApi";

export const useUbicacion = (initialDistritoId?: number | null) => {
  const [departamentos, setDepartamentos] = useState<Ubicacion[]>([]);
  const [provincias, setProvincias] = useState<Ubicacion[]>([]);
  const [distritos, setDistritos] = useState<Ubicacion[]>([]);

  const [selectedDepartamento, setSelectedDepartamento] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
  const [selectedDistrito, setSelectedDistrito] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartamentos = async() => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDepartamentos();
        setDepartamentos(res.data);
      } catch (err) {
        setError("Error al cargar departamentos");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartamentos();
  }, []);

  /*
  useEffect(() => {
    const loadInitialUbicacion = async () => {
      if (initialDistritoId) {
        setLoading(true);
        try {
          // Obtiene los IDs de departamento y provincia a partir del ID de distrito
          const res = await buscarUbicacionPorDistrito(initialDistritoId);
          const { departamentoId, provinciaId, distritoId } = res.data;

          // Carga las provincias del departamento
          const provinciasRes = await getProvincias(departamentoId);
          setProvincias(provinciasRes.data);
          
          // Carga los distritos de la provincia
          const distritosRes = await getDistritos(provinciaId);
          setDistritos(distritosRes.data);

          // Establece los valores seleccionados
          setSelectedDepartamento(departamentoId);
          setSelectedProvincia(provinciaId);
          setSelectedDistrito(distritoId);
          
        } catch (err) {
          setError("Error al cargar la ubicación inicial");
        } finally {
          setLoading(false);
        }
      }
    };
    loadInitialUbicacion();
  }, [initialDistritoId]); // Se ejecuta solo si el ID inicial cambia

  */

  const onDepartamentoChange = (id: number) => {
    setSelectedDepartamento(id);
    setSelectedProvincia(null);
    setSelectedDistrito(null);
    setProvincias([]);
    setDistritos([]);
    setLoading(true);
    setError(null);

    getProvincias(id)
      .then(res => setProvincias(res.data))
      .catch(() => setError("Error al cargar provincias"))
      .finally(() => setLoading(false));
  };

  const onProvinciaChange = (id: number) => {
    setSelectedProvincia(id);
    setSelectedDistrito(null);
    setDistritos([]);
    setLoading(true);
    setError(null);

    getDistritos(id)
      .then(res => setDistritos(res.data))
      .catch(() => setError("Error al cargar distritos"))
      .finally(() => setLoading(false));
  };

  const onDistritoChange = (id: number) => {
    setSelectedDistrito(id);
  };

  return {
    departamentos,
    provincias,
    distritos,
    selectedDepartamento,
    selectedProvincia,
    selectedDistrito,
    loading,
    error,
    onDepartamentoChange,
    onProvinciaChange,
    onDistritoChange,
  };
};
