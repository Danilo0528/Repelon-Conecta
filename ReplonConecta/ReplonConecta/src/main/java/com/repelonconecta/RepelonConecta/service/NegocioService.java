package com.repelonconecta.RepelonConecta.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.dto.NegocioDtos;
import com.repelonconecta.RepelonConecta.dto.ProductoDtos;
import com.repelonconecta.RepelonConecta.entity.Negocio;
import com.repelonconecta.RepelonConecta.entity.Producto;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.NegocioRepository;
import com.repelonconecta.RepelonConecta.repository.ProductoRepository;

@Service
public class NegocioService {

	private final NegocioRepository negocios;
	private final ProductoRepository productos;
	private final CurrentUserService currentUser;
	private final SlugService slugs;

	@Value("${app.negocio.auto-aprueba:true}")
	private boolean autoAprueba;

	public NegocioService(NegocioRepository negocios, ProductoRepository productos,
			CurrentUserService currentUser, SlugService slugs) {
		this.negocios = negocios;
		this.productos = productos;
		this.currentUser = currentUser;
		this.slugs = slugs;
	}

	// =====================================================================
	// CONSULTA PUBLICA (sin iniciar sesion)
	// =====================================================================

	/**
	 * Buscador del home. Los cuatro filtros son opcionales y se pueden
	 * combinar: texto + barrio + abierto + categoria.
	 */
	public List<NegocioDtos.NegocioResponse> buscar(String texto, String barrio,
			Boolean abierto, UUID categoriaId) {
		return negocios.buscarPublico(
				textoVacioANulo(texto),
				textoVacioANulo(barrio),
				abierto,
				categoriaId).stream()
				.map(this::aResumen)
				.toList();
	}

	public List<NegocioDtos.NegocioResponse> destacados() {
		return negocios.findByAprobadoTrueAndDestacadoTrueOrderByNombreAsc().stream()
				.map(this::aResumen)
				.toList();
	}

	public List<String> barrios() {
		return negocios.barriosPublicos();
	}

	/**
	 * Ficha de un negocio por slug.
	 *
	 * Si el negocio no esta aprobado, solo la ve su dueno o el admin. De
	 * lo contrario un negocio pendiente seria visible para todo el mundo
	 * con quien se adivine la URL.
	 */
	public NegocioDtos.NegocioDetalleResponse detallePorSlug(String slug) {
		Negocio negocio = negocios.findBySlug(slug)
				.orElseThrow(() -> ApiException.noEncontrado("El negocio"));

		Usuario actual = usuarioActualOVisitante();

		boolean soyDueno = actual != null
				&& negocio.getDueno().getId().equals(actual.getId());
		boolean soyAdmin = actual != null && actual.getRol() == com.repelonconecta.RepelonConecta.entity.Rol.ADMIN;

		if (!negocio.isAprobado() && !soyDueno && !soyAdmin) {
			throw ApiException.noEncontrado("El negocio");
		}

		List<ProductoDtos.ProductoResponse> catalogo = productos
				.findByNegocioIdOrderByNombreAsc(negocio.getId(), null).stream()
				.map(NegocioService::aProducto)
				.toList();

		return new NegocioDtos.NegocioDetalleResponse(
				negocio.getId(),
				negocio.getNombre(),
				negocio.getSlug(),
				negocio.getDescripcion(),
				negocio.getDireccion(),
				negocio.getBarrio(),
				negocio.getLatitud(),
				negocio.getLongitud(),
				negocio.getReferenciaUbicacion(),
				negocio.getTelefono(),
				negocio.getWhatsapp(),
				negocio.getLogoUrl(),
				negocio.getHorario(),
				negocio.isAbierto(),
				negocio.isDestacado(),
				negocio.isAprobado(),
				soyDueno,
				negocio.getCreadoEn(),
				catalogo);
	}

	// =====================================================================
	// GESTION POR EL VENDEDOR
	// =====================================================================

