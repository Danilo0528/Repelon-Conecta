package com.repelonconecta.ReplonConecta.service;

import org.springframework.http.HttpStatus;

/**
 * Error de negocio con codigo HTTP y mensaje en espanol, listo para
 * mostrarse al usuario.
 *
 * Se usa en vez de ResponseStatusException para que el mensaje llegue
 * al celular del tendero con sentido: "Este producto ya no esta
 * disponible" es accionable, "500 Internal Server Error" no.
 */
public class ApiException extends RuntimeException {

	private final HttpStatus status;

	public ApiException(HttpStatus status, String mensaje) {
		super(mensaje);
		this.status = status;
	}

	public HttpStatus getStatus() {
		return status;
	}

	// ---- Atajos para los casos que se repiten ------------------------

	public static ApiException noEncontrado(String que) {
		return new ApiException(HttpStatus.NOT_FOUND, que + " no encontrado");
	}

	public static ApiException prohibido(String mensaje) {
		return new ApiException(HttpStatus.FORBIDDEN, mensaje);
	}

	public static ApiException conflicto(String mensaje) {
		return new ApiException(HttpStatus.CONFLICT, mensaje);
	}

	public static ApiException peticionInvalida(String mensaje) {
		return new ApiException(HttpStatus.BAD_REQUEST, mensaje);
	}

	public static ApiException noAutorizado(String mensaje) {
		return new ApiException(HttpStatus.UNAUTHORIZED, mensaje);
	}
}