package com.repelonconecta.RepelonConecta.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import com.repelonconecta.RepelonConecta.dto.NegocioDtos;
import com.repelonconecta.RepelonConecta.entity.Negocio;
import com.repelonconecta.RepelonConecta.entity.Rol;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.NegocioRepository;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;

/**
 * Tests del ciclo de vida del negocio: alta, buscador público, edición
 * parcial, coordenadas, visibilidad de pendientes y estado abierto.
 *
 * La galería de fotos y el control de acceso al negocio ajeno ya tienen
 * su propio archivo (NegocioGaleriaTests); aquí se cubre el resto del
 * servicio sin duplicar esos casos.
 */
@SpringBootTest
@ActiveProfiles("test")
class NegocioServiceTests {

	/** Admin del seed: existe aunque la base ya tenga datos. */
	private static final UUID ADMIN_ID =
			UUID.fromString("00000000-0000-4000-8000-0000000000ad");

	@Autowired
	private NegocioService negocios;

	@Autowired
	private NegocioRepository negocioRepo;

	@Autowired
	private UsuarioRepository usuarios;

	@AfterEach
	void limpiar() {
		SecurityContextHolder.clearContext();
	}

	@Test
	void registrarHaceVendedorAlCompradorYDejaElNegocioVisible() {
		Usuario comprador = usuario("Comprador");
		autenticar(comprador.getId());

		String sufijo = sufijo();
		String nombre = "Panadería " + sufijo;
		NegocioDtos.NegocioDetalleResponse creado = registrar(nombre, "Calle 1 # 2-3",
				"Centro " + sufijo);

		assertThat(creado.aprobado()).isTrue();
		assertThat(creado.abierto()).isTrue();
		assertThat(creado.soyDueno()).isTrue();
		assertThat(creado.slug()).isNotBlank();
		assertThat(usuarios.findById(comprador.getId()).orElseThrow().getRol())
				.isEqualTo(Rol.VENDEDOR);

		// Un visitante sin sesión ve la ficha, pero no como dueño.
		SecurityContextHolder.clearContext();
		NegocioDtos.NegocioDetalleResponse publico =
				negocios.detallePorSlug(creado.slug());
		assertThat(publico.soyDueno()).isFalse();
		assertThat(nombres(negocios.buscar(sufijo, null, null, null))).contains(nombre);
	}

	@Test
	void buscarCombinaTextoBarrioYAbierto() {
		Usuario dueno = usuario("Dueño");
		autenticar(dueno.getId());

		String sufijo = sufijo();
		String barrioAbierto = "Centro " + sufijo;
		String barrioCerrado = "Playa " + sufijo;
		String trigal = "Trigal " + sufijo;
		String ola = "Pescadería Ola " + sufijo;

		registrar(trigal, "Calle 1", barrioAbierto);
		NegocioDtos.NegocioDetalleResponse cerrado = registrar(ola, "Calle 2", barrioCerrado);
		negocios.cambiarEstadoAbierto(cerrado.id(), false);

		assertThat(nombres(negocios.buscar(sufijo, null, null, null)))
				.containsExactlyInAnyOrder(trigal, ola);
		assertThat(nombres(negocios.buscar("trigal " + sufijo, null, null, null)))
				.containsExactly(trigal);
		assertThat(nombres(negocios.buscar(null, barrioCerrado, null, null)))
				.containsExactly(ola);
		assertThat(nombres(negocios.buscar(sufijo, null, true, null)))
				.containsExactly(trigal);
		assertThat(nombres(negocios.buscar(sufijo, null, false, null)))
				.containsExactly(ola);
	}

