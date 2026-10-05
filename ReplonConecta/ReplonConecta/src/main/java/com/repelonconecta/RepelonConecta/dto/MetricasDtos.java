package com.repelonconecta.RepelonConecta.dto;

/** Cifras para los paneles de vendedor y admin. */
public final class MetricasDtos {

	private MetricasDtos() {
	}

	/**
	 * Resumen del dia y de la semana para el panel del vendedor.
	 *
	 * cuentaPedidos excluye cancelados y rechazados por la misma razon que
	 * la suma de dinero: no fueron ventas.
	 */
	public record MetricasVendedorResponse(
			long ventasHoy,
			int pedidosHoy,
			long ventasSemana,
			int pedidosSemana,
			long ventasMes,
			int pedidosMes,
			int pedidosPendientes,
			int productosActivos,
			int productosAgotados) {
	}

	/** Cifras generales de la plataforma, para el admin. */
	public record MetricasAdminResponse(
			long negociosTotales,
			long negociosAprobados,
			long negociosPendientes,
			long usuariosTotales,
			long pedidosTotales,
			long ventasTotales,
			long ventasHoy) {
	}
}