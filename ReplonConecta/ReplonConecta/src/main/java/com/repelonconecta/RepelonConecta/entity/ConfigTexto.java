package com.repelonconecta.RepelonConecta.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Texto editable guardado por clave (pares clave-valor chiquitos).
 *
 * Existe para que el panel pueda cambiar los textos del home sin
 * deploy: el estudiante escribe el titulo o el aviso, esto guarda la
 * clave, y el frontend usa el guardado mientras que haya y el texto
 * por defecto cuando no.
 *
 * No es un CMS: la tabla solo acepta las claves de una lista blanca
 * que vive en ConfigService. Cualquier clave inventada muere en el
 * PUT con 400.
 */
@Entity
@Table(name = "config_textos")
public class ConfigTexto {

	/** Clave legible, p.ej. "inicio.hero.titulo1". */
	@Id
	@Column(name = "clave", nullable = false, length = 80)
	private String clave;

	@Column(name = "valor", nullable = false, length = 2000)
	private String valor;

	@Column(name = "actualizado_en", nullable = false)
	private Instant actualizadoEn = Instant.now();

	public ConfigTexto() {
	}

	public ConfigTexto(String clave, String valor) {
		this.clave = clave;
		this.valor = valor;
	}

	public String getClave() {
		return clave;
	}

	public void setClave(String clave) {
		this.clave = clave;
	}

	public String getValor() {
		return valor;
	}

	public void setValor(String valor) {
		this.valor = valor;
	}

	public Instant getActualizadoEn() {
		return actualizadoEn;
	}

	public void setActualizadoEn(Instant actualizadoEn) {
		this.actualizadoEn = actualizadoEn;
	}

	public void tocar() {
		this.actualizadoEn = Instant.now();
	}
}
