package com.repelonconecta.RepelonConecta.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import com.repelonconecta.RepelonConecta.dto.NegocioDtos;
import com.repelonconecta.RepelonConecta.entity.Rol;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;

/**
 * Tests de la galería de fotos del negocio: las imágenes que se deslizan
 * en /negocios/{slug} y que el panel admin cambia por archivo o por URL.
 *
 * Se recorren los métodos del servicio con sesión puesta, así que la
 * seguridad (solo el dueño o el admin) queda cubierta de paso.
 */
@SpringBootTest
@ActiveProfiles("test")
class NegocioGaleriaTests {

	@Autowired
	private NegocioService negocios;

	@Autowired
	private UsuarioRepository usuarios;

	@AfterEach
	void limpiar() {
		SecurityContextHolder.clearContext();
	}

	@Test
	void guardaLaGaleriaEnOrdenYLaDevuelveEnElDetalle() {
		NegocioDtos.NegocioDetalleResponse creado = negocioDePrueba();

		NegocioDtos.NegocioDetalleResponse actualizado = negocios.actualizar(
				creado.id(), soloGaleria(List.of(
						"https://fotos.test/a.jpg",
						"https://fotos.test/b.jpg")));

		assertThat(actualizado.imagenes())
				.containsExactly("https://fotos.test/a.jpg", "https://fotos.test/b.jpg");

		// Lo que ve un visitante sin sesión: el orden tiene que aguantar
		// el viaje ida y vuelta por la columna JSON.
		SecurityContextHolder.clearContext();
		assertThat(negocios.detallePorSlug(creado.slug()).imagenes())
				.containsExactly("https://fotos.test/a.jpg", "https://fotos.test/b.jpg");
	}

	@Test
	void listaVaciaBorraTodasLasFotos() {
		NegocioDtos.NegocioDetalleResponse creado = negocioDePrueba();
		negocios.actualizar(creado.id(), soloGaleria(List.of("https://fotos.test/a.jpg")));

		NegocioDtos.NegocioDetalleResponse vaciado =
				negocios.actualizar(creado.id(), soloGaleria(List.of()));

		assertThat(vaciado.imagenes()).isEmpty();
		assertThat(negocios.detallePorSlug(creado.slug()).imagenes()).isEmpty();
	}

	@Test
	void sinImagenesNoTocaLaGaleria() {
		NegocioDtos.NegocioDetalleResponse creado = negocioDePrueba();
		negocios.actualizar(creado.id(), soloGaleria(List.of("https://fotos.test/a.jpg")));

		// Un PUT parcial (el de los datos del negocio) no debe borrar las
		// fotos: `imagenes` en null significa "no vengo a tocar eso".
		NegocioDtos.NegocioDetalleResponse sinGaleria =
				negocios.actualizar(creado.id(), soloGaleria(null));

		assertThat(sinGaleria.imagenes()).containsExactly("https://fotos.test/a.jpg");
	}

	@Test
	void recortaQuitaHuecosYRepetidas() {
		NegocioDtos.NegocioDetalleResponse creado = negocioDePrueba();

		NegocioDtos.NegocioDetalleResponse actualizado = negocios.actualizar(
				creado.id(), soloGaleria(List.of(
						"  https://fotos.test/a.jpg  ",
						"",
						"https://fotos.test/a.jpg",
						"https://fotos.test/b.jpg")));

		assertThat(actualizado.imagenes())
				.containsExactly("https://fotos.test/a.jpg", "https://fotos.test/b.jpg");
	}

	@Test
	void aceptaRutaRelativaPeroRechazaOtrosEsquemas() {
		NegocioDtos.NegocioDetalleResponse creado = negocioDePrueba();

		assertThat(negocios.actualizar(creado.id(), soloGaleria(List.of("/img/tienda.jpg")))
				.imagenes()).containsExactly("/img/tienda.jpg");

		// Un enlace que no sea http(s) ni ruta local no puede llegar a la
		// base: acabaría pintado en la ficha pública.
		assertThatThrownBy(() -> negocios.actualizar(
				creado.id(), soloGaleria(List.of("javascript:alert(1)"))))
				.isInstanceOf(ApiException.class);
		assertThat(negocios.detallePorSlug(creado.slug()).imagenes())
				.containsExactly("/img/tienda.jpg");
	}

	@Test
	void elDuenoDeOtroNegocioNoPuedeCambiarla() {
		NegocioDtos.NegocioDetalleResponse ajeno = negocioDePrueba();

		Usuario intruso = usuarios.save(new Usuario(UUID.randomUUID(),
				"intruso-" + UUID.randomUUID() + "@prueba.co", "Intruso"));
		intruso.setRol(Rol.VENDEDOR);
		autenticar(intruso.getId());

		assertThatThrownBy(() -> negocios.actualizar(ajeno.id(),
				soloGaleria(List.of("https://fotos.test/hack.jpg"))))
				.isInstanceOf(ApiException.class);
		assertThat(negocios.detallePorSlug(ajeno.slug()).imagenes()).isEmpty();
	}

	@Test
	void negocioSinGaleriaDevuelveListaVacia() {
		NegocioDtos.NegocioDetalleResponse creado = negocioDePrueba();

		assertThat(creado.imagenes()).isEmpty();
	}

	// -----------------------------------------------------------------

	/** Negocio propio, registrado por el camino normal de la app. */
	private NegocioDtos.NegocioDetalleResponse negocioDePrueba() {
		Usuario dueno = usuarios.save(new Usuario(UUID.randomUUID(),
				"dueno-" + UUID.randomUUID() + "@prueba.co", "Dueño de prueba"));
		dueno.setRol(Rol.VENDEDOR);
		autenticar(dueno.getId());

		return negocios.registrar(new NegocioDtos.RegistroNegocioRequest(
				"Galería de prueba " + UUID.randomUUID(),
				"Panadería del barrio",
				"Calle 1 # 2-3",
				"Centro",
				null, null, null, null, null, null));
	}

	/** Único campo informado: la galería. El resto llega en null. */
	private static NegocioDtos.NegocioUpdateRequest soloGaleria(List<String> imagenes) {
		return new NegocioDtos.NegocioUpdateRequest(
				null, null, null, null, null, null, null, null, null, null, null,
				imagenes, null);
	}

	private void autenticar(UUID id) {
		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken(id.toString(), "n/a", List.of()));
	}
}
