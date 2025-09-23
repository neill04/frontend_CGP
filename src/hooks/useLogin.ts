import { useState } from "react";
import cliente from "../api/cliente";

interface LoginData {
  email: string;
  password: string;
}

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await cliente.post("api/auth/login", data, { withCredentials: true });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}