	@Test
	void actualizarSoloCambiaLosCamposInformados() {
		Usuario dueno = usuario("Vendedor");
		autenticar(dueno.getId());

		String sufijo = sufijo();
		String nombreOriginal = "Tienda " + sufijo;
		String nombreNuevo = "Tienda renovada " + sufijo;
		String barrio = "Centro " + sufijo;
		NegocioDtos.NegocioDetalleResponse creado =
				registrar(nombreOriginal, "Calle 3 # 4-5", barrio);

		NegocioDtos.NegocioDetalleResponse cambiado = negocios.actualizar(
				creado.id(), new NegocioDtos.NegocioUpdateRequest(
						nombreNuevo, null, null, null, null, null, null,
						"300 111 2233", "300 444 5566", null, null, null, null, null, null));

		assertThat(cambiado.nombre()).isEqualTo(nombreNuevo);
		assertThat(cambiado.telefono()).isEqualTo("300 111 2233");
		assertThat(cambiado.whatsapp()).isEqualTo("573004445566");
		assertThat(cambiado.direccion()).isEqualTo("Calle 3 # 4-5");
		assertThat(cambiado.barrio()).isEqualTo(barrio);
		assertThat(cambiado.descripcion()).isEqualTo("Descripción de " + nombreOriginal);
		assertThat(cambiado.abierto()).isTrue();
		// El slug es estable: cambiar el nombre no rompe los enlaces ya
		// compartidos por WhatsApp.
		assertThat(cambiado.slug()).isEqualTo(creado.slug());
	}

	@Test
	void actualizarRechazaCoordenadasIncompletasOFueraDeRango() {
		Usuario dueno = usuario("Vendedor");
		autenticar(dueno.getId());
		NegocioDtos.NegocioDetalleResponse creado =
				registrar("Tienda " + sufijo(), "Calle 6", "Centro " + sufijo());

		// Solo latitud: dejaría un marcador sin sentido en el mapa.
		assertThatThrownBy(() -> negocios.actualizar(creado.id(),
				conCoordenadas(10.5, null)))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("juntas")
				.satisfies(e -> assertThat(((ApiException) e).getStatus())
						.isEqualTo(HttpStatus.BAD_REQUEST));

		assertThatThrownBy(() -> negocios.actualizar(creado.id(),
				conCoordenadas(100.0, -75.0)))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("latitud")
				.satisfies(e -> assertThat(((ApiException) e).getStatus())
						.isEqualTo(HttpStatus.BAD_REQUEST));

		assertThat(negocios.detallePorSlug(creado.slug()).latitud()).isNull();
		assertThat(negocios.detallePorSlug(creado.slug()).longitud()).isNull();
	}

	@Test
	void actualizarRechazaDejarElTelefonoEnBlanco() {
		Usuario dueno = usuario("Vendedor");
		autenticar(dueno.getId());
		NegocioDtos.NegocioDetalleResponse creado =
				registrar("Tienda " + sufijo(), "Calle 10", "Centro " + sufijo());

		NegocioDtos.NegocioDetalleResponse conTelefono = negocios.actualizar(
				creado.id(), conTelefono("300 123 4567"));
		assertThat(conTelefono.telefono()).isEqualTo("300 123 4567");

		// Un PUT parcial no puede borrar el teléfono: el perfil público lo
		// necesita para que el cliente llame al negocio.
		assertThatThrownBy(() -> negocios.actualizar(creado.id(), conTelefono("   ")))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("obligatorio")
				.satisfies(e -> assertThat(((ApiException) e).getStatus())
						.isEqualTo(HttpStatus.BAD_REQUEST));

		assertThat(negocios.detallePorSlug(creado.slug()).telefono())
				.isEqualTo("300 123 4567");
	}

