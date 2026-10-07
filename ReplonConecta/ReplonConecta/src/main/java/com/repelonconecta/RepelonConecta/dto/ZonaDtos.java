package com.repelonconecta.RepelonConecta.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Respuestas y peticiones de las zonas turísticas del home. */
public final class ZonaDtos {

	private ZonaDtos() {
	}

	public record ZonaResponse(
			UUID id,
			String nombre,
			String descripcion,
			String direccion,
			Double latitud,
			Double longitud,
			String imagenUrl,
			String motivo,
			int orden) {
	}

	/**
	 * Todo lo que el panel de zonas puede escribir. Dirección y nombre
	 * son obligatorios (sin dirección no hay "cómo llegar"); las
	 * coordenadas llegan desde la ubicación del estudiante o desde la
	 * búsqueda y pueden quedar vacías.
	 */
	public record ZonaRequest(
			@NotBlank(message = "El nombre es obligatorio")
			@Size(max = 80, message = "El nombre máximo tiene 80 caracteres")
			String nombre,

			@Size(max = 300, message = "La descripción máxima tiene 300 caracteres")
			String descripcion,

			@NotBlank(message = "La dirección es obligatoria")
			@Size(max = 200, message = "La dirección máxima tiene 200 caracteres")
			String direccion,

			Double latitud,

			Double longitud,

			@Size(max = 500, message = "La URL de la imagen máximo tiene 500 caracteres")
			String imagenUrl,

			@Size(max = 20)
			String motivo,

			Integer orden) {
	}
}
