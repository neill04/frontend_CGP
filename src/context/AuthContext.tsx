import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import cliente, { TOKEN_KEY } from "../api/cliente";

export interface UserInfo {
  id: string;
  username: string;
  role: string;
  academiaId?: string;
  logoUrl?: string;
  nombreAcademia?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  expiresIn: number;
  user: UserInfo; 
}

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  authenticated: boolean;
  isAdmin: () => boolean;
  isAcademia: () => boolean;
  getAcademiaId: () => string | null;
  canAccessAcademia: (academiaId: string) => boolean;
  login: (credentials: LoginRequest) => Promise<UserInfo>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      setAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const response = await cliente.get<LoginResponse>("/api/auth/me"); 
      const userInfo = response.data.user; 

      setUser(userInfo);
      setAuthenticated(true);

    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginRequest): Promise<UserInfo> => {
    try {
      const response = await cliente.post<LoginResponse>("/api/auth/login", credentials);
      const { token, user: userInfo } = response.data;

      localStorage.setItem(TOKEN_KEY, token);

      setUser(userInfo);
      setAuthenticated(true);

      return userInfo;

    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setAuthenticated(false);
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setAuthenticated(false);

    cliente.post("/api/auth/logout").catch(() => {});

    window.location.href = "/signin";
  };

  const isAdmin = () => user?.role === "ADMINISTRADOR";
  const isAcademia = () => user?.role === "ACADEMIA";
  const getAcademiaId = () => user?.academiaId || null;
  
  const canAccessAcademia = (academiaId: string) => {
    if (isAdmin()) return true;
    if (isAcademia()) return user?.academiaId === academiaId;
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated,
        isAdmin,
        isAcademia,
        getAcademiaId,
        canAccessAcademia,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
  }
  return context;
}