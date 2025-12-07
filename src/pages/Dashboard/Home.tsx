import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";

// Simulación de datos - Reemplazar con llamadas a API reales
const useDashboardData = () => {
  const [data, setData] = useState({
    jugadores: 450,
    equipos: 32,
    academias: 16,
    entrenadores: 48,
    delegados: 48,
    partidos: 128,
    jugadoresChange: 12,
    equiposChange: 4,
    academiasChange: 2,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return { data, loading };
};

export default function Home() {
  const { data, loading } = useDashboardData();

  if (loading) {
    return (
      <>
        <PageMeta title="Dashboard | Copa Gol Perú 2025" description="Panel de administración" />
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const stats = [
    {
      title: "Jugadores Activos",
      value: data.jugadores,
      change: data.jugadoresChange,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Equipos / Categorías",
      value: data.equipos,
      change: data.equiposChange,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Academias Registradas",
      value: data.academias,
      change: data.academiasChange,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Entrenadores",
      value: data.entrenadores,
      change: 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Delegados",
      value: data.delegados,
      change: 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Partidos Programados",
      value: data.partidos,
      change: 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
  ];

  return (
    <>
      <PageMeta
        title="Dashboard | Copa Gol Perú 2025"
        description="Panel de administración - Copa Gol Perú 2025"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">
                Resumen general de Copa Gol Perú 2025
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Última actualización</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value.toLocaleString()}
                  </h3>
                  {stat.change !== 0 && (
                    <div className="flex items-center gap-1">
                      <svg
                        className={`w-4 h-4 ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={stat.change > 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"}
                        />
                      </svg>
                      <span className={`text-sm font-medium ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(stat.change)} este mes
                      </span>
                    </div>
                  )}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <div className={stat.textColor}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribución por Categorías */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Jugadores por Categoría
            </h3>
            <div className="space-y-4">
              {[
                { categoria: "Sub-5", jugadores: 45, color: "bg-blue-500", porcentaje: 10 },
                { categoria: "Sub-6", jugadores: 52, color: "bg-green-500", porcentaje: 12 },
                { categoria: "Sub-7", jugadores: 58, color: "bg-yellow-500", porcentaje: 13 },
                { categoria: "Sub-8", jugadores: 62, color: "bg-red-500", porcentaje: 14 },
                { categoria: "Sub-9", jugadores: 55, color: "bg-purple-500", porcentaje: 12 },
                { categoria: "Sub-10", jugadores: 48, color: "bg-indigo-500", porcentaje: 11 },
                { categoria: "Sub-11", jugadores: 42, color: "bg-pink-500", porcentaje: 9 },
                { categoria: "Otras", jugadores: 88, color: "bg-gray-500", porcentaje: 19 },
              ].map((cat) => (
                <div key={cat.categoria} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{cat.categoria}</span>
                    <span className="text-gray-600">{cat.jugadores} jugadores</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${cat.color} h-2 rounded-full transition-all`}
                      style={{ width: `${cat.porcentaje * 8}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academias con más equipos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Top Academias por Equipos
            </h3>
            <div className="space-y-4">
              {[
                { nombre: "Academia Alianza Lima", equipos: 8, jugadores: 96, color: "bg-blue-600" },
                { nombre: "Academia Sporting Cristal", equipos: 7, jugadores: 84, color: "bg-sky-500" },
                { nombre: "Academia Universitario", equipos: 6, jugadores: 72, color: "bg-red-600" },
                { nombre: "Academia Melgar", equipos: 5, jugadores: 60, color: "bg-red-500" },
                { nombre: "Academia César Vallejo", equipos: 4, jugadores: 48, color: "bg-yellow-500" },
              ].map((academia, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className={`w-10 h-10 ${academia.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{academia.nombre}</p>
                    <p className="text-xs text-gray-600">
                      {academia.equipos} equipos • {academia.jugadores} jugadores
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row - Actividad Reciente */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Actividad Reciente
            </h3>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              Ver todo →
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                tipo: "Nuevo equipo",
                descripcion: "Academia Alianza Lima registró Sub-12",
                tiempo: "Hace 2 horas",
                icon: "🏆",
                color: "bg-green-100 text-green-700",
              },
              {
                tipo: "Jugador registrado",
                descripcion: "15 nuevos jugadores en Academia Cristal",
                tiempo: "Hace 5 horas",
                icon: "👤",
                color: "bg-blue-100 text-blue-700",
              },
              {
                tipo: "Nueva academia",
                descripcion: "Academia Sport Boys se unió al torneo",
                tiempo: "Hace 1 día",
                icon: "🏫",
                color: "bg-purple-100 text-purple-700",
              },
              {
                tipo: "Partido programado",
                descripcion: "32 partidos añadidos al calendario",
                tiempo: "Hace 2 días",
                icon: "📅",
                color: "bg-yellow-100 text-yellow-700",
              },
            ].map((actividad, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className={`w-10 h-10 ${actividad.color} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                  {actividad.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{actividad.tipo}</p>
                  <p className="text-sm text-gray-600 truncate">{actividad.descripcion}</p>
                  <p className="text-xs text-gray-500 mt-1">{actividad.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="/academias"
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold">Academias</h4>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <p className="text-white/80 text-sm">Gestionar academias registradas</p>
          </a>

          <a
            href="/equipos"
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold">Equipos</h4>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <p className="text-white/80 text-sm">Ver todos los equipos</p>
          </a>

          <a
            href="/jugadores"
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold">Jugadores</h4>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <p className="text-white/80 text-sm">Buscar jugadores</p>
          </a>

          <a
            href="/calendario"
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold">Calendario</h4>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <p className="text-white/80 text-sm">Ver partidos programados</p>
          </a>
        </div>
      </div>
    </>
  );
}