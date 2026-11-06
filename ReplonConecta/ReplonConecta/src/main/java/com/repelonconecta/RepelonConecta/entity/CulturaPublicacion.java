package com.repelonconecta.RepelonConecta.entity;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Publicación del feed de Cultura (/cultura).
 *
 * La carga el admin desde el panel (autor, lugar, fecha, pie y un medio:
 * una foto o un video). El orden del feed lo da la fecha, de más
 * reciente a más antiguo —igual que un muro de publicaciones—, con
 * `creado_en` como desempate para dos publicaciones del mismo día.
 *
 * `media_url` guarda la URL de la foto, o el ID/URL de YouTube, o la URL
 * de un archivo de video (mp4): cómo se interpreta lo decide el
 * frontend al pintar, que es quien sabe embeber YouTube o reproducir
 * un archivo directo.
 */
@Entity
@Table(name = "cultura_publicaciones")
public class CulturaPublicacion {

	/** FOTO o VIDEO: el tipo de medio de la publicación. */
	public static final String TIPO_FOTO = "FOTO";
	public static final String TIPO_VIDEO = "VIDEO";

	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id = UUID.randomUUID();

	@Column(name = "autor", nullable = false, length = 60)
	private String autor;

	@Column(name = "lugar", length = 100)
	private String lugar;

	@Column(name = "fecha", nullable = false)
	private LocalDate fecha;

	@Column(name = "texto", nullable = false, length = 600)
	private String texto;

	@Column(name = "tipo", nullable = false, length = 10)
	private String tipo = TIPO_FOTO;

	@Column(name = "media_url", nullable = false, length = 500)
	private String mediaUrl;

	@Column(name = "credito", length = 120)
	private String credito;

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn = Instant.now();

	public CulturaPublicacion() {
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getAutor() {
		return autor;
	}

	public void setAutor(String autor) {
		this.autor = autor;
	}

	public String getLugar() {
		return lugar;
	}

	public void setLugar(String lugar) {
		this.lugar = lugar;
	}

	public LocalDate getFecha() {
		return fecha;
	}

	public void setFecha(LocalDate fecha) {
		this.fecha = fecha;
	}

	public String getTexto() {
		return texto;
	}

	public void setTexto(String texto) {
		this.texto = texto;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public String getMediaUrl() {
		return mediaUrl;
	}

	public void setMediaUrl(String mediaUrl) {
		this.mediaUrl = mediaUrl;
	}

	public String getCredito() {
		return credito;
	}

	public void setCredito(String credito) {
		this.credito = credito;
	}

	public Instant getCreadoEn() {
		return creadoEn;
	}

	public void setCreadoEn(Instant creadoEn) {
		this.creadoEn = creadoEn;
	}
}
