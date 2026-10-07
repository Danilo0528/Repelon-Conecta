package com.repelonconecta.RepelonConecta.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
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
import com.repelonconecta.RepelonConecta.entity.Producto;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.ProductoRepository;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;

/**
 * Pedidos del panel admin: listado global y anulacion.
 *
 * El pedido de prueba se crea por el camino normal (el mismo que usa
 * el comprador) para que el test cubra de punta a punta: crear pide
 * stock, listar lo ve el admin, cancelar devuelve el stock.
 */
@SpringBootTest
@ActiveProfiles("test")
class AdminPedidoTests {

	private static final UUID ADMIN_ID =
			UUID.fromString("00000000-0000-4000-8000-0000000000ad");

	@Autowired
	private PedidoService pedidosService;

	@Autowired
	private UsuarioRepository usuarios;

	@Autowired
	private ProductoRepository productos;

	@AfterEach
	void limpiar() {
		SecurityContextHolder.clearContext();
	}

	@Test
	void listadoGlobalYCancelacionDelAdmin() {
		// 1. Comprador crea un pedido (camino normal del MVP).
		Usuario comprador = usuarios.save(new Usuario(UUID.randomUUID(),
				"comprador-" + UUID.randomUUID() + "@prueba.co", "Comprador de prueba"));
		autenticar(comprador.getId());

		Producto producto = productos.findAll().stream()
				.filter(p -> p.getStock() != null && p.getStock() >= 2)
				.findFirst()
				.orElseThrow();
		int stockInicial = producto.getStock();

		PedidoDtos.PedidoDetalleResponse creado = pedidosService.crear(
				new PedidoDtos.CrearPedidoRequest(
						producto.getNegocio().getId(),
						List.of(new PedidoDtos.LineaRequest(producto.getId(), 2)),
						MetodoEntrega.RECOGER_EN_TIENDA,
						MetodoPago.EFECTIVO_CONTRA_ENTREGA,
						null, null, null, null, null, null));

		assertEquals(EstadoPedido.PEDIDO_RECIBIDO, creado.estado());
		assertEquals(stockInicial - 2,
				productos.findById(producto.getId()).orElseThrow().getStock(),
				"crear descuenta stock");

		// 2. El admin lo ve en el listado global.
		autenticar(ADMIN_ID);
		List<PedidoDtos.PedidoResponse> todos = pedidosService.todos();
		assertTrue(todos.stream().anyMatch(p -> p.id().equals(creado.id())),
				"el pedido creado debe aparecer en /api/admin/pedidos");

		// 3. El admin lo anula: mismo cancelar de siempre, y el
		//    stock vuelve al producto.
		Usuario admin = usuarios.findById(ADMIN_ID).orElseThrow();
		PedidoDtos.PedidoDetalleResponse cancelado =
				pedidosService.cancelar(creado.id(), admin);

		assertEquals(EstadoPedido.CANCELADO, cancelado.estado());
		assertEquals(stockInicial, productos.findById(producto.getId())
				.orElseThrow().getStock(), "cancelar devuelve el stock");
	}

	@Test
	void sinRolAdminNoHayListadoGlobal() {
		autenticar(UUID.randomUUID());
		assertThrows(ApiException.class, pedidosService::todos);
	}

	@Test
	void unCompradorNoAnulaPedidosAjenos() {
		// Pedido existente del sistema (el de la otra prueba o uno
		// nuevo); lo que importa es el actor: nadie mas que el
		// comprador, el dueno o el admin puede anularlo.
		Usuario ajeno = usuarios.save(new Usuario(UUID.randomUUID(),
				"ajeno-" + UUID.randomUUID() + "@prueba.co", "Ajeno"));
		autenticar(ajeno.getId());

		Producto producto = productos.findAll().stream().findFirst().orElseThrow();
		Usuario comprador = usuarios.save(new Usuario(UUID.randomUUID(),
				"otro-" + UUID.randomUUID() + "@prueba.co", "Comprador"));
		autenticar(comprador.getId());

		PedidoDtos.PedidoDetalleResponse pedido = pedidosService.crear(
				new PedidoDtos.CrearPedidoRequest(
						producto.getNegocio().getId(),
						List.of(new PedidoDtos.LineaRequest(producto.getId(), 1)),
						MetodoEntrega.RECOGER_EN_TIENDA,
						MetodoPago.EFECTIVO_CONTRA_ENTREGA,
						null, null, null, null, null, null));

		autenticar(ajeno.getId());
		Usuario actor = usuarios.findById(ajeno.getId()).orElseThrow();
		assertThrows(ApiException.class,
				() -> pedidosService.cancelar(pedido.id(), actor));
	}

	private void autenticar(UUID id) {
		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken(id.toString(), "n/a", List.of()));
	}
}
