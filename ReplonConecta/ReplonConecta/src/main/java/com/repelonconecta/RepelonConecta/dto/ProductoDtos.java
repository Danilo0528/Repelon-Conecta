package com.repelonconecta.RepelonConecta.dto;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/** Respuestas y peticiones de productos. */
public final class ProductoDtos {

	private ProductoDtos() {
	}

	public record ProductoResponse(
			UUID id,
			UUID negocioId,
			String negocioNombre,
			UUID categoriaId,
			String categoriaNombre,
			String nombre,
			String descripcion,
			long precio,
			String imagenUrl,
			boolean disponible,
			Integer stock) {
	}

	/**
	 * Alta y edicion de producto.
	 *
	 * precio en pesos enteros, sin decimales. El minimo es 1 porque un
	 * producto de $0 en un marketplace es una peticion de donate, no una
	 * venta; si se quiere regalar algo se pone 1.
	 */
	public record ProductoRequest(
			@NotBlank(message = "El nombre del producto es obligatorio")
			@Size(max = 140)
			String nombre,

			@Size(max = 600)
			String descripcion,

			@NotNull(message = "El precio es obligatorio")
			@PositiveOrZero(message = "El precio no puede ser negativo")
			Long precio,

			@Size(max = 500)
			String imagenUrl,

			UUID categoriaId,

			Boolean disponible,

			@Min(value = 0, message = "El stock no puede ser negativo")
			Integer stock) {
	}
}