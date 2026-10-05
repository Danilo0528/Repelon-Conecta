package com.repelonconecta.RepelonConecta.entity;

/**
 * Rol del usuario dentro de la plataforma.
 *
 * SUPABASE_ANON no se usa como rol: el JWT de Supabase trae los claims
 * app_metadata.rol y user_metadata.rol, que se mapean aqui. Ver
 * JwtAuthenticationConverter de la capa de seguridad.
 */
public enum Rol {

	/** Persona que compra. Es el rol por defecto al registrarse. */
	COMPRADOR,

	/** Dueno de un negocio. Puede publicar productos y gestionar pedidos. */
	VENDEDOR,

	/** Opera la plataforma. Aprueba negocios y ve metricas. */
	ADMIN
}