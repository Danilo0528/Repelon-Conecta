package com.repelonconecta.RepelonConecta.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Convierte excepciones en respuestas JSON con mensaje en espanol.
 *
 * Sin esto, el frontend recibiria el HTML de error de Spring o un stack
 * trace, y habria que adivinar que paso. Con esto, cada fallo llega como
 * { "error": "...", "detalle": "..." } y la interfaz puede mostrarlo.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	/** Formato de error del sistema de validacion de Spring. */
	record ErrorResponse(String error, String detalle, Map<String, String> campos) {
	}

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<ErrorResponse> api(ApiException ex) {
		// 5xx se loguea porque indica un fallo nuestro; 4xx es del cliente y
		// llenaria el log de ruido que nadie va a leer.
		if (ex.getStatus().is5xxServerError()) {
			log.error("Error de negocio {}", ex.getStatus(), ex);
		}
		return ResponseEntity.status(ex.getStatus())
				.body(new ErrorResponse("Error", ex.getMessage(), null));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> validacion(MethodArgumentNotValidException ex) {
		Map<String, String> campos = new java.util.HashMap<>();
		ex.getBindingResult().getFieldErrors()
				.forEach(error -> campos.putIfAbsent(error.getField(), error.getDefaultMessage()));

		String primero = campos.values().stream().findFirst().orElse("Revisa los datos del formulario");

		return ResponseEntity.badRequest()
				.body(new ErrorResponse("Datos invalidos", primero, campos));
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ErrorResponse> sinPermiso(AccessDeniedException ex) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body(new ErrorResponse("Sin permisos",
						"Tu cuenta no tiene permiso para esta accion", null));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> inesperado(Exception ex) {
		log.error("Error no controlado", ex);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ErrorResponse("Error interno",
						"Ocurrio un problema en nuestro servidor. Intenta de nuevo en un momento.", null));
	}
}