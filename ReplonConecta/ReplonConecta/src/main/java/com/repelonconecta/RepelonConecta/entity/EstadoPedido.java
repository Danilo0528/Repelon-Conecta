package com.repelonconecta.RepelonConecta.entity;

/**
 * Ciclo de vida de un pedido.
 *
 * El orden importa: PEDIDO_RECIBIDO -> EN_PREPARACION -> EN_CAMINO ->
 * ENTREGADO. CANCELADO y RECHAZADO son salidas terminales y se pueden
 * alcanzar desde casi cualquier estado anterior.
 *
 * REGLA DE NEGOCIO: RECHAZADO solo lo puede poner el negocio, nunca el
 * comprador. El comprador cancela, el vendedor rechaza. No es
 * cosmético: define quien se queda con la responsabilidad del pedido.
 */
public enum EstadoPedido {

	PEDIDO_RECIBIDO("Pedido recibido", false),

	EN_PREPARACION("En preparación", false),

	EN_CAMINO("En camino", false),

	ENTREGADO("Entregado", true),

	CANCELADO("Cancelado", true),

	RECHAZADO("Rechazado por el negocio", true);

	private final String etiqueta;

	/** Estado final: no admite mas transiciones. */
	private final boolean terminal;

	EstadoPedido(String etiqueta, boolean terminal) {
		this.etiqueta = etiqueta;
		this.terminal = terminal;
	}

	public String getEtiqueta() {
		return etiqueta;
	}

	public boolean isTerminal() {
		return terminal;
	}

	/**
	 * Comprueba si el cambio de estado es valido.
	 *
	 * El servicio de pedidos usa esto para rechazar transiciones
	 * inventadas (por ejemplo, delivered -> en_preparacion), que
	 * permitirian que un vendedor saque adelante un pedido ya
	 * entregado.
	 */
	public boolean puedeIrA(EstadoPedido destino) {
		if (this.terminal || destino == null || destino == this) {
			return false;
		}
		return switch (this) {
			case PEDIDO_RECIBIDO -> destino == EN_PREPARACION
					|| destino == CANCELADO
					|| destino == RECHAZADO;
			case EN_PREPARACION -> destino == EN_CAMINO
					|| destino == CANCELADO
					|| destino == RECHAZADO;
			case EN_CAMINO -> destino == ENTREGADO
					|| destino == CANCELADO;
			default -> false;
		};
	}
}