	/**
	 * Alta de negocio. El usuario queda como VENDEDOR.
	 *
	 * En el MVP el negocio se auto-aprueba (app.negocio.auto-aprueba) para
	 * que un tendero pueda publicar y recibir pedidos sin que un admin
	 * tenga que aprobar cada solicitud una por una. Con la variable en
	 * false queda pendiente y
	 * solo aparece en el catalogo cuando el admin lo aprueba.
	 */
	@Transactional
	public NegocioDtos.NegocioDetalleResponse registrar(NegocioDtos.RegistroNegocioRequest request) {
		Usuario usuario = currentUser.actual();

		Negocio negocio = new Negocio(
				usuario,
				request.nombre().trim(),
				slugs.unico(request.nombre()),
				request.direccion().trim(),
				textoVacioANulo(request.barrio()));

		negocio.setDescripcion(request.descripcion());
		negocio.setTelefono(textoVacioANulo(request.telefono()));
		negocio.setWhatsapp(WhatsappService.normalizarNumero(request.whatsapp()));
		negocio.setHorario(textoVacioANulo(request.horario()));

		// La ubicacion es opcional, pero si viene debe venir completa y
		// con rangos validos: medio par de coordenadas no ubica nada.
		validarParCoordenadas(request.latitud(), request.longitud());
		negocio.setLatitud(request.latitud());
		negocio.setLongitud(request.longitud());
		negocio.setReferenciaUbicacion(textoVacioANulo(request.referenciaUbicacion()));

		negocio.setAprobado(autoAprueba);
		negocio.setAbierto(true);
		negocio.tocar();

		Negocio guardado = negocios.save(negocio);

		// A partir de tener un negocio, la persona es vendedora. El cambio
		// se aplica en la tabla y no en el token: el token se re-emite al
		// refrescarlo, y el backend lee el rol de la tabla.
		if (usuario.getRol() == com.repelonconecta.RepelonConecta.entity.Rol.COMPRADOR) {
			usuario.setRol(com.repelonconecta.RepelonConecta.entity.Rol.VENDEDOR);
		}

		return aDetalle(guardado, true);
	}

	/** Negocio del usuario actual. 404 si todavia no registro ninguno. */
	public Negocio miNegocio(Usuario usuario) {
		return negocios.findByDuenoId(usuario.getId())
				.stream()
				.findFirst()
				.orElseThrow(() -> ApiException.noEncontrado(
						"Tu usuario todavía no tiene un negocio registrado"));
	}

	/** Todos los negocios del usuario, por si tiene mas de uno. */
	public List<NegocioDtos.NegocioResponse> misNegocios(Usuario usuario) {
		return negocios.findByDuenoId(usuario.getId()).stream()
				.map(this::aResumen)
				.toList();
	}

	/**
	 * Editar perfil. Solo se tocan los campos que llegaron informed: si el
	 * frontend manda el formulario parcial, los ausentes se conservan en
	 * vez de borrarse.
	 */
	@Transactional
	public NegocioDtos.NegocioDetalleResponse actualizar(UUID negocioId,
			NegocioDtos.NegocioUpdateRequest request) {

		Usuario usuario = currentUser.actualVendedorOAdmin();
		Negocio negocio = negocioDelUsuario(negocioId, usuario);

		if (request.nombre() != null && !request.nombre().isBlank()) {
			negocio.setNombre(request.nombre().trim());
		}
		if (request.descripcion() != null) {
			negocio.setDescripcion(textoVacioANulo(request.descripcion()));
		}
		if (request.direccion() != null && !request.direccion().isBlank()) {
			negocio.setDireccion(request.direccion().trim());
		}
		if (request.barrio() != null) {
			negocio.setBarrio(textoVacioANulo(request.barrio()));
		}
		if (request.latitud() != null || request.longitud() != null) {
			Double latitud = request.latitud() != null ? request.latitud() : negocio.getLatitud();
			Double longitud = request.longitud() != null ? request.longitud() : negocio.getLongitud();
			validarParCoordenadas(latitud, longitud);
			negocio.setLatitud(latitud);
			negocio.setLongitud(longitud);
		}
		if (request.referenciaUbicacion() != null) {
			negocio.setReferenciaUbicacion(textoVacioANulo(request.referenciaUbicacion()));
		}
		if (request.telefono() != null) {
			negocio.setTelefono(textoVacioANulo(request.telefono()));
		}
		if (request.whatsapp() != null) {
			negocio.setWhatsapp(WhatsappService.normalizarNumero(request.whatsapp()));
		}
		if (request.horario() != null) {
			negocio.setHorario(textoVacioANulo(request.horario()));
		}
		if (request.logoUrl() != null) {
			negocio.setLogoUrl(textoVacioANulo(request.logoUrl()));
		}
		if (request.abierto() != null) {
			negocio.setAbierto(request.abierto());
		}

		negocio.tocar();

		return aDetalle(negocios.save(negocio), true);
	}

	/** Interruptor abierto/cerrado. Es un unico boton en el panel. */
	@Transactional
	public NegocioDtos.NegocioDetalleResponse cambiarEstadoAbierto(UUID negocioId, boolean abierto) {
		Usuario usuario = currentUser.actualVendedorOAdmin();
		Negocio negocio = negocioDelUsuario(negocioId, usuario);

		negocio.setAbierto(abierto);
		negocio.tocar();

		return aDetalle(negocios.save(negocio), true);
	}

