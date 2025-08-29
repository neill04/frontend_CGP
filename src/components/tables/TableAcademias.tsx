import { useAcademias } from "../../hooks/Academia/useAcademia";
import { Link } from "react-router";

export default function TableAcademias() {
	const { academias, loading, error } = useAcademias();

	if (loading) {
		return (
			<p className="text-center text-gray-500 mt-6 text-lg">
					Cargando academias...
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

	if (!academias || academias.length === 0) {
			return (
					<p className="text-center text-gray-500 mt-6 text-lg">
							No hay academias registradas.
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
																	ID
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Academia
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Representante
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	DNI
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Estado
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
																	Distrito
															</p>
													</th>
													<th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
															<p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
															</p>
													</th>
											</tr>
									</thead>
									<tbody>
											{academias.map((academia, index) => (
													<tr
															key={academia.id}
															className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
													>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{academia.id}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex items-center gap-3">
																			{/*
																			<img src={academia.logoUrl} alt="logoUrl"
																						className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"/>
																			*/}
																			<div className="flex flex-col">
																					<p className="text-sm font-semibold text-slate-700">
																							{academia.nombreAcademia}
																					</p>
																			</div>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{academia.nombreRepresentante}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{academia.dniRepresentante}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{academia.estado}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																	<div className="flex flex-col">
																			<p className="text-sm font-semibold text-slate-700">
																					{academia.nombreDistrito}
																			</p>
																	</div>
															</td>
															<td className="p-4 border-b border-slate-200">
																<Link
																	to={`/formAcademia/edit/${academia.id}`}
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