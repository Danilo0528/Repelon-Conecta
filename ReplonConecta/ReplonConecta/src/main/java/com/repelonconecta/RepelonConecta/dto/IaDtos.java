package com.repelonconecta.RepelonConecta.dto;

import java.util.List;

/** Respuestas del asistente virtual de Repelón Conecta. */
public final class IaDtos {

	private IaDtos() {
	}

	/**
	 * Lo que el chat recibe de vuelta.
	 *
	 * La IA escribe texto libre, pero el frontend necesita algo más que
	 * texto para poder pintar una tarjeta con el nombre, la dirección y
	 * los enlaces del negocio. Por eso `negocios` trae aparte, y solo los
	 * comercios que el texto menciona de verdad: el servicio los empareja
	 * contra la base después de que el modelo responde, sin pedirle al
	 * modelo que devuelva JSON (que es donde suele fallar).
	 */
	public record ChatResponse(String respuesta, List<NegocioIa> negocios) {
	}

	/**
	 * Ficha mínima de un negocio que el asistente acaba de recomendar.
	 *
	 * `whatsapp` y las coordenadas viajan tal cual (pueden ser nulos): el
	 * frontend es quien arma el enlace a wa.me y el de Google Maps, y
	 * decide qué botón mostrar si faltan.
	 */
	public record NegocioIa(
			String slug,
			String nombre,
			String barrio,
			String direccion,
			Double latitud,
			Double longitud,
			String whatsapp,
			String logoUrl,
			boolean abierto) {
	}
}
