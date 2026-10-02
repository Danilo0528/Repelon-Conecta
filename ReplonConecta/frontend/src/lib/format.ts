import type { EstadoPedido, MetodoEntrega, MetodoPago } from "./tipos";

/*
 * Precios en pesos colombianos, que no usan decimales. Se formatean con
 * el separador de miles de es-CO: 12000 -> "$12.000".
 */
export function pesos(valor: number): string {
	return (
		"$" +
		new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(valor)
	);
}

export function fecha(iso: string): string {
	return new Intl.DateTimeFormat("es-CO", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: "America/Bogota",
	}).format(new Date(iso));
}

export const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
	PEDIDO_RECIBIDO: "Pedido recibido",
	EN_PREPARACION: "En preparación",
	EN_CAMINO: "En camino",
	ENTREGADO: "Entregado",
	CANCELADO: "Cancelado",
	RECHAZADO: "Rechazado por el negocio",
};

/*
 * Colores de estado. Se mapean a las tres clases del tema para no salir
 * de la paleta; los estados terminales negativos se pintan sobre negro
 * translúcido para que se lean como "apagados".
 */
export const CLASE_ESTADO: Record<EstadoPedido, string> = {
	PEDIDO_RECIBIDO: "bg-azul text-white",
	EN_PREPARACION: "bg-azul text-white",
	EN_CAMINO: "bg-verde text-white",
	ENTREGADO: "bg-verde text-white",
	CANCELADO: "bg-black/60 text-white",
	RECHAZADO: "bg-black/60 text-white",
};

export const ETIQUETA_ENTREGA: Record<MetodoEntrega, string> = {
	DOMICILIO: "Domicilio",
	RECOGER_EN_TIENDA: "Recoger en la tienda",
};

export const ETIQUETA_PAGO: Record<MetodoPago, string> = {
	EFECTIVO_CONTRA_ENTREGA: "Efectivo contra entrega",
	NEQUI: "Nequi",
	DAVIPLATA: "Daviplata",
	TRANSFERENCIA_BANCARIA: "Transferencia bancaria",
};
