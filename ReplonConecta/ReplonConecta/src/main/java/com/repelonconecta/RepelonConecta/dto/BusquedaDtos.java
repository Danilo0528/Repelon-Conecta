package com.repelonconecta.RepelonConecta.dto;

import java.util.UUID;

import com.repelonconecta.RepelonConecta.entity.UnidadProducto;

/** Respuestas del buscador publico de productos. */
public final class BusquedaDtos {

	private BusquedaDtos() {
	}

	/**
	 * Un resultado: el producto junto a los datos del negocio que lo
	 * tiene, todo en la misma linea. Asi el frontend pinta la lista y
	 * ubica el pin del mapa sin hacer una segunda llamada.
	 */
	public record ResultadoBusquedaResponse(
			UUID productoId,
			String productoNombre,
			String productoDescripcion,
			long precio,
			UnidadProducto unidad,
			String imagenUrl,
			boolean disponible,
			UUID negocioId,
			String negocioNombre,
			String negocioSlug,
			String direccion,
			String barrio,
			Double latitud,
			Double longitud,
			String whatsapp,
			boolean abierto,
			String categoriaNombre) {
	}
}
