package com.repelonconecta.RepelonConecta.config;

import java.util.List;

/**
 * Alcance de la plataforma: las familias de rubros que el cliente
 * decidio (agro, pesca y turismo). Ferreterias, droguerias, tiendas y
 * demas quedan fuera del catalogo publico aunque existan en la base.
 *
 * Definicion UNICA del backend: la busca el buscador de productos, el
 * listado publico de negocios y la siembra de datos. El frontend tiene
 * la suya en src/lib/alcance.ts (los dos lados estan escritos para
 * decir lo mismo; si cambia el alcance hay que cambiar los dos).
 */
public final class Alcance {

	/**
	 * Familias visibles para el comprador. Un negocio desaparece del
	 * catalogo si tiene al menos un producto de una categoria fuera de
	 * esta lista (los rubros que el cliente recorto no se publican).
	 */
	public static final List<String> FAMILIAS = List.of("agro", "pesca", "turismo");

	/**
	 * Familias con catalogo de productos con precio. Turismo no esta:
	 * sus fichas muestran direcciones y zonas, sin precios, asi que el
	 * buscador de productos no la abre.
	 */
	public static final List<String> CON_PRODUCTO = List.of("agro", "pesca");

	private Alcance() {
	}
}
