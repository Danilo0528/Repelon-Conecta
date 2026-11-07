package com.repelonconecta.RepelonConecta.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import com.repelonconecta.RepelonConecta.dto.PedidoDtos;
import com.repelonconecta.RepelonConecta.entity.EstadoPedido;
import com.repelonconecta.RepelonConecta.entity.MetodoEntrega;
import com.repelonconecta.RepelonConecta.entity.MetodoPago;
import com.repelonconecta.RepelonConecta.entity.Negocio;
import com.repelonconecta.RepelonConecta.entity.Producto;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.NegocioRepository;
import com.repelonconecta.RepelonConecta.repository.ProductoRepository;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;

/**
 * Reglas de negocio de pedidos que no dependen del panel admin.
 *
 * Cada test lleva @DisplayName porque docs/generated/specs/functional-spec.md
 * se genera a partir de esos nombres: el test es la especificacion viva.
 */
@SpringBootTest
@ActiveProfiles("test")
class PedidoServiceTests {

	@Autowired
	private PedidoService pedidos;

	@Autowired
	private UsuarioRepository usuarios;

	@Autowired
	private NegocioRepository negocios;

	@Autowired
	private ProductoRepository productos;

	@AfterEach
	void limpiar() {
		SecurityContextHolder.clearContext();
	}

	@Test
	@DisplayName("Un pedido no puede mezclar productos de dos negocios")
	void rechazaProductosDeDosNegocios() {
		Usuario comprador = usuario("Comprador");
		autenticar(comprador.getId());

		Negocio negocioA = negocio(usuario("Dueno A"), "Negocio A");
		Negocio negocioB = negocio(usuario("Dueno B"), "Negocio B");
		Producto productoB = producto(negocioB, "Producto B");

		PedidoDtos.CrearPedidoRequest request = new PedidoDtos.CrearPedidoRequest(
				negocioA.getId(),
				List.of(new PedidoDtos.LineaRequest(productoB.getId(), 1)),
				MetodoEntrega.RECOGER_EN_TIENDA,
				MetodoPago.EFECTIVO_CONTRA_ENTREGA,
				null, null, null, null, null, null);

		assertThatThrownBy(() -> pedidos.crear(request))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("dos negocios");
	}

	@Test
	@DisplayName("El comprador no puede cancelar un pedido que ya esta en camino")
	void noCancelaPedidoEnCamino() {
		Usuario comprador = usuario("Comprador");
		autenticar(comprador.getId());

		Usuario dueno = usuario("Dueno");
		Negocio negocio = negocio(dueno, "Negocio");
		Producto producto = producto(negocio, "Producto");

		PedidoDtos.PedidoDetalleResponse creado = pedidos.crear(
				new PedidoDtos.CrearPedidoRequest(
						negocio.getId(),
						List.of(new PedidoDtos.LineaRequest(producto.getId(), 1)),
						MetodoEntrega.RECOGER_EN_TIENDA,
						MetodoPago.EFECTIVO_CONTRA_ENTREGA,
						null, null, null, null, null, null));

		pedidos.cambiarEstado(creado.id(),
				new PedidoDtos.CambiarEstadoRequest(EstadoPedido.EN_PREPARACION, null), dueno);
		pedidos.cambiarEstado(creado.id(),
				new PedidoDtos.CambiarEstadoRequest(EstadoPedido.EN_CAMINO, null), dueno);

		assertThatThrownBy(() -> pedidos.cancelar(creado.id(), comprador))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("en camino");
	}

	private Usuario usuario(String etiqueta) {
		return usuarios.save(new Usuario(UUID.randomUUID(),
				etiqueta.toLowerCase() + "-" + UUID.randomUUID() + "@prueba.co",
				etiqueta));
	}

	private Negocio negocio(Usuario dueno, String etiqueta) {
		String sufijo = UUID.randomUUID().toString().substring(0, 8);
		Negocio negocio = new Negocio(dueno, etiqueta + " " + sufijo,
				"negocio-" + sufijo, "Calle 1", "Centro");
		negocio.setAprobado(true);
		negocio.setAbierto(true);
		return negocios.save(negocio);
	}

	private Producto producto(Negocio negocio, String etiqueta) {
		Producto producto = new Producto(negocio, null,
				etiqueta + " " + UUID.randomUUID(), 1000L);
		producto.setStock(10);
		producto.setDisponible(true);
		return productos.save(producto);
	}

	private void autenticar(UUID id) {
		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken(id.toString(), "n/a", List.of()));
	}
}
