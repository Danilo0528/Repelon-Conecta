package com.repelonconecta.RepelonConecta.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Una linea de un pedido: "2 x Pan de queso = $24.000".
 *
 * Guarda el NOMBRE y el PRECIO del producto en el momento de la compra,
 * no una referencia viva. Si el negocio borra el producto o le cambia el
 * precio manana, este pedido debe seguir mostrando lo que se cobro.
 *
 * Referencia al producto: si la borra, la linea queda sin destino
 * (ON DELETE SET NULL) en vez de desaparecer. Un recibo que pierde
 * renglones porque el negocio limpio su catalogo es un bug que el
 * tendero no entiende y el cliente si.
 */
@Entity
@Table(name = "items_pedido")
public class ItemPedido {

	/*
	 * Id asignado a mano, igual que Pedido, Producto y el resto de las
	 * entidades: NO lleva @GeneratedValue.
	 *
	 * Con @GeneratedValue + id precargado, `em.merge` en cascada (el
	 * camino de `PedidoService.crear`) buscaba la fila por un id que
	 * aun no existia y reventaba con StaleObjectStateException
	 * ("Row was already updated or deleted") justo al guardar el
	 * pedido. Con id asignado, Hibernate lo trata como entidad nueva
	 * y la inserta.
	 */
	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id = UUID.randomUUID();

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "pedido_id", nullable = false)
	private Pedido pedido;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "producto_id")
	private Producto producto;

	/** Snapshot del nombre. */
	@Column(name = "producto_nombre", nullable = false, length = 140)
	private String productoNombre;

	/** Snapshot del precio unitario en pesos. */
	@Column(name = "precio_unitario", nullable = false)
	private long precioUnitario;

	@Column(name = "cantidad", nullable = false)
	private int cantidad;

	/** Snapshot de la foto, para que el historial se vea igual que al comprar. */
	@Column(name = "producto_imagen_url", length = 500)
	private String productoImagenUrl;

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn = Instant.now();

	public ItemPedido() {
	}

	public ItemPedido(Producto producto, int cantidad) {
		this.producto = producto;
		this.cantidad = cantidad;
		this.productoNombre = producto.getNombre();
		this.precioUnitario = producto.getPrecio();
		this.productoImagenUrl = producto.getImagenUrl();
	}

	public long getSubtotal() {
		return precioUnitario * cantidad;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public Pedido getPedido() {
		return pedido;
	}

	public void setPedido(Pedido pedido) {
		this.pedido = pedido;
	}

	public Producto getProducto() {
		return producto;
	}

	public void setProducto(Producto producto) {
		this.producto = producto;
	}

	public String getProductoNombre() {
		return productoNombre;
	}

	public void setProductoNombre(String productoNombre) {
		this.productoNombre = productoNombre;
	}

	public long getPrecioUnitario() {
		return precioUnitario;
	}

	public void setPrecioUnitario(long precioUnitario) {
		this.precioUnitario = precioUnitario;
	}

	public int getCantidad() {
		return cantidad;
	}

	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}

	public String getProductoImagenUrl() {
		return productoImagenUrl;
	}

	public void setProductoImagenUrl(String productoImagenUrl) {
		this.productoImagenUrl = productoImagenUrl;
	}

	public Instant getCreadoEn() {
		return creadoEn;
	}

	public void setCreadoEn(Instant creadoEn) {
		this.creadoEn = creadoEn;
	}
}