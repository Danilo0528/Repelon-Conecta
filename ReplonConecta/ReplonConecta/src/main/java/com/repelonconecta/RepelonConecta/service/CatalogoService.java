package com.repelonconecta.RepelonConecta.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.dto.CatalogoDtos;
import com.repelonconecta.RepelonConecta.dto.MetricasDtos;
import com.repelonconecta.RepelonConecta.entity.Categoria;
import com.repelonconecta.RepelonConecta.entity.Direccion;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.CategoriaRepository;
import com.repelonconecta.RepelonConecta.repository.DireccionRepository;
import com.repelonconecta.RepelonConecta.repository.NegocioRepository;
import com.repelonconecta.RepelonConecta.repository.PedidoRepository;
import com.repelonconecta.RepelonConecta.repository.ProductoRepository;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;

@Service
public class CatalogoService {

	private final CategoriaRepository categorias;
	private final DireccionRepository direcciones;
	private final PedidoRepository pedidos;
	private final NegocioRepository negocios;
	private final ProductoRepository productos;
	private final UsuarioRepository usuarios;
	private final CurrentUserService currentUser;
	private final NegocioService negocioService;

	public CatalogoService(CategoriaRepository categorias, DireccionRepository direcciones,
			PedidoRepository pedidos, NegocioRepository negocios, ProductoRepository productos,
			UsuarioRepository usuarios, CurrentUserService currentUser,
			NegocioService negocioService) {
		this.categorias = categorias;
		this.direcciones = direcciones;
		this.pedidos = pedidos;
		this.negocios = negocios;
		this.productos = productos;
		this.usuarios = usuarios;
		this.currentUser = currentUser;
		this.negocioService = negocioService;
	}

	// =====================================================================
	// CATEGORIAS
	// =====================================================================

	public List<CatalogoDtos.CategoriaResponse> categorias() {
		return categorias.findByActivaTrueOrderByOrdenAsc().stream()
				.map(CatalogoService::aCategoria)
				.toList();
	}

	/**
	 * Todas las categorias, incluidas las desactivadas.
	 *
	 * El comprador solo ve las activas; el admin necesita ver tambien
	 * las apagadas para poder reactivar el orden del catalogo sin
	 * tocar la base.
	 */
	public List<CatalogoDtos.CategoriaResponse> categoriasTodas() {
		return categorias.findAllByOrderByOrdenAsc().stream()
				.map(CatalogoService::aCategoria)
				.toList();
	}

	@Transactional
	public CatalogoDtos.CategoriaResponse crearCategoria(String nombre, String slug, String icono) {
		if (nombre == null || nombre.isBlank()) {
			throw ApiException.peticionInvalida("El nombre de la categoria es obligatorio");
		}

		Categoria categoria = new Categoria(nombre.trim(),
				slug != null && !slug.isBlank() ? slug.trim() : nombre.trim().toLowerCase(),
				icono,
				(int) categorias.count());

		return aCategoria(categorias.save(categoria));
	}

	/**
	 * Eliminar una categoria la desactiva, no la borra.
	 *
	 * Si tiene productos apuntando a ella, borrarla deja productos sin
	 * categoria. Desactivarla esconde la categoria del comprador pero
	 * mantiene los productos intactos.
	 */
	@Transactional
	public void eliminarCategoria(UUID categoriaId) {
		Categoria categoria = categorias.findById(categoriaId)
				.orElseThrow(() -> ApiException.noEncontrado("La categoria"));

		categoria.setActiva(false);
		categoria.tocar();
		categorias.save(categoria);
	}

	private static CatalogoDtos.CategoriaResponse aCategoria(Categoria categoria) {
		return new CatalogoDtos.CategoriaResponse(
				categoria.getId(),
				categoria.getNombre(),
				categoria.getSlug(),
				categoria.getIcono(),
				categoria.getOrden(),
				categoria.isActiva());
	}

	// =====================================================================
	// DIRECCIONES DEL COMPRADOR
	// =====================================================================

	public List<CatalogoDtos.DireccionResponse> misDirecciones() {
		Usuario usuario = currentUser.actual();

		return direcciones.findByUsuarioIdOrderByPredeterminadaDescCreadoEnDesc(usuario.getId())
				.stream()
				.map(CatalogoService::aDireccion)
				.toList();
	}

