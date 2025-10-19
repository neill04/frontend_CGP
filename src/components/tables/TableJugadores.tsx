import { useJugadores } from "../../hooks/Academia/useJugador";
import { Link } from "react-router";

interface TableJugadoresProps {
  academiaId: string;
  equipoId: string;
}

export default function TableJugadores({ academiaId, equipoId }: TableJugadoresProps) {
	const { jugadores, loading, error } = useJugadores(academiaId, equipoId);

	if (loading) {
		return (
			<p className="text-center text-gray-500 mt-6 text-lg">
					Cargando jugadores...
			</p>
		)
	}

	if (error) {
		return (
			<p className="text-center text-gray-500 mt-6 text-lg">
					Error: {error}
			</p>
		)
	}

	if (!jugadores || jugadores.length === 0) {
			return (
					<p className="text-center text-gray-500 mt-6 text-lg">
							No hay jugadores registrados para esta academia.
					</p>
			);
	}

	return (
			<>	
					<div className="p-0 overflow-scroll">
							<table className="w-full mt-4 text-left table-auto min-w-max">
									<thead>
											<tr>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Nro
															</p>
													</th>
                          <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Dni
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Apellidos
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Nombres
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Estado
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
															</p>
													</th>
											</tr>
									</thead>
									<tbody>
											{jugadores.map((jugador, index) => (
													<tr
															key={jugador.id}
															className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
													>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{index + 1}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{jugador.dni}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{`${jugador.apellidos}`}
																			</p>
																	</div>
															</td>
                              <td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{`${jugador.nombres}`}
																			</p>
																	</div>
															</td>
                              <td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{jugador.activo ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Activo</span>
                                          ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded">Inactivo</span>
                                          )}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																<Link
																	to={`/academias/${academiaId}/equipos/${equipoId}/jugadores/${jugador.id}`}
																	className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
																>
																	<span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
																		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
																			<path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
																			<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
																		</svg>
																	</span>
																</Link>
															</td>
													</tr>
											))}
									</tbody>
							</table>
					</div>
			</>
	);
}