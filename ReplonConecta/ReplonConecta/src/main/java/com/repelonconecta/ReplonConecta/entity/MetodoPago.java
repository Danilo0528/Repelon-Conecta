package com.repelonconecta.ReplonConecta.entity;

/**
 * Como paga el comprador.
 *
 * NOTA IMPORTANTE PARA EL MVP: ningun metodo mueve dinero de verdad.
 * El comprador declara como va a pagar y el VENDEDOR confirma el pago a
 * mano desde su panel. Esto es deliberado: integrar pasarela de pagos es
 * trabajo de fase 2 (ver PagosOnline.md en la documentacion).
 */
public enum MetodoPago {

	/** Paga al recibir. Es el metodo por defecto porque no requiere nada. */
	EFECTIVO_CONTRA_ENTREGA,

	/** El comprador transfiere y muestra el comprobante. */
	NEQUI,

	DAVIPLATA,

	TRANSFERENCIA_BANCARIA
}