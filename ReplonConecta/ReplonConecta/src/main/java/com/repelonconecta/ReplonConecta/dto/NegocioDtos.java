package com.repelonconecta.ReplonConecta.dto;

import java.time.Instant;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Respuestas y peticiones de negocios. */
public final class NegocioDtos {

	private NegocioDtos() {
	}

	/** Ficha resumida, para listados y buscador. */
	public record NegocioResponse(
			UUID id,
			String nombre,
			String slug,
			String descripcion,
			String direccion,
			String barrio,
			String telefono,
			String whatsapp,
			String logoUrl,
			boolean abierto,
			boolean destacado,
			long cantidadProductos) {
	}

	/** Ficha completa, con los productos y el horario. */
	public record NegocioDetalleResponse(
			UUID id,
			String nombre,
			String slug,
			String descripcion,
			String direccion,
			String barrio,
			String telefono,
			String whatsapp,
			String logoUrl,
			String horario,
			boolean abierto,
			boolean destacado,
			boolean aprobado,
			boolean soyDueno,
			Instant creadoEn,
			java.util.List<ProductoDtos.ProductoResponse> productos) {
	}

	/** Alta de negocio. Queda pendiente de aprobacion segun configuracion. */
	public record RegistroNegocioRequest(
			@NotBlank(message = "El nombre del negocio es obligatorio")
			@Size(max = 120, message = "El nombre no puede pasar de 120 caracteres")
			String nombre,

			@Size(max = 1000, message = "La descripcion no puede pasar de 1000 caracteres")
			String descripcion,

			@NotBlank(message = "La direccion es obligatoria")
			@Size(max = 200)
			String direccion,

			@Size(max = 100)
			String barrio,

			@Pattern(regexp = "^$|^[0-9+\\s-]{7,20}$",
					message = "Telefono invalido: solo numeros, espacios, + y -")
			String telefono,

			@Pattern(regexp = "^$|^[0-9+\\s-]{7,20}$",
					message = "WhatsApp invalido: solo numeros, espacios, + y -")
			String whatsapp,

			@Size(max = 60)
			String horario) {
	}

	/** Edicion del perfil. Todo opcional: solo se cambia lo que se mando. */
	public record NegocioUpdateRequest(
			@Size(max = 120) String nombre,
			@Size(max = 1000) String descripcion,
			@Size(max = 200) String direccion,
			@Size(max = 100) String barrio,
			String telefono,
			String whatsapp,
			@Size(max = 60) String horario,
			@Size(max = 500) String logoUrl,
			Boolean abierto) {
	}

	/**
	 * Vista del admin: incluye el estado de aprobacion y el dueno, que el
	 * vendedor nunca debe ver.
	 */
	public record NegocioAdminResponse(
			UUID id,
			String nombre,
			String slug,
			String barrio,
			String direccion,
			boolean aprobado,
			boolean destacado,
			boolean abierto,
			UUID duenoId,
			String duenoNombre,
			String duenoEmail,
			long cantidadProductos,
			long pedidosRecibidos,
			Instant creadoEn) {
	}

	/** Toggle de aprobacion y destacado desde el panel del admin. */
	public record NegocioAdminToggleRequest(
			Boolean aprobado,
			Boolean destacado) {
	}
}