	@Transactional
	public CatalogoDtos.DireccionResponse guardarDireccion(CatalogoDtos.DireccionRequest request) {
		Usuario usuario = currentUser.actual();

		Direccion direccion = new Direccion(usuario,
				request.direccion().trim(),
				limpiar(request.barrio()),
				request.referencia().trim());

		direccion.setAlias(limpiar(request.alias()));
		direccion.setVereda(limpiar(request.vereda()));
		direccion.setTelefonoContacto(limpiar(request.telefonoContacto()));

		// Solo puede haber una predeterminada. Si esta lo va a ser se
		// quitan las demas; y si es la primera direccion del usuario, se
		// vuelve predeterminada sola para que el checkout la sugiera.
		boolean hayPredeterminada = !direcciones
				.findByUsuarioIdAndPredeterminadaTrue(usuario.getId()).isEmpty();

		if (Boolean.TRUE.equals(request.predeterminada()) || !hayPredeterminada) {
			desmarcarPredeterminadas(usuario);
			direccion.setPredeterminada(true);
		}

		return aDireccion(direcciones.save(direccion));
	}

	@Transactional
	public void eliminarDireccion(UUID direccionId) {
		Usuario usuario = currentUser.actual();

		Direccion direccion = direcciones.findById(direccionId)
				.orElseThrow(() -> ApiException.noEncontrado("La direccion"));

		if (!direccion.getUsuario().getId().equals(usuario.getId())) {
			throw ApiException.prohibido("Esta direccion no es tuya");
		}

		direcciones.delete(direccion);
	}

	private void desmarcarPredeterminadas(Usuario usuario) {
		for (Direccion existente : direcciones
				.findByUsuarioIdOrderByPredeterminadaDescCreadoEnDesc(usuario.getId())) {
			if (existente.isPredeterminada()) {
				existente.setPredeterminada(false);
				direcciones.save(existente);
			}
		}
	}

	private static CatalogoDtos.DireccionResponse aDireccion(Direccion direccion) {
		return new CatalogoDtos.DireccionResponse(
				direccion.getId(),
				direccion.getAlias(),
				direccion.getDireccion(),
				direccion.getBarrio(),
				direccion.getVereda(),
				direccion.getReferencia(),
				direccion.getTelefonoContacto(),
				direccion.isPredeterminada());
	}

	// =====================================================================
	// METRICAS
	// =====================================================================

	/**
	 * Cifras del panel del vendedor.
	 *
	 * La suma y el conteo excluyen CANCELADO y RECHAZADO por la misma
	 * razon: no fueron ventas. Si se sumaran, el tendero veria un total
	 * que nunca recibio y dejaria de mirar la pantalla.
	 *
	 * Todos los conteos son queries agregadas en la base, no conteo en
	 * Java sobre la lista completa: con el historial entero de un negocio
	 * activo, traer miles de filas en cada recarga de la pantalla es
	 * justo lo que no puede permitirse en una app que se usa con datos.
	 */
	public MetricasDtos.MetricasVendedorResponse metricasVendedor(UUID negocioId) {
		Usuario usuario = currentUser.actualVendedorOAdmin();

		// Verifica propiedad del negocio ANTES de devolver cifras de ventas.
		negocioService.negocioDelUsuario(negocioId, usuario);

		return new MetricasDtos.MetricasVendedorResponse(
				pedidos.ventasDesde(negocioId, PedidoService.inicioHoy()),
				(int) pedidos.contarVentasDesde(negocioId, PedidoService.inicioHoy()),
				pedidos.ventasDesde(negocioId, PedidoService.haceSemana()),
				(int) pedidos.contarVentasDesde(negocioId, PedidoService.haceSemana()),
				pedidos.ventasDesde(negocioId, PedidoService.haceMes()),
				(int) pedidos.contarVentasDesde(negocioId, PedidoService.haceMes()),
				(int) pedidos.contarSinDespachar(negocioId),
				(int) productos.countByNegocioId(negocioId),
				(int) productos.countByNegocioIdAndDisponibleFalse(negocioId));
	}

	/** Cifras generales de la plataforma. Solo admin. */
	public MetricasDtos.MetricasAdminResponse metricasAdmin() {
		currentUser.actualAdmin();

		long totalNegocios = negocios.count();
		long aprobados = negocios.countByAprobadoTrue();

		return new MetricasDtos.MetricasAdminResponse(
				totalNegocios,
				aprobados,
				totalNegocios - aprobados,
				usuarios.count(),
				pedidos.count(),
				pedidos.ventasTotalesDesde(PedidoService.haceMes()),
				pedidos.ventasTotalesDesde(PedidoService.inicioHoy()));
	}

	private String limpiar(String texto) {
		if (texto == null) {
			return null;
		}
		String recortado = texto.trim();
		return recortado.isEmpty() ? null : recortado;
	}
}