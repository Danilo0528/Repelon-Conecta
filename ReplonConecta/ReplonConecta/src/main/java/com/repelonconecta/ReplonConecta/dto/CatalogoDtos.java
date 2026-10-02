package com.repelonconecta.ReplonConecta.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Respuestas y peticiones de categorias y direcciones. */
public final class CatalogoDtos {

	private CatalogoDtos() {
	}

	public record CategoriaResponse(
			UUID id,
			String nombre,
			String slug,
			String icono,
			int orden,
			boolean activa) {
	}

	public record DireccionResponse(
			UUID id,
			String alias,
			String direccion,
			String barrio,
			String vereda,
			String referencia,
			String telefonoContacto,
			boolean predeterminada) {
	}

	public record DireccionRequest(
			@Size(max = 60)
			String alias,

			@NotBlank(message = "La direccion es obligatoria")
			@Size(max = 200)
			String direccion,

			@Size(max = 100)
			String barrio,

			@Size(max = 100)
			String vereda,

			@NotBlank(message = "La referencia es obligatoria: sin ella el domiciliario no llega")
			@Size(max = 300)
			String referencia,

			@Pattern(regexp = "^$|^[0-9+\\s-]{7,20}$",
					message = "Telefono invalido: solo numeros, espacios, + y -")
			String telefonoContacto,

			Boolean predeterminada) {
	}
}