	@Test
	void unNegocioPendienteSoloLoVenSuDuenoYElAdmin() {
		Usuario dueno = usuario("Dueño");
		autenticar(dueno.getId());

		String sufijo = sufijo();
		String nombre = "Pendiente " + sufijo;
		NegocioDtos.NegocioDetalleResponse creado =
				registrar(nombre, "Calle 7", "Centro " + sufijo);

		Negocio entidad = negocioRepo.findById(creado.id()).orElseThrow();
		entidad.setAprobado(false);
		negocioRepo.save(entidad);

		// Visitante anónimo: no puede adivinar la URL.
		SecurityContextHolder.clearContext();
		assertThatThrownBy(() -> negocios.detallePorSlug(creado.slug()))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("no encontrado")
				.satisfies(e -> assertThat(((ApiException) e).getStatus())
						.isEqualTo(HttpStatus.NOT_FOUND));
		assertThat(nombres(negocios.buscar(sufijo, null, null, null)))
				.doesNotContain(nombre);

		// El dueño sí lo ve, marcado como suyo.
		autenticar(dueno.getId());
		NegocioDtos.NegocioDetalleResponse comoDueno =
				negocios.detallePorSlug(creado.slug());
		assertThat(comoDueno.aprobado()).isFalse();
		assertThat(comoDueno.soyDueno()).isTrue();

		// El admin también, pero sin ser dueño.
		autenticar(ADMIN_ID);
		NegocioDtos.NegocioDetalleResponse comoAdmin =
				negocios.detallePorSlug(creado.slug());
		assertThat(comoAdmin.aprobado()).isFalse();
		assertThat(comoAdmin.soyDueno()).isFalse();
	}

	@Test
	void miNegocioYElInterruptorDeAbierto() {
		Usuario dueno = usuario("Vendedor");
		autenticar(dueno.getId());
		NegocioDtos.NegocioDetalleResponse creado =
				registrar("Tienda " + sufijo(), "Calle 8", "Centro " + sufijo());

		Usuario guardado = usuarios.findById(dueno.getId()).orElseThrow();
		assertThat(negocios.miNegocio(guardado).getId()).isEqualTo(creado.id());
		assertThat(negocios.misNegocios(guardado))
				.extracting(NegocioDtos.NegocioResponse::id)
				.containsExactly(creado.id());

		NegocioDtos.NegocioDetalleResponse cerrado =
				negocios.cambiarEstadoAbierto(creado.id(), false);
		assertThat(cerrado.abierto()).isFalse();
		assertThat(negocios.detallePorSlug(creado.slug()).abierto()).isFalse();
	}

	@Test
	void sinSesionNoSePuedeRegistrarUnNegocio() {
		SecurityContextHolder.clearContext();

		assertThatThrownBy(() -> registrar("Tienda " + sufijo(), "Calle 9",
				"Centro"))
				.isInstanceOf(ApiException.class)
				.satisfies(e -> assertThat(((ApiException) e).getStatus())
						.isEqualTo(HttpStatus.UNAUTHORIZED));
	}

	// -----------------------------------------------------------------

	private NegocioDtos.NegocioDetalleResponse registrar(String nombre, String direccion,
			String barrio) {
		return negocios.registrar(new NegocioDtos.RegistroNegocioRequest(
				nombre,
				"Descripción de " + nombre,
				direccion,
				barrio,
				null, null, null, null, null, null));
	}

	/** Único campo informado: el par de coordenadas. */
	private static NegocioDtos.NegocioUpdateRequest conCoordenadas(Double latitud,
			Double longitud) {
		return new NegocioDtos.NegocioUpdateRequest(
				null, null, null, null, latitud, longitud,
				null, null, null, null, null, null, null, null, null);
	}

	/** Único campo informado: el teléfono del negocio. */
	private static NegocioDtos.NegocioUpdateRequest conTelefono(String telefono) {
		return new NegocioDtos.NegocioUpdateRequest(
				null, null, null, null, null, null, null,
				telefono, null, null, null, null, null, null, null);
	}

	private Usuario usuario(String etiqueta) {
		return usuarios.save(new Usuario(UUID.randomUUID(),
				etiqueta.toLowerCase() + "-" + UUID.randomUUID() + "@prueba.co",
				etiqueta));
	}

	private static String sufijo() {
		return UUID.randomUUID().toString().substring(0, 8);
	}

	private static List<String> nombres(List<NegocioDtos.NegocioResponse> lista) {
		return lista.stream().map(NegocioDtos.NegocioResponse::nombre).toList();
	}

	private void autenticar(UUID id) {
		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken(id.toString(), "n/a", List.of()));
	}
}
