package com.repelonconecta.RepelonConecta.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.dto.BusquedaDtos;
import com.repelonconecta.RepelonConecta.entity.Categoria;
import com.repelonconecta.RepelonConecta.entity.Negocio;
import com.repelonconecta.RepelonConecta.entity.Producto;
import com.repelonconecta.RepelonConecta.entity.Rol;
import com.repelonconecta.RepelonConecta.entity.UnidadProducto;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.CategoriaRepository;
import com.repelonconecta.RepelonConecta.repository.NegocioRepository;
import com.repelonconecta.RepelonConecta.repository.ProductoRepository;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;

/**
 * Tests del seam del buscador, contra el esquema real (H2 en modo
 * PostgreSQL) con la semilla puesta: si la siembra o la query se rompen,
 * aqui truena antes de que alguien abra la pantalla.
 */
@SpringBootTest
@ActiveProfiles("test")
class BusquedaServiceTests {

	@Autowired
	private BusquedaService busqueda;

	@Autowired
	private NegocioRepository negocios;

	@Autowired
	private CategoriaRepository categorias;

	@Autowired
	private UsuarioRepository usuarios;

	@Autowired
	private ProductoRepository productos;

	@Test
	void encuentraYucaConUnidadYNegocio() {
		List<BusquedaDtos.ResultadoBusquedaResponse> resultados = busqueda.buscar("yuca", null, null);

		assertThat(resultados).hasSize(1);
		BusquedaDtos.ResultadoBusquedaResponse yuca = resultados.get(0);
		assertThat(yuca.productoNombre()).isEqualTo("Yuca");
		assertThat(yuca.precio()).isEqualTo(2500);
		assertThat(yuca.unidad()).isEqualTo(UnidadProducto.KILO);
		assertThat(yuca.negocioNombre()).isEqualTo("Agro Repelón");
		assertThat(yuca.barrio()).isEqualTo("Vereda Rotinet");
		assertThat(yuca.direccion()).isNotBlank();
		assertThat(yuca.abierto()).isTrue();
		assertThat(yuca.whatsapp()).isNotBlank();
		assertThat(yuca.latitud()).isNotNull();
		assertThat(yuca.longitud()).isNotNull();
		assertThat(yuca.categoriaNombre()).isEqualTo("Agro");
	}

	@Test
	void ignoraNumerosYUnidadesDeLaConsulta() {
		List<BusquedaDtos.ResultadoBusquedaResponse> conNumeros = busqueda.buscar("20 kilos de yuca", null, null);
		List<BusquedaDtos.ResultadoBusquedaResponse> soloTexto = busqueda.buscar("yuca", null, null);

		assertThat(conNumeros).hasSize(1);
		assertThat(conNumeros.get(0).productoId()).isEqualTo(soloTexto.get(0).productoId());
	}

	@Test
	void todosLosTokensTienenQueAparecer() {
		// "yuca mango" no existe: ningun producto contiene las dos cosas.
		assertThat(busqueda.buscar("yuca mango", null, null)).isEmpty();
	}

	@Test
	void noDevuelveRubrosFueraDeAlcance() {
		// Turismo existe como categoria pero no tiene productos con
		// precio: la puerta del buscador no se abre para ella.
		assertThat(busqueda.buscar(null, "turismo", null)).isEmpty();
		// Un rubro fuera del acuerdo (ferreteria) tampoco entra, aunque
		// la base lo tuviera cargado.
		assertThat(busqueda.buscar(null, "ferreteria", null)).isEmpty();
		assertThat(busqueda.buscar("cemento", null, null)).isEmpty();
	}

	@Test
	void categoriaFueraDelAlcanceDevuelveVacio() {
		assertThat(busqueda.buscar(null, "ferreteria", null)).isEmpty();

		List<BusquedaDtos.ResultadoBusquedaResponse> agro = busqueda.buscar(null, "agro", null);
		assertThat(agro).isNotEmpty();
		assertThat(agro).allSatisfy(resultado -> assertThat(resultado.categoriaNombre()).isEqualTo("Agro"));
	}

	@Test
	void barrioAcotaLosResultados() {
		assertThat(busqueda.buscar(null, null, "Vereda Rotinet")).hasSize(5);

		// El Carmen tiene la pescadería de la semilla: sus 3 productos.
		assertThat(busqueda.buscar(null, null, "El Carmen")).hasSize(3);

		// Centro no tiene negocios del alcance en la semilla: vacio.
		assertThat(busqueda.buscar(null, null, "Centro")).isEmpty();

		assertThat(busqueda.buscar(null, null, "Barrio Inexistente")).isEmpty();
	}

