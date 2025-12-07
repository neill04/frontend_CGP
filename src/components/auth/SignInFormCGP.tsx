import { useState } from "react";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";
import { useAuthContext, LoginRequest } from "../../context/AuthContext";

export default function SignInFormCGP() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{username?: string; password?: string}>({});
  
  const { login } = useAuthContext(); 
  const navigate = useNavigate();

  // Validación de campos
  const validateFields = (): boolean => {
    const errors: {username?: string; password?: string} = {};

    if (!username.trim()) {
      errors.username = "El usuario es requerido";
    } else if (username.length < 3) {
      errors.username = "El usuario debe tener al menos 3 caracteres";
    }

    if (!password) {
      errors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    setError(null);

    const credentials: LoginRequest = { username, password };

    try {
      const user = await login(credentials);
      
      if (user) {
        // Pequeño delay para mejor UX
        setTimeout(() => {
          if (user.role === "ADMINISTRADOR") {
            navigate("/");
          } else if (user.role === "ACADEMIA" && user.academiaId) {
            navigate(`/academias/${user.academiaId}`);
          } else {
            navigate("/");
          }
        }, 500);
      }
    } catch (err: any) {
      // Mensajes de error más específicos
      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos");
      } else if (err.response?.status === 403) {
        setError("No tienes permisos para acceder");
      } else if (!navigator.onLine) {
        setError("No hay conexión a internet");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    // Limpiar error del campo al escribir
    if (fieldErrors.username) {
      setFieldErrors(prev => ({ ...prev, username: undefined }));
    }
    // Limpiar error general
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Limpiar error del campo al escribir
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    }
    // Limpiar error general
    if (error) setError(null);
  };

  const isFormValid = username.trim() && password;

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4 py-10">
        
        {/* Logo o icono opcional */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Card de login */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Alerta de error general */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-shake">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Usuario */}
            <div>
              <Label htmlFor="username">
                Usuario <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <Input 
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`pl-10 ${fieldErrors.username ? "border-red-500 focus:border-red-500" : ""}`}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <Label htmlFor="password">
                Contraseña <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`pl-10 pr-10 ${fieldErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeIcon className="fill-current size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-current size-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Botón de submit */}
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-red-500 hover:bg-red-600" 
                size="sm"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Iniciar Sesión
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Footer opcional */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>¿Olvidaste tu contraseña?{" "}
              <button className="text-red-500 hover:text-red-600 font-medium transition">
                Recuperar
              </button>
            </p>
          </div>
        </div>

        {/* Footer informativo */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Desarrollado por NEOC Soft
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}