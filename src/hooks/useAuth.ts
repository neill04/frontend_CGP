import { useEffect, useState } from "react";
import cliente from "../api/cliente";

interface UseAuthResult {
  loading: boolean;
  authenticated: boolean;
}

export function useAuth(): UseAuthResult {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    cliente
      .get("api/auth/check", { withCredentials: true }) 
      .then(() => {
        if (isMounted) setAuthenticated(true);
      })
      .catch(() => {
        if (isMounted) setAuthenticated(false);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { loading, authenticated };
}