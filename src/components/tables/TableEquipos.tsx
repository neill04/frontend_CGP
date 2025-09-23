import { useEquipos } from "../../hooks/Academia/useEquipo";
import { Link } from "react-router";

interface TableEquiposProps {
  academiaId: string;
}

export default function TableEquipos({ academiaId }: TableEquiposProps) {
	const { equipos, loading, error } = useEquipos(academiaId);

	if (loading) {
		return (
			<p className="text-center text-gray-500 mt-6 text-lg">
					Cargando equipos...
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

	if (!equipos || equipos.length === 0) {
			return (
					<p className="text-center text-gray-500 mt-6 text-lg">
							No hay equipos registrados para esta academia.
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
																	Categoría
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Entrenador
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Delegado
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
											{equipos.map((equipo, index) => (
													<tr
															key={equipo.id}
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
																					{equipo.categoria}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{`${equipo.nombresEntrenador.split(" ")[0]} ${equipo.apellidosEntrenador.split(" ")[0]}`}
																			</p>
																	</div>
															</td>
                              <td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{`${equipo.nombresDelegado.split(" ")[0]} ${equipo.apellidosDelegado.split(" ")[0]}`}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{equipo.activo ? (
																						<span className="px-2 py-1 bg-green-100 text-green-700 rounded">Activo</span>
																					) : (
																						<span className="px-2 py-1 bg-red-100 text-red-700 rounded">Inactivo</span>
																					)}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																<Link
																	to={`/equipos${equipo.id}`}
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
															<td className="p-4 border-b border-slate-200">
																<Link
																	to={`/formEquipo/edit/${equipo.id}`}
																	className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
																>
																	<span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
																		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
																			<path
																					d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z">
																			</path>
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