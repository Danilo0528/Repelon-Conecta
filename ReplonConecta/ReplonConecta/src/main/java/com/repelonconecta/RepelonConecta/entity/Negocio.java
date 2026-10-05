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
 * Tienda, restaurante o prestador de servicios.
 *
 * El dueno es un Usuario con rol VENDEDOR. Un usuario puede tener varios
 * negocios (un pharmacies familiar, por ejemplo), asi que la relacion es
 * de muchos a uno y no de uno a uno.
 */
@Entity
@Table(name = "negocios")
public class Negocio {

	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id = UUID.randomUUID();

	@ManyToOne(optional = false)
	@JoinColumn(name = "dueno_id", nullable = false)
	private Usuario dueno;

	@Column(name = "nombre", nullable = false, length = 120)
	private String nombre;

	/** Identificador corto para URLs: /negocio/panaderia-la-esquina */
	@Column(name = "slug", nullable = false, unique = true, length = 140)
	private String slug;

	@Column(name = "descripcion", length = 1000)
	private String descripcion;

	/** Calle y numero. */
	@Column(name = "direccion", nullable = false, length = 200)
	private String direccion;

	/** Barrio o vereda de Repelon. Alimenta el filtro por zona. */
	@Column(name = "barrio", length = 100)
	private String barrio;

	/**
	 * Coordenadas para pintar el negocio en el mapa (Google Maps).
	 *
	 * Son nullables a proposito: el tendero puede registrar su negocio
	 * sin marcar la ubicacion y completarla despues. Un negocio sin
	 * coordenadas no aparece como marcador, solo en la lista.
	 */
	@Column(name = "latitud")
	private Double latitud;

	@Column(name = "longitud")
	private Double longitud;

	/** Referencia textual de la ubicacion: "frente a la plaza". */
	@Column(name = "referencia_ubicacion", length = 200)
	private String referenciaUbicacion;

	@Column(name = "telefono", length = 20)
	private String telefono;

	/** Numero con prefijo internacional, se arma solo: 573001234567 */
	@Column(name = "whatsapp", length = 20)
	private String whatsapp;

	@Column(name = "logo_url", length = 500)
	private String logoUrl;

	/**
	 * Horario en JSON: {"lunes":{"abre":"08:00","cierra":"18:00"}, ...}
	 *
	 * Se guarda como texto y no como entidad Reloj porque en el MVP el
	 * negocio abre y cierra a mano desde su panel. Un horario real por
	 * dia es trabajo de fase 2, cuando exista el delivery con horarios.
	 */
	@Column(name = "horario", columnDefinition = "text")
	private String horario;

	/** Interruptor manual abierto/cerrado. Es lo que filtra "abierto ahora". */
	@Column(name = "abierto", nullable = false)
	private boolean abierto = true;

	/**
	 * Gate de visibilidad. Un negocio no aprobado no aparece en el
	 * catalogo ni se puede buscar. En el MVP queda en true al
	 * registrarse (app.negocio.auto-aprueba).
	 */
	@Column(name = "aprobado", nullable = false)
	private boolean aprobado = false;

	/** Destacado en la pantalla de inicio. Lo elige el admin. */
	@Column(name = "destacado", nullable = false)
	private boolean destacado = false;

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn = Instant.now();

	@Column(name = "actualizado_en", nullable = false)
	private Instant actualizadoEn = Instant.now();

	public Negocio() {
	}

	public Negocio(Usuario dueno, String nombre, String slug, String direccion, String barrio) {
		this.dueno = dueno;
		this.nombre = nombre;
		this.slug = slug;
		this.direccion = direccion;
		this.barrio = barrio;
	}

	public void tocar() {
		this.actualizadoEn = Instant.now();
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public Usuario getDueno() {
		return dueno;
	}

	public void setDueno(Usuario dueno) {
		this.dueno = dueno;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
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

	public Double getLatitud() {
		return latitud;
	}

	public void setLatitud(Double latitud) {
		this.latitud = latitud;
	}

	public Double getLongitud() {
		return longitud;
	}

	public void setLongitud(Double longitud) {
		this.longitud = longitud;
	}

	public String getReferenciaUbicacion() {
		return referenciaUbicacion;
	}

	public void setReferenciaUbicacion(String referenciaUbicacion) {
		this.referenciaUbicacion = referenciaUbicacion;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getWhatsapp() {
		return whatsapp;
	}

	public void setWhatsapp(String whatsapp) {
		this.whatsapp = whatsapp;
	}

	public String getLogoUrl() {
		return logoUrl;
	}

	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}

	public String getHorario() {
		return horario;
	}

	public void setHorario(String horario) {
		this.horario = horario;
	}

	public boolean isAbierto() {
		return abierto;
	}

	public void setAbierto(boolean abierto) {
		this.abierto = abierto;
	}

	public boolean isAprobado() {
		return aprobado;
	}

	public void setAprobado(boolean aprobado) {
		this.aprobado = aprobado;
	}

	public boolean isDestacado() {
		return destacado;
	}

	public void setDestacado(boolean destacado) {
		this.destacado = destacado;
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