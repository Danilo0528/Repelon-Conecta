package com.repelonconecta.RepelonConecta.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.dto.NegocioDtos;
import com.repelonconecta.RepelonConecta.dto.UsuarioDtos;
import com.repelonconecta.RepelonConecta.entity.Rol;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.NegocioRepository;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;

@Service
public class UsuarioService {

	private final UsuarioRepository usuarios;
	private final NegocioRepository negocios;
	private final CurrentUserService currentUser;

	public UsuarioService(UsuarioRepository usuarios, NegocioRepository negocios,
			CurrentUserService currentUser) {
		this.usuarios = usuarios;
		this.negocios = negocios;
		this.currentUser = currentUser;
	}

	public UsuarioDtos.UsuarioResponse yo() {
		return aRespuesta(currentUser.actual());
	}

	// =====================================================================
	// ADMINISTRACION DE CUENTAS
	// =====================================================================

	/** Todos los usuarios, del mas reciente al mas viejo. Solo admin. */
	public java.util.List<UsuarioDtos.UsuarioResponse> listarTodos() {
		currentUser.actualAdmin();
		return usuarios.findAllByOrderByCreadoEnDesc().stream()
				.map(this::aRespuesta)
				.toList();
	}

	/**
	 * Cambia rol y/o estado de una cuenta desde el panel del admin.
	 *
	 * Dos guardas que no son decorativas:
	 *
	 * 1. El admin no puede tocarse a si mismo. Cambiar el propio rol o
	 *    desactivarse dejaria la plataforma sin nadie que la opere, y
	 *    la recuperacion obligaria a tocar la base a mano.
	 * 2. Desactivar no es borrar: la fila queda para que sus pedidos y
	 *    su negocio sigan teniendo historia, pero CurrentUserService
	 *    ya no deja operar a esa cuenta.
	 */
	@Transactional
	public UsuarioDtos.UsuarioResponse actualizar(UUID usuarioId, Rol rol, Boolean activo) {
		Usuario admin = currentUser.actualAdmin();

		if (usuarioId.equals(admin.getId())) {
			throw ApiException.peticionInvalida(
					"No puedes cambiar tu propia cuenta desde aqui");
		}

		Usuario usuario = usuarios.findById(usuarioId)
				.orElseThrow(() -> ApiException.noEncontrado("El usuario"));

		if (rol != null) {
			usuario.setRol(rol);
		}
		if (activo != null) {
			usuario.setActivo(activo);
		}

		return aRespuesta(usuarios.save(usuario));
	}

	/**
	 * Actualiza nombre y telefono.
	 *
	 * El @Transactional no es decorativo: sin el, la entidad que devuelve
	 * currentUser.actual() queda desligada al terminar el metodo y el save
	 * grabaria en una sesion distinta. Ademas el save explicito es lo que
	 * asegura que el cambio llegue a la base.
	 */
	@Transactional
	public UsuarioDtos.UsuarioResponse actualizarPerfil(String nombre, String telefono) {
		Usuario usuario = currentUser.actual();

		if (nombre != null && !nombre.isBlank()) {
			usuario.setNombre(recortar(nombre.trim(), 120));
		}

		if (telefono != null) {
			String digitos = telefono.replaceAll("\\D", "");
			usuario.setTelefono(digitos.isEmpty() ? null : digitos);
		}

		return aRespuesta(usuarios.save(usuario));
	}

	/**
	 * El usuario se declara vendedor.
	 *
	 * Es seguro que alguien se promueva a si mismo VENDEDOR: no le da
	 * poder sobre ningun otro negocio. Lo peligroso seria dejar que se
	 * promotea a ADMIN, y por eso el rol ADMIN no se acepta aqui; se
	 * cambia desde Supabase o desde la consola de SQL, que son lugares
	 * a los que no llega un usuario normal.
	 */
	@Transactional
	public UsuarioDtos.UsuarioResponse registrarComoVendedor() {
		Usuario usuario = currentUser.actual();

		if (usuario.getRol() != Rol.ADMIN) {
			usuario.setRol(Rol.VENDEDOR);
		}

		return aRespuesta(usuarios.save(usuario));
	}

	private UsuarioDtos.UsuarioResponse aRespuesta(Usuario usuario) {
		return new UsuarioDtos.UsuarioResponse(
				usuario.getId(),
				usuario.getEmail(),
				usuario.getNombre(),
				usuario.getTelefono(),
				usuario.getRol(),
				usuario.isActivo(),
				!negocios.findByDuenoId(usuario.getId()).isEmpty(),
				usuario.getCreadoEn());
	}

	private String recortar(String texto, int max) {
		return texto.length() > max ? texto.substring(0, max) : texto;
	}
}