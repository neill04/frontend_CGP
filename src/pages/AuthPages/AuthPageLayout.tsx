import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-white dark:bg-gray-900">
      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Lado derecho - Formulario (se mantiene igual) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          {children}
        </div>

        {/* Lado izquierdo - Logo y fondo rojo */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden">
          {/* Patrón de fondo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              {/* Círculos decorativos */}
              <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12">
            {/* Logo en círculo dorado */}
            <div className="relative mb-8">
              {/* Círculo dorado exterior */}
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-3 shadow-2xl">
                {/* Círculo blanco interior */}
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-8 shadow-inner">
                  {/* Aquí va tu logo */}
                  <img
                    src="/images/logo/logo_CGP.png"
                    alt="Gol Perú Logo"
                    className="w-full h-full object-contain"
                  />
                  {/* Placeholder si no tienes el logo todavía */}
                  {/* <div className="text-red-600 text-6xl font-bold">
                    GOL<br/>PERÚ
                  </div> */}
                </div>
              </div>

              {/* Brillo dorado animado */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-300 to-transparent opacity-50 animate-pulse"></div>
            </div>

            {/* Texto descriptivo */}
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold text-white mb-3">
                Bienvenido a Copa Gol Perú
              </h2>
              <p className="text-white/90 text-lg">
                Torneo de Liga de Menores
              </p>
              <p className="text-white/80 text-sm mt-4">
                Sistema de gestión para academias deportivas
              </p>
            </div>

            {/* Decoración inferior */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/50"></div>
              <div className="w-2 h-2 rounded-full bg-white/70"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>

          {/* Patrón de líneas decorativas */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
