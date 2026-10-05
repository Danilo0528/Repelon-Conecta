/*
 * Tipos que espejan los DTO del backend Spring.
 *
 * Se escriben a mano porque el backend no publica un esquema OpenAPI
 * todavía. Si un DTO cambia allá, aquí hay que cambiarlo también: es el
 * precio de no generar los tipos, y vale la pena revisarlo cuando se
 * toque un endpoint.
 */

export type Rol = "COMPRADOR" | "VENDEDOR" | "ADMIN";

export type EstadoPedido =
	| "PEDIDO_RECIBIDO"
	| "EN_PREPARACION"
	| "EN_CAMINO"
	| "ENTREGADO"
	| "CANCELADO"
	| "RECHAZADO";

export type MetodoEntrega = "DOMICILIO" | "RECOGER_EN_TIENDA";

export type MetodoPago =
	| "EFECTIVO_CONTRA_ENTREGA"
	| "NEQUI"
	| "DAVIPLATA"
	| "TRANSFERENCIA_BANCARIA";

export interface Usuario {
	id: string;
	email: string;
	nombre: string;
	telefono: string | null;
	rol: Rol;
	activo: boolean;
	tieneNegocio: boolean;
	creadoEn: string;
}

export interface Categoria {
	id: string;
	nombre: string;
	slug: string;
	icono: string | null;
	orden: number;
	activa: boolean;
}

export interface Direccion {
	id: string;
	alias: string | null;
	direccion: string;
	barrio: string | null;
	vereda: string | null;
	referencia: string;
	telefonoContacto: string | null;
	predeterminada: boolean;
}

export interface Negocio {
	id: string;
	nombre: string;
	slug: string;
	descripcion: string | null;
	direccion: string;
	barrio: string | null;
	latitud: number | null;
	longitud: number | null;
	telefono: string | null;
	whatsapp: string | null;
	logoUrl: string | null;
	abierto: boolean;
	destacado: boolean;
	cantidadProductos: number;
}

export interface NegocioDetalle {
	id: string;
	nombre: string;
	slug: string;
	descripcion: string | null;
	direccion: string;
	barrio: string | null;
	latitud: number | null;
	longitud: number | null;
	referenciaUbicacion: string | null;
	telefono: string | null;
	whatsapp: string | null;
	logoUrl: string | null;
	horario: string | null;
	abierto: boolean;
	destacado: boolean;
	aprobado: boolean;
	soyDueno: boolean;
	creadoEn: string;
	productos: Producto[];
}

export interface NegocioAdmin {
	id: string;
	nombre: string;
	slug: string;
	barrio: string | null;
	direccion: string;
	aprobado: boolean;
	destacado: boolean;
	abierto: boolean;
	duenoId: string;
	duenoNombre: string;
	duenoEmail: string;
	cantidadProductos: number;
	pedidosRecibidos: number;
	creadoEn: string;
}

export interface Producto {
	id: string;
	negocioId: string;
	negocioNombre: string;
	categoriaId: string | null;
	categoriaNombre: string | null;
	nombre: string;
	descripcion: string | null;
	precio: number;
	imagenUrl: string | null;
	disponible: boolean;
	stock: number | null;
}

export interface LineaPedido {
	productoId: string;
	nombre: string;
	imagenUrl: string | null;
	precioUnitario: number;
	cantidad: number;
	subtotal: number;
}

export interface Pedido {
	id: string;
	numero: string;
	negocioId: string;
	negocioNombre: string;
	estado: EstadoPedido;
	estadoEtiqueta: string;
	metodoEntrega: MetodoEntrega;
	metodoPago: MetodoPago;
	total: number;
	pagoConfirmado: boolean;
	cantidadItems: number;
	creadoEn: string;
}

export interface PedidoDetalle {
	id: string;
	numero: string;
	estado: EstadoPedido;
	estadoEtiqueta: string;
	metodoEntrega: MetodoEntrega;
	metodoPago: MetodoPago;
	total: number;
	pagoConfirmado: boolean;
	notas: string | null;
	compradorNombre: string;
	compradorTelefono: string | null;
	entregaDireccion: string | null;
	entregaBarrio: string | null;
	entregaVereda: string | null;
	entregaReferencia: string | null;
	negocioId: string;
	negocioNombre: string;
	negocioTelefono: string | null;
	negocioWhatsapp: string | null;
	negocioDireccion: string;
	items: LineaPedido[];
	whatsappResumenUrl: string | null;
	creadoEn: string;
	actualizadoEn: string;
}

export interface MetricasVendedor {
	ventasHoy: number;
	pedidosHoy: number;
	ventasSemana: number;
	pedidosSemana: number;
	ventasMes: number;
	pedidosMes: number;
	pedidosPendientes: number;
	productosActivos: number;
	productosAgotados: number;
}

export interface MetricasAdmin {
	negociosTotales: number;
	negociosAprobados: number;
	negociosPendientes: number;
	usuariosTotales: number;
	pedidosTotales: number;
	ventasTotales: number;
	ventasHoy: number;
}

/** Lo que se guarda en el carrito del navegador (localStorage). */
export interface LineaCarrito {
	productoId: string;
	nombre: string;
	precio: number;
	imagenUrl: string | null;
	cantidad: number;
}
