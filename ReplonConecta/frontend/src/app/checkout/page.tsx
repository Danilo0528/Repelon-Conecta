"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Aviso, Cargando, Vacio } from "@/components/ui";
import { useCarrito } from "@/context/CarritoContext";
import { useSesion } from "@/context/SesionContext";
import { apiConSesion } from "@/lib/api";
import { pesos } from "@/lib/format";
import type {
	Direccion,
	MetodoEntrega,
	MetodoPago,
	PedidoDetalle,
} from "@/lib/tipos";

export default function Checkout() {
	const router = useRouter();
	const { perfil, cargando: cargandoSesion } = useSesion();
	const { carrito, listo, total, vaciar } = useCarrito();

	const [metodoEntrega, setMetodoEntrega] = useState<MetodoEntrega>("DOMICILIO");
	const [metodoPago, setMetodoPago] = useState<MetodoPago>(
		"EFECTIVO_CONTRA_ENTREGA",
	);
	const [direccion, setDireccion] = useState("");
	const [barrio, setBarrio] = useState("");
	const [vereda, setVereda] = useState("");
	const [referencia, setReferencia] = useState("");
	const [telefono, setTelefono] = useState("");
	const [notas, setNotas] = useState("");
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Sin sesión no se puede pedir: se manda a entrar y se vuelve aquí.
	useEffect(() => {
		if (!cargandoSesion && !perfil) {
			router.replace("/entrar?next=/checkout");
		}
	}, [cargandoSesion, perfil, router]);

	// Precarga la dirección guardada y el teléfono del perfil.
	useEffect(() => {
		if (!perfil) return;
		setTelefono((t) => t || perfil.telefono || "");
		if (!carrito) return;

		let vivo = true;
		void apiConSesion<Direccion[]>("/api/direcciones")
			.then((lista) => {
				if (!vivo) return;
				const predeterminada =
					lista.find((d) => d.predeterminada) ?? lista[0];
				if (predeterminada) {
					setDireccion(predeterminada.direccion);
					setBarrio(predeterminada.barrio ?? "");
					setVereda(predeterminada.vereda ?? "");
					setReferencia(predeterminada.referencia);
				}
			})
			.catch(() => {
				// Sin direcciones guardadas el usuario escribe la suya.
			});
		return () => {
			vivo = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [perfil, carrito?.negocioId]);

	if (!listo || cargandoSesion) return <Cargando />;

	if (!carrito || carrito.items.length === 0) {
		return <Vacio titulo="No hay nada para pedir" texto="Tu carrito está vacío." />;
	}

	async function confirmar(e: React.FormEvent) {
		e.preventDefault();
		if (!carrito) return;
		setError(null);

		if (metodoEntrega === "DOMICILIO") {
			if (!direccion.trim() || !barrio.trim()) {
				setError("Escribe la dirección y el barrio para el domicilio.");
				return;
			}
			if (!referencia.trim()) {
				setError("Agrega una referencia: sin ella el domiciliario no llega.");
				return;
			}
		}

		setEnviando(true);
		try {
			const detalle = await apiConSesion<PedidoDetalle>("/api/pedidos", {
				method: "POST",
				body: JSON.stringify({
					negocioId: carrito.negocioId,
					items: carrito.items.map((i) => ({
						productoId: i.productoId,
						cantidad: i.cantidad,
					})),
					metodoEntrega,
					metodoPago,
					direccion: metodoEntrega === "DOMICILIO" ? direccion.trim() : null,
					barrio: metodoEntrega === "DOMICILIO" ? barrio.trim() : null,
					vereda: metodoEntrega === "DOMICILIO" ? vereda.trim() : null,
					referencia: referencia.trim(),
					telefonoContacto: telefono.trim(),
					notas: notas.trim(),
				}),
			});
			vaciar();
			router.replace(`/pedidos/${detalle.id}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo crear el pedido.");
			setEnviando(false);
		}
	}

	const estiloOpcion = (activo: boolean) =>
		`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${
			activo ? "border-azul bg-azul/10 text-azul" : "border-black/15 text-black/70"
		}`;

	return (
		<form onSubmit={confirmar} className="px-4 pt-4">
			<h1 className="text-xl font-bold">Confirmar pedido</h1>
			<p className="mt-1 text-sm text-black/60">
				Pedido a <span className="font-medium text-black">{carrito.negocioNombre}</span>
			</p>

			{error && (
				<div className="mt-3">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			<section className="mt-5">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
					¿Cómo lo recibes?
				</h2>
				<div className="mt-2 flex gap-2">
					<button
						type="button"
						onClick={() => setMetodoEntrega("DOMICILIO")}
						className={estiloOpcion(metodoEntrega === "DOMICILIO")}
					>
						Domicilio
					</button>
					<button
						type="button"
						onClick={() => setMetodoEntrega("RECOGER_EN_TIENDA")}
						className={estiloOpcion(metodoEntrega === "RECOGER_EN_TIENDA")}
					>
						Recoger en tienda
					</button>
				</div>
			</section>

			{metodoEntrega === "DOMICILIO" && (
				<section className="mt-5 space-y-3">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
						Dirección de entrega
					</h2>
					<Campo
						etiqueta="Dirección"
						valor={direccion}
						onChange={setDireccion}
						placeholder="Calle 8 # 5-23"
						requerido
					/>
					<div className="flex gap-3">
						<Campo
							etiqueta="Barrio"
							valor={barrio}
							onChange={setBarrio}
							placeholder="Centro"
							requerido
						/>
						<Campo
							etiqueta="Vereda (si aplica)"
							valor={vereda}
							onChange={setVereda}
							placeholder="Rotinet"
						/>
					</div>
					<Campo
						etiqueta="Referencia"
						valor={referencia}
						onChange={setReferencia}
						placeholder="Portón azul, frente a la iglesia"
						requerido
					/>
				</section>
			)}

			<section className="mt-5">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
					¿Cómo pagas?
				</h2>
				<div className="mt-2 grid grid-cols-2 gap-2">
					{OPCIONES_PAGO.map((op) => (
						<button
							key={op.valor}
							type="button"
							onClick={() => setMetodoPago(op.valor)}
							className={estiloOpcion(metodoPago === op.valor)}
						>
							{op.etiqueta}
						</button>
					))}
				</div>
			</section>

			<section className="mt-5 space-y-3">
				<Campo
					etiqueta="Tu teléfono"
					valor={telefono}
					onChange={setTelefono}
					placeholder="300 000 0000"
					tipo="tel"
				/>
				<label className="block">
					<span className="text-sm font-medium">Notas para el negocio</span>
					<textarea
						value={notas}
						onChange={(e) => setNotas(e.target.value)}
						rows={2}
						placeholder="Sin cebolla, tocar el timbre dos veces…"
						className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
					/>
				</label>
			</section>

			<div className="mt-5 flex items-center justify-between rounded-2xl bg-black/[.04] px-4 py-3">
				<span className="text-sm text-black/60">Total a pagar</span>
				<span className="text-lg font-bold">{pesos(total)}</span>
			</div>

			<button
				type="submit"
				disabled={enviando}
				className="mt-4 w-full rounded-xl bg-azul py-3 font-semibold text-white disabled:opacity-60"
			>
				{enviando ? "Enviando pedido…" : "Confirmar pedido"}
			</button>
		</form>
	);
}

const OPCIONES_PAGO: { valor: MetodoPago; etiqueta: string }[] = [
	{ valor: "EFECTIVO_CONTRA_ENTREGA", etiqueta: "Efectivo contra entrega" },
	{ valor: "NEQUI", etiqueta: "Nequi" },
	{ valor: "DAVIPLATA", etiqueta: "Daviplata" },
	{ valor: "TRANSFERENCIA_BANCARIA", etiqueta: "Transferencia" },
];

function Campo({
	etiqueta,
	valor,
	onChange,
	placeholder,
	tipo = "text",
	requerido = false,
}: {
	etiqueta: string;
	valor: string;
	onChange: (v: string) => void;
	placeholder?: string;
	tipo?: string;
	requerido?: boolean;
}) {
	return (
		<label className="block flex-1">
			<span className="text-sm font-medium">
				{etiqueta}
				{requerido && <span className="text-azul"> *</span>}
			</span>
			<input
				type={tipo}
				value={valor}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
			/>
		</label>
	);
}
