package com.repelonconecta.RepelonConecta.dto;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Respuestas y peticiones de las publicaciones de Cultura. */
public final class CulturaDtos {

	private CulturaDtos() {
	}

	public record PublicacionResponse(
			UUID id,
			String autor,
			String lugar,
			LocalDate fecha,
			String texto,
			String tipo,
			String mediaUrl,
			String credito) {
	}

	/**
	 * Todo lo que el panel de Cultura puede escribir. Autor, fecha, texto
	 * y medio son obligatorios: sin medio no hay publicación que mostrar
	 * en el feed.
	 */
	public record PublicacionRequest(
			@NotBlank(message = "El autor es obligatorio")
			@Size(max = 60, message = "El autor máximo tiene 60 caracteres")
			String autor,

			@Size(max = 100, message = "El lugar máximo tiene 100 caracteres")
			String lugar,

			@NotNull(message = "La fecha es obligatoria")
			LocalDate fecha,

			@NotBlank(message = "El texto de la publicación es obligatorio")
			@Size(max = 600, message = "El texto máximo tiene 600 caracteres")
			String texto,

			@NotBlank(message = "El tipo de medio es obligatorio")
			@Pattern(regexp = "FOTO|VIDEO", message = "El tipo de medio debe ser FOTO o VIDEO")
			String tipo,

			@NotBlank(message = "La foto o el video es obligatorio")
			@Size(max = 500, message = "La URL máximo tiene 500 caracteres")
			String mediaUrl,

			@Size(max = 120, message = "El crédito máximo tiene 120 caracteres")
			String credito) {
	}
}
