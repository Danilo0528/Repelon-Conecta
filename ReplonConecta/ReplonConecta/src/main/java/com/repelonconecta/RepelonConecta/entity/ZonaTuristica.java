package com.repelonconecta.RepelonConecta.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Zona turística del home: un lugar de interés de Repelón.
 *
 * La cargan los estudiantes desde el panel /admin (nombre, dirección,
 * foto por URL y un motivo que el frontend usa para elegir la
 * ilustración de respaldo). Las coordenadas son opcionales: sin ellas,
 * el enlace "Abrir en Google Maps" busca por la dirección escrita,
 * igual que hacía la lista estática que vivía en el frontend.
 */
@Entity
@Table(name = "zonas_turisticas")
public class ZonaTuristica {

	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id = UUID.randomUUID();

	@Column(name = "nombre", nullable = false, length = 80)
	private String nombre;

	@Column(name = "descripcion", length = 300)
	private String descripcion;

	@Column(name = "direccion", nullable = false, length = 200)
	private String direccion;

	@Column(name = "latitud")
	private Double latitud;

	@Column(name = "longitud")
	private Double longitud;

	/** URL de la foto (la suben por URL o al bucket); null = ilustración. */
	@Column(name = "imagen_url", length = 500)
	private String imagenUrl;

	/** Tema de la ilustración de respaldo: agua, barco, aves, ... */
	@Column(name = "motivo", length = 20)
	private String motivo;

	/** Controla el orden en que salen en el home. */
	@Column(name = "orden", nullable = false)
	private Integer orden = 0;

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn = Instant.now();

	public ZonaTuristica() {
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

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

	public String getMotivo() {
		return motivo;
	}

	public void setMotivo(String motivo) {
		this.motivo = motivo;
	}

	public Integer getOrden() {
		return orden;
	}

	public void setOrden(Integer orden) {
		this.orden = orden;
	}

	public Instant getCreadoEn() {
		return creadoEn;
	}

	public void setCreadoEn(Instant creadoEn) {
		this.creadoEn = creadoEn;
	}
}
