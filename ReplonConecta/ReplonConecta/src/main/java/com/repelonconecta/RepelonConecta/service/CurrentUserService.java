package com.repelonconecta.RepelonConecta.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.repelonconecta.RepelonConecta.entity.Rol;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;

/**
 * Resuelve el usuario actual desde el JWT de Supabase.
 *
 * El @Id de Usuario es el claim "sub" del token, asi que
 * authentication.getName() ya trae el UUID y no hace falta buscar por
 * email.
 *
 * IMPORTANTE: si la persona se registro en Supabase pero todavia no
 * ha abierto la app, no tiene fila en la tabla usuarios. actual() la
 * crea en el primer request, leyendo nombre y email del token. Asi el
 * frontend no necesita un endpoint de registro: basta con llamar a
 * /api/me la primera vez.
 */
@Service
public class CurrentUserService {

	private final UsuarioRepository usuarios;

	public CurrentUserService(UsuarioRepository usuarios) {
		this.usuarios = usuarios;
	}

	public UUID idActual() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated()
				|| auth.getName() == null
				|| "anonymousUser".equals(auth.getName())) {
			throw ApiException.noAutorizado("Inicia sesion para continuar");
		}

		try {
			return UUID.fromString(auth.getName());
		} catch (IllegalArgumentException e) {
			throw ApiException.noAutorizado("Sesion invalida");
		}
	}

	/**
	 * Devuelve el usuario actual, creandolo si es su primera visita.
	 *
	 * Nombre y email salen del JWT: los lleno el cliente al registrarse
	 * en Supabase dentro de user_metadata y email. El backend solo los
	 * lee, no los recibe.
	 */
	public Usuario actual() {
		UUID id = idActual();

		return usuarios.findById(id).orElseGet(() -> {
			Jwt jwt = tokenActual();
			Usuario nuevo = new Usuario(id,
					correoDe(jwt),
					nombreDe(jwt));
			return usuarios.save(nuevo);
		});
	}

	/**
	 * Exige rol VENDEDOR o ADMIN.
	 *
	 * Nota: el rol se lee de la tabla usuarios, no del token, y esa fila
	 * la creo el admin (o el propio usuario al registrarse como negocio).
	 * Por eso un token viejo sin rol de negocio sigue funcionando para
	 * comprar, pero no para vender.
	 */
	public Usuario actualVendedorOAdmin() {
		Usuario usuario = actual();
		if (usuario.getRol() != Rol.ADMIN && usuario.getRol() != Rol.VENDEDOR) {
			throw ApiException.prohibido("Esta seccion es solo para negocios");
		}
		return usuario;
	}

	public Usuario actualAdmin() {
		Usuario usuario = actual();
		if (usuario.getRol() != Rol.ADMIN) {
			throw ApiException.prohibido("Esta seccion es solo para administradores");
		}
		return usuario;
	}

	private Jwt tokenActual() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
			return jwt;
		}
		throw ApiException.noAutorizado("Sesion invalida");
	}

	private String correoDe(Jwt jwt) {
		String email = jwt.getClaimAsString("email");
		return email != null && !email.isBlank() ? email : "sin-correo@repelonmarket.co";
	}

	/** Nombre legible desde user_metadata, con el email como ultimo recurso. */
	private String nombreDe(Jwt jwt) {
		Object metadata = jwt.getClaims().get("user_metadata");
		if (metadata instanceof Map<?, ?> mapa) {
			Object nombre = mapa.get("nombre");
			if (nombre instanceof String s && !s.isBlank()) {
				return recortar(s);
			}
			Object nombreLargo = mapa.get("full_name");
			if (nombreLargo instanceof String s && !s.isBlank()) {
				return recortar(s);
			}
		}
		String email = jwt.getClaimAsString("email");
		if (email != null && email.contains("@")) {
			return email.substring(0, email.indexOf('@'));
		}
		return "Cliente";
	}

	private String recortar(String texto) {
		return texto.length() > 120 ? texto.substring(0, 120) : texto;
	}
}