	@Test
	void consultaVaciaDevuelveTodoElAlcance() {
		List<BusquedaDtos.ResultadoBusquedaResponse> todo = busqueda.buscar(null, null, null);

		assertThat(todo).hasSize(8);
		assertThat(todo).allSatisfy(resultado -> {
			assertThat(resultado.categoriaNombre()).isIn("Agro", "Pesca");
			assertThat(resultado.unidad()).isNotNull();
		});
	}

	@Test
	void semillaTraeLasUnidadesCorrectas() {
		List<BusquedaDtos.ResultadoBusquedaResponse> todo = busqueda.buscar(null, null, null);

		assertThat(todo)
				.extracting(BusquedaDtos.ResultadoBusquedaResponse::productoNombre,
						BusquedaDtos.ResultadoBusquedaResponse::unidad)
				.containsExactlyInAnyOrder(
						org.assertj.core.groups.Tuple.tuple("Yuca", UnidadProducto.KILO),
						org.assertj.core.groups.Tuple.tuple("Mango de azúcar", UnidadProducto.KILO),
						org.assertj.core.groups.Tuple.tuple("Aguacate", UnidadProducto.KILO),
						org.assertj.core.groups.Tuple.tuple("Frijol rojo", UnidadProducto.LIBRA),
						org.assertj.core.groups.Tuple.tuple("Coco", UnidadProducto.KILO),
						org.assertj.core.groups.Tuple.tuple("Pargo rojo", UnidadProducto.KILO),
						org.assertj.core.groups.Tuple.tuple("Mojarra", UnidadProducto.KILO),
						org.assertj.core.groups.Tuple.tuple("Camarón", UnidadProducto.LIBRA));
	}

	@Test
	@Transactional
	void excluyeNegociosNoAprobados() {
		// Un negocio recien creado por un vendedor que nadie ha revisado:
		// no puede salir en el buscador publico hasta que un admin lo apruebe.
		Categoria agro = categorias.findBySlug("agro").orElseThrow();

		Usuario dueno = new Usuario(UUID.randomUUID(),
				"pendiente-" + UUID.randomUUID() + "@repelon.test",
				"Vendedor pendiente");
		dueno.setRol(Rol.VENDEDOR);
		dueno = usuarios.save(dueno);

		Negocio pendiente = new Negocio(dueno, "Vivero Pendiente",
				"vivero-pendiente-" + UUID.randomUUID(), "Calle 1 # 2-3", "Centro");
		pendiente.setAprobado(false);
		pendiente.tocar();
		pendiente = negocios.save(pendiente);

		Producto yucaPendiente = new Producto(pendiente, agro, "Yuca de prueba", 2000);
		yucaPendiente.setUnidad(UnidadProducto.KILO);
		yucaPendiente.setDisponible(true);
		productos.save(yucaPendiente);

		// "yuca" solo trae la aprobada de la semilla (con @Transactional el
		// cambio se ve dentro de esta misma transaccion).
		List<BusquedaDtos.ResultadoBusquedaResponse> resultados = busqueda.buscar("yuca", null, null);
		assertThat(resultados).hasSize(1);
		assertThat(resultados.get(0).negocioNombre()).isEqualTo("Agro Repelón");

		// Tampoco aparece en el listado completo sin filtro.
		assertThat(busqueda.buscar(null, null, null))
				.extracting(BusquedaDtos.ResultadoBusquedaResponse::negocioId)
				.doesNotContain(pendiente.getId());
	}

	// -----------------------------------------------------------------
	// tokens(): la limpieza de la consulta, sin levantar la base.
	// -----------------------------------------------------------------

	@Test
	void tokensQuitanNumerosYPalabrasVacias() {
		assertThat(BusquedaService.tokens("20 kilos de yuca")).containsExactly("yuca");
		assertThat(BusquedaService.tokens("1 libra de frijol rojo")).containsExactly("frijol", "rojo");
		assertThat(BusquedaService.tokens("  YUCA  ")).containsExactly("yuca");
		assertThat(BusquedaService.tokens(null)).isEmpty();
		assertThat(BusquedaService.tokens("   ")).isEmpty();
		assertThat(BusquedaService.tokens("de la los")).isEmpty();
	}
}
