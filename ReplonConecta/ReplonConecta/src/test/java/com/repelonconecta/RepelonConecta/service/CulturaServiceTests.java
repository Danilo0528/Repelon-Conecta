package com.repelonconecta.RepelonConecta.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;

import com.repelonconecta.RepelonConecta.dto.CulturaDtos;
import com.repelonconecta.RepelonConecta.repository.CulturaPublicacionRepository;

/**
 * Tests del feed de Cultura.
 *
 * Se prueba el servicio directamente: alta con limpieza de campos, orden
 * del feed (fecha más reciente primero), edición, borrado y validación
 * del medio (foto vs video). Los 403 por rol los cubre el controller.
 */
@SpringBootTest
@ActiveProfiles("test")
class CulturaServiceTests {

	@Autowired
	private CulturaService cultura;

	@Autowired
	private CulturaPublicacionRepository publicaciones;

	@BeforeEach
	void limpiar() {
		publicaciones.deleteAll();
	}

	@Test
	void crearRecortaYConvierteCamposVaciosEnNulo() {
		CulturaDtos.PublicacionResponse creada = cultura.crear(peticion(
				"  Ana  ", "   ", LocalDate.of(2026, 11, 1), "  Texto de la publicación  ",
				"FOTO", "  https://fotos.test/a.jpg  ", "   "));

		assertThat(creada.autor()).isEqualTo("Ana");
		assertThat(creada.lugar()).isNull();
		assertThat(creada.texto()).isEqualTo("Texto de la publicación");
		assertThat(creada.mediaUrl()).isEqualTo("https://fotos.test/a.jpg");
		assertThat(creada.credito()).isNull();
		assertThat(publicaciones.findById(creada.id())).isPresent();
	}

	@Test
	void elFeedOrdenaPorFechaMasRecientePrimero() {
		cultura.crear(peticion("Ana", null, LocalDate.of(2026, 10, 1), "Primera",
				"FOTO", "https://fotos.test/a.jpg", null));
		cultura.crear(peticion("Beto", null, LocalDate.of(2026, 11, 3), "Tercera",
				"FOTO", "https://fotos.test/b.jpg", null));
		cultura.crear(peticion("Carla", null, LocalDate.of(2026, 10, 20), "Segunda",
				"FOTO", "https://fotos.test/c.jpg", null));

		assertThat(cultura.publicaciones())
				.extracting(CulturaDtos.PublicacionResponse::texto)
				.containsExactly("Tercera", "Segunda", "Primera");
	}

	@Test
	void actualizarCambiaLosCamposYConservaElId() {
		CulturaDtos.PublicacionResponse creada = cultura.crear(peticion(
				"Ana", "Plaza", LocalDate.of(2026, 11, 1), "Texto original",
				"FOTO", "https://fotos.test/a.jpg", "Foto: Juan"));

		CulturaDtos.PublicacionResponse actualizada = cultura.actualizar(creada.id(), peticion(
				"Luis", "", LocalDate.of(2026, 11, 2), "Texto nuevo",
				"VIDEO", "dQw4w9WgXcQ", ""));

		assertThat(actualizada.id()).isEqualTo(creada.id());
		assertThat(actualizada.autor()).isEqualTo("Luis");
		assertThat(actualizada.lugar()).isNull();
		assertThat(actualizada.texto()).isEqualTo("Texto nuevo");
		assertThat(actualizada.tipo()).isEqualTo("VIDEO");
		assertThat(actualizada.mediaUrl()).isEqualTo("dQw4w9WgXcQ");
		assertThat(actualizada.credito()).isNull();
		assertThat(publicaciones.findById(creada.id()).orElseThrow().getAutor())
				.isEqualTo("Luis");
	}

	@Test
	void eliminarBorraLaPublicacion() {
		CulturaDtos.PublicacionResponse creada = cultura.crear(peticion(
				"Ana", null, LocalDate.of(2026, 11, 1), "Para borrar",
				"FOTO", "https://fotos.test/a.jpg", null));

		cultura.eliminar(creada.id());

		assertThat(publicaciones.findById(creada.id())).isEmpty();
		assertThat(cultura.publicaciones()).isEmpty();
	}

	@Test
	void actualizarOEliminarUnaPublicacionInexistenteDevuelve404() {
		UUID inexistente = UUID.randomUUID();

		assertThatThrownBy(() -> cultura.actualizar(inexistente, peticion(
				"Ana", null, LocalDate.of(2026, 11, 1), "Texto",
				"FOTO", "https://fotos.test/a.jpg", null)))
				.isInstanceOf(ApiException.class)
				.satisfies(e -> assertThat(((ApiException) e).getStatus())
						.isEqualTo(HttpStatus.NOT_FOUND));

		assertThatThrownBy(() -> cultura.eliminar(inexistente))
				.isInstanceOf(ApiException.class)
				.satisfies(e -> assertThat(((ApiException) e).getStatus())
						.isEqualTo(HttpStatus.NOT_FOUND));
	}

	@Test
	void laFotoAceptaUrlORutaPeroRechazaOtraCosa() {
		CulturaDtos.PublicacionResponse ruta = cultura.crear(peticion(
				"Ana", null, LocalDate.of(2026, 11, 1), "Foto local",
				"FOTO", "/img/cultura/foto.jpg", null));
		assertThat(ruta.mediaUrl()).isEqualTo("/img/cultura/foto.jpg");

		assertThatThrownBy(() -> cultura.crear(peticion(
				"Ana", null, LocalDate.of(2026, 11, 1), "Foto inválida",
				"FOTO", "foto.jpg", null)))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("foto")
				.satisfies(e -> assertThat(((ApiException) e).getStatus())
						.isEqualTo(HttpStatus.BAD_REQUEST));

		// La publicación inválida no llegó a la base.
		assertThat(publicaciones.count()).isEqualTo(1);
	}

	@Test
	void elVideoAceptaUrlOIdDeYouTubePeroRechazaTextoLibre() {
		CulturaDtos.PublicacionResponse directo = cultura.crear(peticion(
				"Ana", null, LocalDate.of(2026, 11, 1), "Video de YouTube",
				"VIDEO", "dQw4w9WgXcQ", null));
		assertThat(directo.mediaUrl()).isEqualTo("dQw4w9WgXcQ");

		CulturaDtos.PublicacionResponse enlace = cultura.crear(peticion(
				"Beto", null, LocalDate.of(2026, 11, 2), "Video enlazado",
				"VIDEO", "https://youtu.be/dQw4w9WgXcQ", null));
		assertThat(enlace.mediaUrl()).isEqualTo("https://youtu.be/dQw4w9WgXcQ");

		assertThatThrownBy(() -> cultura.crear(peticion(
				"Carla", null, LocalDate.of(2026, 11, 3), "Video inválido",
				"VIDEO", "este no es un video", null)))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("video")
				.satisfies(e -> assertThat(((ApiException) e).getStatus())
						.isEqualTo(HttpStatus.BAD_REQUEST));

		assertThat(publicaciones.count()).isEqualTo(2);
	}

	// -----------------------------------------------------------------

	private static CulturaDtos.PublicacionRequest peticion(String autor, String lugar,
			LocalDate fecha, String texto, String tipo, String mediaUrl, String credito) {
		return new CulturaDtos.PublicacionRequest(
				autor, lugar, fecha, texto, tipo, mediaUrl, credito);
	}
}
