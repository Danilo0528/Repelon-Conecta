package com.repelonconecta.RepelonConecta.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Arma el link de WhatsApp con el resumen del pedido.
 *
 * Se hace en el servidor y no en el frontend por una razon concreta: si
 * el resumen lo arma el cliente, cada cambio futuro (un producto nuevo,
 * un campo de direccion) obliga a tocar el frontend. Ademas el link
 * tiene que ir URL-encoded y el texto lleva tildes, saltos de linea y
 * signos: concatenarlo a mano en un href es una fuente clasica de
 * links rotos.
 *
 * wa.me/es?text= abre el chat ya con el mensaje escrito. Asi el
 * tendero solo tiene que darle enviar.
 */
public final class WhatsappService {

	private static final ZoneId ZONA = ZoneId.of("America/Bogota");

	private static final DateTimeFormatter HORA =
			DateTimeFormatter.ofPattern("dd/MM/yyyy h:mm a").withZone(ZONA);

	private WhatsappService() {
	}

	/**
	 * Link de WhatsApp con el pedido listo para enviar al negocio.
	 *
	 * @param numero destino en formato internacional sin signos: 573001234567
	 */
	public static String resumenPedido(String numero, String numeroPedido, String negocioNombre,
			String clienteNombre, String lineas, long total, String metodoEntrega,
			String metodoPago, String direccionEntrega, String fecha) {

		StringBuilder texto = new StringBuilder();

		texto.append("*Nuevo pedido en Repelon Market*").append('\n');
		texto.append("Pedido: *").append(numeroPedido).append('*').append('\n');
		texto.append("Negocio: ").append(negocioNombre).append('\n');
		texto.append("Cliente: ").append(clienteNombre).append('\n');
		texto.append("Fecha: ").append(fecha).append("\n\n");

		texto.append("*Productos:*").append('\n');
		texto.append(lineas).append('\n');
		texto.append("\n*Total: $").append(formatPesos(total)).append(" COP*\n\n");

		texto.append("Entrega: ").append(metodoEntrega).append('\n');
		if (direccionEntrega != null && !direccionEntrega.isBlank()) {
			texto.append("Direccion: ").append(direccionEntrega).append('\n');
		}
		texto.append("Pago: ").append(metodoPago).append('\n');

		texto.append("\n_Enviado desde Repelon Market_");

		return construirUrl(numero, texto.toString());
	}

	/** Link simple de solo contacto con el negocio. */
	public static String contactoNegocio(String numero, String negocioNombre) {
		String texto = "Hola " + negocioNombre
				+ ", te escribo desde Repelon Market. Tengo una consulta.";
		return construirUrl(numero, texto);
	}

	/**
	 * Normaliza un numero colombiano a 57XXXXXXXXX.
	 *
	 * Acepta lo que la gente escribe de verdad: "+57 300 123 4567",
	 * "3001234567", "300 123 4567". Sin esto, medio pueblo queda fuera
	 * porque el boton de WhatsApp no abre.
	 */
	public static String normalizarNumero(String numero) {
		if (numero == null || numero.isBlank()) {
			return null;
		}

		String digitos = numero.replaceAll("\\D", "");

		if (digitos.startsWith("57")) {
			digitos = digitos.substring(2);
		}

		// Si no son 10 digitos (movil colombiano) no hay nada que
		// adivinar: se devuelve como estaba para que el usuario lo revise.
		if (digitos.length() != 10) {
			return null;
		}

		return "57" + digitos;
	}

	/** Construye la URL de wa.me. Numero vacio devuelve cadena vacia. */
	public static String construirUrl(String numero, String texto) {
		String limpio = normalizarNumero(numero);
		if (limpio == null) {
			return "";
		}
		String codificado = URLEncoder.encode(texto, StandardCharsets.UTF_8);
		return "https://wa.me/" + limpio + "?text=" + codificado;
	}

	/**
	 * Formato colombiano de pesos: 12000 -> "12.000".
	 *
	 * El punto es separador de miles, no decimal. Por eso los precios se
	 * guardan como enteros en la base.
	 */
	public static String formatPesos(long pesos) {
		return String.format("%,d", pesos).replace(',', '.');
	}
}