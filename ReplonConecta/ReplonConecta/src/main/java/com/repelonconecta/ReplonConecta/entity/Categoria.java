package com.repelonconecta.ReplonConecta.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Rubro de productos. Lo administra el admin.
 *
 * El icono es un nombre corto ("pan", "drogueria", "ferreteria") que el
 * frontend mapea a un SVG. Guardar el nombre en vez de un archivo mantiene
 * la base independiente del frontend y permite cambiar los iconos sin
 * migrar datos.
 */
@Entity
@Table(name = "categorias")
public class Categoria {

	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id = UUID.randomUUID();

	@Column(name = "nombre", nullable = false, unique = true, length = 60)
	private String nombre;

	/** Identificador corto y estable para URLs: /categoria/panaderia */
	@Column(name = "slug", nullable = false, unique = true, length = 60)
	private String slug;

	@Column(name = "icono", length = 40)
	private String icono;

	/** Controla el orden en que salen en la pantalla de inicio. */
	@Column(name = "orden", nullable = false)
	private Integer orden = 0;

	@Column(name = "activa", nullable = false)
	private boolean activa = true;

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn = Instant.now();

	@Column(name = "actualizado_en", nullable = false)
	private Instant actualizadoEn = Instant.now();

	public Categoria() {
	}

	public Categoria(String nombre, String slug, String icono, Integer orden) {
		this.nombre = nombre;
		this.slug = slug;
		this.icono = icono;
		this.orden = orden;
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

	public String getIcono() {
		return icono;
	}

	public void setIcono(String icono) {
		this.icono = icono;
	}

	public Integer getOrden() {
		return orden;
	}

	public void setOrden(Integer orden) {
		this.orden = orden;
	}

	public boolean isActiva() {
		return activa;
	}

	public void setActiva(boolean activa) {
		this.activa = activa;
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