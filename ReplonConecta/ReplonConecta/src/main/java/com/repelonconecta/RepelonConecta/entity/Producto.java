package com.repelonconecta.RepelonConecta.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Producto publicado por un negocio.
 *
 * PRECIO: long y no BigDecimal a proposito. En Colombia el peso no tiene
 * subunitad en uso everyday y el formato pedido es "$12.000", sin
 * decimales. Un long elimina de raiz cualquier error de redondeo. Si
 * alguna vez se manejan centavos reales, el cambio a BigDecimal es local
 * a esta clase y a la de ItemPedido.
 */
@Entity
@Table(name = "productos")
public class Producto {

	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id = UUID.randomUUID();

	@ManyToOne(optional = false)
	@JoinColumn(name = "negocio_id", nullable = false)
	private Negocio negocio;

	@ManyToOne
	@JoinColumn(name = "categoria_id")
	private Categoria categoria;

	@Column(name = "nombre", nullable = false, length = 140)
	private String nombre;

	@Column(name = "descripcion", length = 600)
	private String descripcion;

	/** Valor en pesos colombianos, sin decimales. */
	@Column(name = "precio", nullable = false)
	private long precio;

	@Column(name = "imagen_url", length = 500)
	private String imagenUrl;

	/**
	 * El vendedor apago el producto a mano (se agoto, quedo paused por
	 * vacaciones). Un producto con disponible=false sigue apareciendo en
	 * el catalogo pero no se puede agregar al carrito.
	 */
	@Column(name = "disponible", nullable = false)
	private boolean disponible = true;

	/**
	 * Inventario. null significa que el negocio no lleva control de stock
	 * (una panaderia, por ejemplo). Si tiene valor y llega a 0, el
	 * producto se marca no disponible al guardar.
	 */
	@Column(name = "stock")
	private Integer stock;

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn = Instant.now();

	@Column(name = "actualizado_en", nullable = false)
	private Instant actualizadoEn = Instant.now();

	public Producto() {
	}

	public Producto(Negocio negocio, Categoria categoria, String nombre, long precio) {
		this.negocio = negocio;
		this.categoria = categoria;
		this.nombre = nombre;
		this.precio = precio;
	}

	public void tocar() {
		this.actualizadoEn = Instant.now();
	}

	/**
	 * Si el negocio lleva stock y ya se agoto, fuerza no disponible.
	 * Evita que el comprador pueda agregar algo que no existe.
	 */
	public void ajustarDisponibilidad() {
		if (this.stock != null && this.stock <= 0) {
			this.disponible = false;
		}
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public Negocio getNegocio() {
		return negocio;
	}

	public void setNegocio(Negocio negocio) {
		this.negocio = negocio;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public long getPrecio() {
		return precio;
	}

	public void setPrecio(long precio) {
		this.precio = precio;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

	public boolean isDisponible() {
		return disponible;
	}

	public void setDisponible(boolean disponible) {
		this.disponible = disponible;
	}

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public Instant getCreadoEn() {
		return creadoEn;
	}

	public void setCreadoEn(Instant creadoEn) {
		this.creadoEn = creadoEn;
	}

	public Instant getActualizadoEn() {
		return actualizadoEn;
	}

	public void setActualizadoEn(Instant actualizadoEn) {
		this.actualizadoEn = actualizadoEn;
	}
}