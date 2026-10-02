"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Aviso, Cargando, Vacio } from "@/components/ui";
import { useSesion } from "@/context/SesionContext";
import { apiConSesion } from "@/lib/api";
import { pesos } from "@/lib/format";
import type { MetricasVendedor, Negocio, NegocioDetalle } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

export default function PanelVendedor() {
	const router = useRouter();
	const { perfil, cargando: cargandoSesion, refrescarPerfil } = useSesion();

	useEffect(() => {
		if (!cargandoSesion && !perfil) {
			router.replace("/entrar?next=/vendedor");
		}
	}, [cargandoSesion, perfil, router]);

	const {
		datos: negocios,
		cargando,
		error,
		setDatos,
	} = useDatos<Negocio[]>(
		() => apiConSesion<Negocio[]>("/api/negocios/mios"),
		[perfil?.id],
	);

	if (cargandoSesion || (perfil && cargando)) return <Cargando />;
	if (!perfil) return null;

	async function alCrear(negocio: NegocioDetalle) {
		const actualizados = await apiConSesion<Negocio[]>("/api/negocios/mios");
		setDatos(actualizados);
		await refrescarPerfil();
		void negocio;
	}

	return (
		<div className="px-4 pt-4">
			<h1 className="text-xl font-bold">Mi negocio</h1>

			{error && (
				<div className="mt-3">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			{(negocios ?? []).length === 0 && !cargando ? (
				<>
					<Vacio
						titulo="Aún no tienes un negocio"
						texto="Crea el tuyo y empieza a recibir pedidos de todo Repelón."
					/>
					<FormularioNegocio onCreado={alCrear} />
				</>
			) : (
				<ul className="mt-3 space-y-4">
					{(negocios ?? []).map((n) => (
						<TarjetaNegocio key={n.id} negocio={n} />
					))}
					<li>
						<details>
							<summary className="cursor-pointer text-sm font-medium text-azul">
								+ Crear otro negocio
							</summary>
							<div className="mt-3">
								<FormularioNegocio onCreado={alCrear} />
							</div>
						</details>
					</li>
				</ul>
			)}
		</div>
	);
}

function TarjetaNegocio({ negocio }: { negocio: Negocio }) {
	const [abierto, setAbierto] = useState(negocio.abierto);
	const [cambiando, setCambiando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { datos: metricas } = useDatos<MetricasVendedor>(
		() => apiConSesion<MetricasVendedor>(`/api/negocios/${negocio.id}/metricas`),
		[negocio.id],
	);

	async function alternar(valor: boolean) {
		setError(null);
		setCambiando(true);
		try {
			const actualizado = await apiConSesion<NegocioDetalle>(
				`/api/negocios/${negocio.id}/abierto?abierto=${valor}`,
				{ method: "PATCH" },
			);
			setAbierto(actualizado.abierto);
		} catch (e) {
			setError(e instanceof Error ? e.message : "No se pudo cambiar.");
		} finally {
			setCambiando(false);
		}
	}

	return (
		<li className="rounded-2xl border border-black/10 p-4 shadow-sm">
			<div className="flex items-start justify-between gap-2">
				<div>
					<p className="font-semibold">{negocio.nombre}</p>
					<p className="text-xs text-black/55">
						{negocio.barrio ?? "Repelón"} · {negocio.cantidadProductos} productos
					</p>
				</div>
				<span
					className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
						abierto ? "bg-verde text-white" : "bg-black/60 text-white"
					}`}
				>
					{abierto ? "Abierto" : "Cerrado"}
				</span>
			</div>

			{error && (
				<div className="mt-2">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			<div className="mt-3 grid grid-cols-3 gap-2 text-center">
				<Cifra etiqueta="Hoy" valor={pesos(metricas?.ventasHoy ?? 0)} />
				<Cifra etiqueta="Semana" valor={pesos(metricas?.ventasSemana ?? 0)} />
				<Cifra
					etiqueta="Por despachar"
					valor={String(metricas?.pedidosPendientes ?? 0)}
				/>
			</div>

			<div className="mt-4 flex gap-2">
				<Link
					href={`/vendedor/negocios/${negocio.id}`}
					className="flex-1 rounded-xl bg-azul py-2 text-center text-sm font-semibold text-white"
				>
					Gestionar
				</Link>
				<button
					type="button"
					onClick={() => alternar(!abierto)}
					disabled={cambiando}
					className="flex-1 rounded-xl border border-black/15 py-2 text-sm font-semibold disabled:opacity-50"
				>
					{abierto ? "Cerrar" : "Abrir"}
				</button>
			</div>
		</li>
	);
}

function Cifra({ etiqueta, valor }: { etiqueta: string; valor: string }) {
	return (
		<div className="rounded-xl bg-black/[.04] px-2 py-2">
			<p className="text-base font-bold">{valor}</p>
			<p className="text-[11px] text-black/55">{etiqueta}</p>
		</div>
	);
}

function FormularioNegocio({
	onCreado,
}: {
	onCreado: (n: NegocioDetalle) => void | Promise<void>;
}) {
	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [direccion, setDireccion] = useState("");
	const [barrio, setBarrio] = useState("");
	const [whatsapp, setWhatsapp] = useState("");
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function crear(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (!nombre.trim() || !direccion.trim()) {
			setError("El nombre y la dirección son obligatorios.");
			return;
		}

		setEnviando(true);
		try {
			const creado = await apiConSesion<NegocioDetalle>("/api/negocios", {
				method: "POST",
				body: JSON.stringify({
					nombre: nombre.trim(),
					descripcion: descripcion.trim(),
					direccion: direccion.trim(),
					barrio: barrio.trim(),
					telefono: "",
					whatsapp: whatsapp.trim(),
					horario: null,
				}),
			});
			await onCreado(creado);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo crear el negocio.");
			setEnviando(false);
		}
	}

	return (
		<form onSubmit={crear} className="space-y-2 rounded-2xl border border-black/10 p-4">
			<h2 className="font-semibold">Crear mi negocio</h2>
			{error && <Aviso tono="error">{error}</Aviso>}

			<input
				value={nombre}
				onChange={(e) => setNombre(e.target.value)}
				placeholder="Nombre del negocio"
				className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
			/>
			<textarea
				value={descripcion}
				onChange={(e) => setDescripcion(e.target.value)}
				rows={2}
				placeholder="¿Qué vendes?"
				className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
			/>
			<input
				value={direccion}
				onChange={(e) => setDireccion(e.target.value)}
				placeholder="Dirección"
				className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
			/>
			<div className="flex gap-2">
				<input
					value={barrio}
					onChange={(e) => setBarrio(e.target.value)}
					placeholder="Barrio"
					className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
				/>
				<input
					value={whatsapp}
					onChange={(e) => setWhatsapp(e.target.value)}
					placeholder="WhatsApp (300 000 0000)"
					className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
				/>
			</div>
			<button
				type="submit"
				disabled={enviando}
				className="w-full rounded-xl bg-azul py-2 font-semibold text-white disabled:opacity-60"
			>
				{enviando ? "Creando…" : "Crear negocio"}
			</button>
		</form>
	);
}
