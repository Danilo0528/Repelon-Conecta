package com.repelonconecta.ReplonConecta.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.ReplonConecta.dto.NegocioDtos;
import com.repelonconecta.ReplonConecta.entity.Negocio;
import com.repelonconecta.ReplonConecta.repository.NegocioRepository;
import com.repelonconecta.ReplonConecta.repository.PedidoRepository;
import com.repelonconecta.ReplonConecta.repository.ProductoRepository;

@Service
public class AdminService {

	private final NegocioRepository negocios;
	private final ProductoRepository productos;
	private final PedidoRepository pedidos;
	private final CurrentUserService currentUser;

	public AdminService(NegocioRepository negocios, ProductoRepository productos,
			PedidoRepository pedidos, CurrentUserService currentUser) {
		this.negocios = negocios;
		this.productos = productos;
		this.pedidos = pedidos;
		this.currentUser = currentUser;
	}

	/** Lista de negocios con estado de aprobacion y datos del dueno. */
	public List<NegocioDtos.NegocioAdminResponse> listarTodos() {
		return negocios.findAllByOrderByCreadoEnDesc().stream()
				.map(this::aAdmin)
				.toList();
	}

	/**
	 * Aprobar, rechazar o destacar.
	 *
	 * Solo se toca lo que llega informado. Rechazar (aprobado=false) del
	 * catalogo no borra el negocio ni sus productos: el tendero puede
	 * corregir lo que fallaba y volver a pedir aprobacion.
	 */
	@Transactional
	public NegocioDtos.NegocioAdminResponse cambiarEstado(UUID negocioId,
			NegocioDtos.NegocioAdminToggleRequest request) {

		Negocio negocio = negocios.findById(negocioId)
				.orElseThrow(() -> ApiException.noEncontrado("El negocio"));

		if (request.aprobado() != null) {
			negocio.setAprobado(request.aprobado());
		}
		if (request.destacado() != null) {
			negocio.setDestacado(request.destacado());
		}

		negocio.tocar();

		return aAdmin(negocios.save(negocio));
	}

	/**
	 * Borrado definitivo de un negocio.
	 *
	 * Es irreversible y se lleva por delante el catalogo. Si el negocio
	 * ya tiene pedidos NO se borra: los pedidos apuntan a el con una FK
	 * obligatoria y, sobre todo, borrar el negocio borraria la prueba de
	 * que hubo una venta. En ese caso el admin debe desactivarlo
	 * (aprobado=false), que lo saca del catalogo sin perder el historial.
	 */
	@Transactional
	public void eliminar(UUID negocioId) {
		Negocio negocio = negocios.findById(negocioId)
				.orElseThrow(() -> ApiException.noEncontrado("El negocio"));

		if (pedidos.countByNegocioId(negocioId) > 0) {
			throw ApiException.conflicto(
					"Este negocio ya tiene pedidos y no se puede borrar. "
					+ "Desactivalo para sacarlo del catalogo sin perder el historial.");
		}

		negocios.delete(negocio);
	}

	private NegocioDtos.NegocioAdminResponse aAdmin(Negocio negocio) {
		return new NegocioDtos.NegocioAdminResponse(
				negocio.getId(),
				negocio.getNombre(),
				negocio.getSlug(),
				negocio.getBarrio(),
				negocio.getDireccion(),
				negocio.isAprobado(),
				negocio.isDestacado(),
				negocio.isAbierto(),
				negocio.getDueno().getId(),
				negocio.getDueno().getNombre(),
				negocio.getDueno().getEmail(),
				productos.countByNegocioId(negocio.getId()),
				pedidos.countByNegocioId(negocio.getId()),
				negocio.getCreadoEn());
	}
}