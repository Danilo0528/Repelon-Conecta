package com.repelonconecta.RepelonConecta.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Persona registrada en la plataforma.
 *
 * La autenticacion la maneja Supabase: ahi vive la clave y el refresh
 * token. Esta tabla NO guarda contrasenas. Solo guarda el perfil y,
 * sobre todo, el id de Supabase para poder relacionar.
 *
 * El @Id es el mismo UUID que Supabase Auth genera para el usuario
 * (el claim "sub" del JWT). Por eso NO lleva @GeneratedValue: lo
 * asigna el cliente al registrarse en Supabase y Spring lo recibe
 * del JWT verificado. Esa es la unica pieza que ata ambos mundos, y
 * evita una tabla de mapeo.
 */
@Entity
@Table(name = "usuarios")
public class Usuario {

	/** UUID de Supabase Auth (claim "sub" del JWT). */
	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id;

	@Column(name = "email", nullable = false, unique = true, length = 255)
	private String email;

	@Column(name = "nombre", nullable = false, length = 120)
	private String nombre;

	/** Se normaliza a digitos: "+57 300 123 4567" se guarda como "3001234567". */
	@Column(name = "telefono", length = 20)
	private String telefono;

	@Enumerated(EnumType.STRING)
	@Column(name = "rol", nullable = false, length = 20)
	private Rol rol = Rol.COMPRADOR;

	@Column(name = "activo", nullable = false)
	private boolean activo = true;

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn = Instant.now();

	public Usuario() {
	}

	public Usuario(UUID id, String email, String nombre) {
		this.id = id;
		this.email = email;
		this.nombre = nombre;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public Rol getRol() {
		return rol;
	}

	public void setRol(Rol rol) {
		this.rol = rol;
	}

	public boolean isActivo() {
		return activo;
	}

	public void setActivo(boolean activo) {
		this.activo = activo;
	}

	public Instant getCreadoEn() {
		return creadoEn;
	}

	public void setCreadoEn(Instant creadoEn) {
		this.creadoEn = creadoEn;
	}
}