	/**
	 * Verifica que el negocio pertenece al usuario.
	 *
	 * Esta es la comprobacion que evita el fallo de seguridad mas comun
	 * en un marketplace: que un vendedor modifique los productos de otro
	 * cambiando el id en la URL.
	 */
	public Negocio negocioDelUsuario(UUID negocioId, Usuario usuario) {
		Negocio negocio = negocios.findById(negocioId)
				.orElseThrow(() -> ApiException.noEncontrado("El negocio"));

		boolean esDueno = negocio.getDueno().getId().equals(usuario.getId());
		boolean esAdmin = usuario.getRol() == com.repelonconecta.RepelonConecta.entity.Rol.ADMIN;

		if (!esDueno && !esAdmin) {
			throw ApiException.prohibido("Este negocio es de otro usuario");
		}

		return negocio;
	}

	// =====================================================================
	// MAPEO
	// =====================================================================

	private NegocioDtos.NegocioResponse aResumen(Negocio negocio) {
		return new NegocioDtos.NegocioResponse(
				negocio.getId(),
				negocio.getNombre(),
				negocio.getSlug(),
				negocio.getDescripcion(),
				negocio.getDireccion(),
				negocio.getBarrio(),
				negocio.getLatitud(),
				negocio.getLongitud(),
				negocio.getTelefono(),
				negocio.getWhatsapp(),
				negocio.getLogoUrl(),
				negocio.isAbierto(),
				negocio.isDestacado(),
				productos.countByNegocioId(negocio.getId()));
	}

	private NegocioDtos.NegocioDetalleResponse aDetalle(Negocio negocio, boolean soyDueno) {
		List<ProductoDtos.ProductoResponse> catalogo = productos
				.findByNegocioIdOrderByNombreAsc(negocio.getId(), null).stream()
				.map(NegocioService::aProducto)
				.toList();

		return new NegocioDtos.NegocioDetalleResponse(
				negocio.getId(),
				negocio.getNombre(),
				negocio.getSlug(),
				negocio.getDescripcion(),
				negocio.getDireccion(),
				negocio.getBarrio(),
				negocio.getLatitud(),
				negocio.getLongitud(),
				negocio.getReferenciaUbicacion(),
				negocio.getTelefono(),
				negocio.getWhatsapp(),
				negocio.getLogoUrl(),
				negocio.getHorario(),
				negocio.isAbierto(),
				negocio.isDestacado(),
				negocio.isAprobado(),
				soyDueno,
				negocio.getCreadoEn(),
				catalogo);
	}

	static ProductoDtos.ProductoResponse aProducto(Producto producto) {
		return new ProductoDtos.ProductoResponse(
				producto.getId(),
				producto.getNegocio().getId(),
				producto.getNegocio().getNombre(),
				producto.getCategoria() != null ? producto.getCategoria().getId() : null,
				producto.getCategoria() != null ? producto.getCategoria().getNombre() : null,
				producto.getNombre(),
				producto.getDescripcion(),
				producto.getPrecio(),
				producto.getImagenUrl(),
				producto.isDisponible(),
				producto.getStock());
	}

	/**
	 * Usuario actual, o null si la peticion no tiene token.
	 *
	 * Necesario porque la ficha de negocio es publica: sin sesion hay que
	 * devolver el negocio igual, solo que sin marcar soyDueno.
	 */
	private Usuario usuarioActualOVisitante() {
		try {
			return currentUser.actual();
		} catch (ApiException e) {
			return null;
		}
	}

	/**
	 * Valida el par latitud/longitud que alimenta el mapa.
	 *
	 * La regla de negocio es "todo o nada": si el tendero marca el pin
	 * en el mapa llegan las dos; si dejo los campos vacios llegan las
	 * dos en null. Un solo valor dejaria un marcador sin sentido, asi
	 * que se rechaza con un 400 legible.
	 */
	private void validarParCoordenadas(Double latitud, Double longitud) {
		if ((latitud == null) != (longitud == null)) {
			throw ApiException.peticionInvalida(
					"La latitud y la longitud deben venir juntas");
		}
		if (latitud != null && (latitud < -90.0 || latitud > 90.0)) {
			throw ApiException.peticionInvalida("La latitud debe estar entre -90 y 90");
		}
		if (longitud != null && (longitud < -180.0 || longitud > 180.0)) {
			throw ApiException.peticionInvalida("La longitud debe estar entre -180 y 180");
		}
	}

	private String textoVacioANulo(String texto) {
		if (texto == null) {
			return null;
		}
		String recortado = texto.trim();
		return recortado.isEmpty() ? null : recortado;
	}
}