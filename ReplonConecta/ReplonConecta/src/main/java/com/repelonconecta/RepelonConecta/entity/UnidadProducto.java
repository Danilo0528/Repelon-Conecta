package com.repelonconecta.RepelonConecta.entity;

/**
 * Unidad de venta de un producto.
 *
 * Solo kilo y libra: son las unidades que el cliente confirmo que se usan
 * en el agro y la pesca del pueblo. La unidad vive en su propio campo y
 * no escrita dentro del nombre ("Yuca (kilo)" -> "Yuca" + KILO), para
 * que el buscador pueda filtrar, comparar y mostrar "por kilo" sin
 * adivinar dentro del texto.
 */
public enum UnidadProducto {
	KILO,
	LIBRA
}
