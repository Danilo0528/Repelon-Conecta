package com.repelonconecta.ReplonConecta.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Direccion guardada de un comprador, reutilizable entre pedidos.
 *
 * Esto NO es la direccion de un pedido. El Pedido copia estos campos a
 * sus propias columnas de snapshot, y eso es deliberado: si el
 * comprador cambia o borra su direccion guardada, el historial de
 * pedidos debe seguir diciendo donde se llevo ese pedido concreto.
 */
@Entity
@Table(name = "direcciones")
public class Direccion {

	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id = UUID.randomUUID();

	@ManyToOne(optional = false)
	@JoinColumn(name = "usuario_id", nullable = false)
	private Usuario usuario;

	/** Alias para reconocerla en la lista: "Casa", "Casa de la abuela". */
	@Column(name = "alias", length = 60)
	private String alias;

	/** Calle, carrera, numero. */
	@Column(name = "direccion", nullable = false, length = 200)
	private String direccion;

	/** Barrio dentro de Repelon. */
	@Column(name = "barrio", length = 100)
	private String barrio;

	/** Vereda rural, para pedidos fuera del casco urbano. */
	@Column(name = "vereda", length = 100)
	private String vereda;

	/**
	 * "Casa de las flores azules al lado de la tienda". En Repelon la
	 * direccion sola no basta, esta referencia es lo que hace que el
	 * domiciliario llegue. De ahi que el checkout la pida siempre.
	 */
	@Column(name = "referencia", nullable = false, length = 300)
	private String referencia;

	@Column(name = "telefono_contacto", length = 20)
	private String telefonoContacto;

	@Column(name = "predeterminada", nullable = false)
	private boolean predeterminada = false;

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn = Instant.now();

	public Direccion() {
	}

	public Direccion(Usuario usuario, String direccion, String barrio, String referencia) {
		this.usuario = usuario;
		this.direccion = direccion;
		this.barrio = barrio;
		this.referencia = referencia;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getBarrio() {
		return barrio;
	}

	public void setBarrio(String barrio) {
		this.barrio = barrio;
	}

	public String getVereda() {
		return vereda;
	}

	public void setVereda(String vereda) {
		this.vereda = vereda;
	}

	public String getReferencia() {
		return referencia;
	}

	public void setReferencia(String referencia) {
		this.referencia = referencia;
	}

	public String getTelefonoContacto() {
		return telefonoContacto;
	}

	public void setTelefonoContacto(String telefonoContacto) {
		this.telefonoContacto = telefonoContacto;
	}

	public boolean isPredeterminada() {
		return predeterminada;
	}

	public void setPredeterminada(boolean predeterminada) {
		this.predeterminada = predeterminada;
	}

	public Instant getCreadoEn() {
		return creadoEn;
	}

	public void setCreadoEn(Instant creadoEn) {
		this.creadoEn = creadoEn;
	}
}