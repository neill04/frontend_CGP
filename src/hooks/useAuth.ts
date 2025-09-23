import { useEffect, useState } from "react";
import cliente from "../api/cliente";

interface UseAuthResult {
  loading: boolean;
  authenticated: boolean;
}

export function useAuth(): UseAuthResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    cliente
      .get("api/auth/check", { withCredentials: true }) 
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, authenticated };
}