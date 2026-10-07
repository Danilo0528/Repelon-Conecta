package com.repelonconecta.RepelonConecta.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.dto.NegocioDtos;
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
 * Tests del alcance del catalogo publico (ticket 04).
 *
 * Dos reglas viven aqui porque son las que el cliente confirmo por
 * escrito: la semilla solo siembra las tres familias del proyecto, y el
 * listado de negocios oculta los rubros que quedaron fuera (con la
 * misma definicion, Alcance.FAMILIAS, que usa el backend entero).
 */
@SpringBootTest
@ActiveProfiles("test")
class AlcanceCatalogoTests {

	@Autowired
	private CategoriaRepository categorias;

	@Autowired
	private NegocioRepository negocios;

	@Autowired
	private ProductoRepository productos;

	@Autowired
	private UsuarioRepository usuarios;

	@Autowired
	private NegocioService negocioService;

	@Autowired
	private BusquedaService busqueda;

	@Test
	void laSemillaSoloTraeLasTresFamilias() {
		assertThat(categorias.findAll())
				.extracting(Categoria::getSlug)
				.containsExactlyInAnyOrder("agro", "pesca", "turismo");
	}

	@Test
	void todoProductoDelCatalogoTieneUnidad() {
		assertThat(productos.findAll())
				.isNotEmpty()
				.allSatisfy(producto -> assertThat(producto.getUnidad()).isNotNull());
	}

	@Test
	@Transactional
	void elListadoPublicoOcultaLosRubrosFueraDeAlcance() {
		// Un negocio de ferreteria: aunque tambien tenga un producto del
		// alcance, el rubro recortado lo oculta entero.
		Categoria ferreteria = categorias.save(
				new Categoria("Ferretería", "ferreteria", "ferreteria", 9));
		Categoria agro = categorias.findBySlug("agro").orElseThrow();

		Negocio fuera = negocioDePrueba("Ferretería de Prueba", "ferreteria-de-prueba");
		producto(fuera, ferreteria, "Cemento", 32000);
		producto(fuera, agro, "Semilla de maíz", 2000);

		// Un negocio sin productos (ficha de turismo): no hay nada fuera
		// de alcance que ocultar, asi que es visible.
		Negocio vacio = negocioDePrueba("Turismo Guájaro", "turismo-guajaro");

		// Un negocio con producto de categoria null: tambien visible.
		Negocio sinCategoria = negocioDePrueba("Comercial Sin Categoría", "sin-categoria");
		producto(sinCategoria, null, "Algo del pueblo", 1500);

		List<String> slugs = negocioService.buscar(null, null, null, null).stream()
				.map(NegocioDtos.NegocioResponse::slug)
				.toList();

		assertThat(slugs)
				.doesNotContain(fuera.getSlug())
				.contains(vacio.getSlug(), sinCategoria.getSlug(), "agro-repelon",
						"pescaderia-la-barra");

		// El buscador de productos tampoco ve el rubro oculto.
		assertThat(busqueda.buscar("cemento", null, null)).isEmpty();
	}

	// -----------------------------------------------------------------
	// Helpers de prueba
	// -----------------------------------------------------------------

	private Negocio negocioDePrueba(String nombre, String prefijoSlug) {
		Usuario dueno = new Usuario(UUID.randomUUID(),
				prefijoSlug + "-" + UUID.randomUUID() + "@repelon.test",
				"Dueño de " + nombre);
		dueno.setRol(Rol.VENDEDOR);
		dueno = usuarios.save(dueno);

		Negocio negocio = new Negocio(dueno, nombre,
				prefijoSlug + "-" + UUID.randomUUID(), "Calle 1 # 2-3", "Centro");
		negocio.setAprobado(true);
		negocio.setAbierto(true);
		negocio.tocar();
		return negocios.save(negocio);
	}

	private Producto producto(Negocio negocio, Categoria categoria, String nombre, long precio) {
		Producto producto = new Producto(negocio, categoria, nombre, precio);
		producto.setUnidad(UnidadProducto.KILO);
		producto.setDisponible(true);
		producto.tocar();
		return productos.save(producto);
	}
}
