import cliente from "./cliente";

export interface Ubicacion {
    id: number;
    nombre: string;
}

export const getDepartamentos = () =>
    cliente.get<Ubicacion[]>("/api/ubicacion/departamentos");

export const getProvincias = (departamentoId: number) => 
    cliente.get<Ubicacion[]>(`/api/ubicacion/departamentos/${departamentoId}/provincias`);

export const getDistritos = (provinciaId: number) =>
    cliente.get<Ubicacion[]>(`/api/ubicacion/provincias/${provinciaId}/distritos`);