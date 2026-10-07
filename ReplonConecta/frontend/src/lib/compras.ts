/*
 * Interruptor de la funcionalidad de compra: carrito, checkout y pedidos.
 *
 * El cliente decidio (oct. 2026) que la app es SOLO intermediaria: la
 * compra termina en el WhatsApp del vendedor, la app no cobra ni
 * consulta. Por eso todo lo del carrito se OCULTA, no se borra: el
 * codigo sigue aqui, las paginas siguen existiendo y los endpoints del
 * backend no se tocan.
 *
 * Mientras este en false:
 *  - las rutas /carrito, /checkout y /pedidos redirigen al home
 *    (next.config.ts), asi nadie cae en una pantalla 404 ni en un
 *    carrito huerfano;
 *  - la cabecera, el perfil y la ficha del negocio no muestran los
 *    accesos de compra.
 *
 * Para devolver la compra al cliente: poner en true. No hay que
 * reescribir nada mas.
 */
export const COMPRAS_ACTIVAS = false;
