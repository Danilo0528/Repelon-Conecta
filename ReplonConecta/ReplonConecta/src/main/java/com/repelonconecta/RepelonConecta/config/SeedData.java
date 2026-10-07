package com.repelonconecta.RepelonConecta.config;

import java.text.Normalizer;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.entity.Categoria;
import com.repelonconecta.RepelonConecta.entity.Negocio;
import com.repelonconecta.RepelonConecta.entity.Producto;
import com.repelonconecta.RepelonConecta.entity.Rol;
import com.repelonconecta.RepelonConecta.entity.UnidadProducto;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.entity.ZonaTuristica;
import com.repelonconecta.RepelonConecta.repository.CategoriaRepository;
import com.repelonconecta.RepelonConecta.repository.NegocioRepository;
import com.repelonconecta.RepelonConecta.repository.ProductoRepository;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;
import com.repelonconecta.RepelonConecta.repository.ZonaTuristicaRepository;

/**
 * Datos de ejemplo para que la app no arranque vacia.
 *
 * Corre solo cuando app.seed.activo=true Y la base no tiene categorias
 * todavia. Es idempotente a proposito: reiniciar el backend no duplica
 * negocios ni productos.
 *
 * La siembra respeta el alcance del proyecto (Alcance.FAMILIAS): solo
 * nacen las tres familias (agro, pesca y turismo) y los negocios de
 * ejemplo son de agro y pesca; turismo no lleva precios, asi que sus
 * fichas vive en el frontend. Rubros como panaderias o ferreterias no
 * se siembran: quedaron fuera del acuerdo con el cliente.
 *
 * ADVERTENCIA sobre los duenos sembrados: se crean con UUID sinteticos
 * porque un Usuario normal necesita una cuenta real en Supabase. Los
 * duenos del seed NO pueden iniciar sesion; sirven para que el catalogo
 * publico tenga vida. Para probar el flujo de vendedor de verdad, la
 * persona se registra en la app y crea su propio negocio desde el panel.
 */
@Component
public class SeedData implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(SeedData.class);

	@Value("${app.seed.activo:false}")
	private boolean activo;

	private final CategoriaRepository categorias;
	private final NegocioRepository negocios;
	private final ProductoRepository productos;
	private final UsuarioRepository usuarios;
	private final ZonaTuristicaRepository zonas;

	public SeedData(CategoriaRepository categorias, NegocioRepository negocios,
			ProductoRepository productos, UsuarioRepository usuarios,
			ZonaTuristicaRepository zonas) {
		this.categorias = categorias;
		this.negocios = negocios;
		this.productos = productos;
		this.usuarios = usuarios;
		this.zonas = zonas;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (!activo) {
			return;
		}

		// El admin del seed va ANTES del guard de "ya hay datos": es
		// idempotente por UUID y una base con negocios pero sin admin
		// igual lo necesita para arrancar el panel.
		sembrarAdmin();

		// Las zonas turisticas tambien van antes del guard: una base ya
		// sembrada igual las necesita para que el home no salga vacio, y
		// el conteo de adentro hace la siembra idempotente.
		sembrarZonas();

		if (categorias.count() > 0 || negocios.count() > 0) {
			log.info("Seed omitido: la base ya tiene datos.");
			return;
		}

		log.info("Sembrando negocios de ejemplo de Repelon...");

		Map<String, Categoria> cat = sembrarCategorias();

		// ---- 1. Agro ------------------------------------------------
		Negocio agro = negocio("Agro Repelón", "Vereda Rotinet, km 3", "Vereda Rotinet",
				UUID.fromString("11111111-1111-1111-1111-111111111105"), "573001111005",
				"Productos del campo de la región: frutas, verduras y granos "
						+ "directo del productor. Entregas en el casco urbano.");
		ubicar(agro, 10.5050, -75.1350, "A la salida hacia Rotinet");

		producto(agro, cat.get("agro"), "Yuca", UnidadProducto.KILO, 2500, 100,
				"Yuca fresca de la región. Precio por kilo.");
		producto(agro, cat.get("agro"), "Mango de azúcar", UnidadProducto.KILO, 8000, 50,
				"Mango dulce de la zona. Precio por kilo.");
		producto(agro, cat.get("agro"), "Aguacate", UnidadProducto.KILO, 6000, 40,
				"Aguacate criollo. Precio por kilo.");
		producto(agro, cat.get("agro"), "Frijol rojo", UnidadProducto.LIBRA, 7500, 60,
				"Frijol rojo seleccionado. Precio por libra.");
		producto(agro, cat.get("agro"), "Coco", UnidadProducto.KILO, 3000, 80,
				"Coco fresco. Precio por kilo.");

		// ---- 2. Pesca -----------------------------------------------
		Negocio pesca = negocio("Pescadería La Barra", "Calle 10 # 3-18", "El Carmen",
				UUID.fromString("11111111-1111-1111-1111-111111111106"), "573001111006",
				"Pescado y mariscos frescos del día, directo del embarcadero. "
						+ "Entregas en el casco urbano.");
		ubicar(pesca, 10.4955, -75.1210, "Vía al embarcadero del Guájaro");

		producto(pesca, cat.get("pesca"), "Pargo rojo", UnidadProducto.KILO, 14000, 25,
				"Pargo fresco del día. Precio por kilo.");
		producto(pesca, cat.get("pesca"), "Mojarra", UnidadProducto.KILO, 7000, 40,
				"Mojarra fresca del Guájaro. Precio por kilo.");
		producto(pesca, cat.get("pesca"), "Camarón", UnidadProducto.LIBRA, 22000, 15,
				"Camarón de la zona. Precio por libra.");

		log.info("Seed completo: {} negocios, {} productos, {} categorias.",
				negocios.count(), productos.count(), categorias.count());
		log.info("Los negocios sembrados no tienen cuenta en Supabase: sirven para ver "
				+ "el catalogo. Para probar el flujo de vendedor, registrate en la app "
				+ "y crea tu propio negocio.");
	}

	/**
	 * La cuenta administradora del entorno de pruebas.
	 *
	 * UUID sintetico, igual que los duenos del seed: no existe en
	 * Supabase Auth, asi que nadie puede iniciar sesion con ella. Su
	 * proposito es que el backend de desarrollo (perfil test, secreto
	 * HS256 de mentira) tenga un rol ADMIN con el cual verificar el
	 * panel completo; en produccion el rol se da con SQL a una cuenta
	 * real. Como el token exige la firma del secreto, un rol de mentira
	 * firmado con un secreto de mentira no sirve para nada afuera.
	 */
	private void sembrarAdmin() {
		UUID adminId = UUID.fromString("00000000-0000-4000-8000-0000000000ad");

		usuarios.findById(adminId).orElseGet(() -> {
			Usuario nuevo = new Usuario(adminId, "admin@repelonmarket.demo",
					"Estudiante admin");
			nuevo.setRol(Rol.ADMIN);
			return usuarios.save(nuevo);
		});
	}

	/**
	 * Las seis zonas turisticas del home: las mismas que vivian en el
	 * frontend (src/lib/turismo.ts). Si ya hay zonas no se toca nada:
	 * despues de esta siembra las maneja el panel /admin.
	 */
	private void sembrarZonas() {
		if (zonas.count() > 0) {
			return;
		}

		zona("Embalse del Guájaro",
				"El espejo de agua del pueblo: paisaje, pesca artesanal y aves a orillas de Repelón.",
				"Vía al embalse del Guájaro, oriente de Repelón, Atlántico", "agua", 0);
		zona("Caleta de pescadores",
				"Donde los pescadores desembarcan el día: pescado fresco y canoas sobre el agua.",
				"Embarcadero de pescadores, embalse del Guájaro, Repelón, Atlántico", "barco", 1);
		zona("Avistamiento de aves",
				"Humedales y ciénagas llenas de aves residentes y migrantes, sobre todo al amanecer.",
				"Humedales del embalse del Guájaro, Repelón, Atlántico", "aves", 2);
		zona("Banco Totumo Bijibana",
				"Experiencia de reconexión con la naturaleza, impulsada por la alcaldía junto al FOMINDETER.",
				"Bijibana, Repelón, Atlántico", "naturaleza", 3);
		zona("Parque principal",
				"El centro del pueblo: la plaza, las palmeras y el punto de encuentro de todos los días.",
				"Parque principal, Centro, Repelón, Atlántico", "parque", 4);
		zona("Villa Rosa y San Roque",
				"El corregimiento de Villa Rosa y sus fiestas patronales en honor a San Roque.",
				"Villa Rosa, Repelón, Atlántico", "pueblo", 5);
	}

	private void zona(String nombre, String descripcion, String direccion, String motivo,
			int orden) {
		ZonaTuristica zona = new ZonaTuristica();
		zona.setNombre(nombre);
		zona.setDescripcion(descripcion);
		zona.setDireccion(direccion);
		zona.setMotivo(motivo);
		zona.setOrden(orden);
		zonas.save(zona);
	}

	/**
	 * Las tres familias del alcance, en su orden de importancia.
	 * Turismo nace aqui para que el filtro exista, aunque no lleve
	 * productos con precio (sus fichas las sirve el frontend).
	 */
	private Map<String, Categoria> sembrarCategorias() {
		Map<String, Categoria> mapa = new HashMap<>();

		mapa.put("agro", categorias.save(new Categoria("Agro", "agro", "campo", 1)));
		mapa.put("pesca", categorias.save(new Categoria("Pesca", "pesca", "pesca", 2)));
		mapa.put("turismo", categorias.save(new Categoria("Turismo", "turismo", "turismo", 3)));

		return mapa;
	}

	/**
	 * Crea el dueno sintetico y el negocio.
	 *
	 * Los duenos del seed no pueden iniciar sesion porque no existen en
	 * Supabase Auth; su UUID es de mentira. Es el precio de sembrar un
	 * catalogo sin haber creado cuentas a mano.
	 */
	private Negocio negocio(String nombre, String direccion, String barrio,
			UUID duenoId, String whatsapp, String descripcion) {

		Usuario dueno = usuarios.findById(duenoId).orElseGet(() -> {
			// El correo lleva el UUID completo, no un prefijo: los UUID de
			// ejemplo comparten los primeros 8 caracteres, y cortarlos hacia
			// que los duenos chocaran en el mismo email y el seed
			// reventara contra la restriccion de unicidad.
			Usuario nuevo = new Usuario(duenoId,
					"dueno-" + duenoId + "@repelonmarket.demo",
					"Dueño de " + nombre);
			nuevo.setRol(Rol.VENDEDOR);
			return usuarios.save(nuevo);
		});

		Negocio negocio = new Negocio(dueno, nombre, slugDe(nombre), direccion, barrio);
		negocio.setDescripcion(descripcion);
		negocio.setWhatsapp(whatsapp);
		negocio.setTelefono(whatsapp);
		negocio.setAprobado(true);
		negocio.setAbierto(true);
		negocio.setHorario("{\"lunes\":{\"abre\":\"07:00\",\"cierra\":\"19:00\"},"
				+ "\"martes\":{\"abre\":\"07:00\",\"cierra\":\"19:00\"},"
				+ "\"miercoles\":{\"abre\":\"07:00\",\"cierra\":\"19:00\"},"
				+ "\"jueves\":{\"abre\":\"07:00\",\"cierra\":\"19:00\"},"
				+ "\"viernes\":{\"abre\":\"07:00\",\"cierra\":\"19:00\"},"
				+ "\"sabado\":{\"abre\":\"07:00\",\"cierra\":\"14:00\"},"
				+ "\"domingo\":null}");
		negocio.tocar();

		return negocios.save(negocio);
	}

	/** Coordenadas de ejemplo para que el mapa tenga marcadores en una base nueva. */
	private void ubicar(Negocio negocio, double latitud, double longitud, String referencia) {
		negocio.setLatitud(latitud);
		negocio.setLongitud(longitud);
		negocio.setReferenciaUbicacion(referencia);
	}

	/**
	 * Crea el producto con su unidad explicita. Todo producto del seed
	 * lleva unidad declarada (kilo o libra): es el dato que el comprador
	 * compara en el buscador.
	 */
	private void producto(Negocio negocio, Categoria categoria, String nombre,
			UnidadProducto unidad, long precio, Integer stock, String descripcion) {

		Producto producto = new Producto(negocio, categoria, nombre, precio);
		producto.setUnidad(unidad);
		producto.setDescripcion(descripcion);
		producto.setStock(stock);
		producto.setDisponible(true);
		producto.tocar();

		productos.save(producto);
	}

	/** Slug simple para el seed, sin depender de SlugService. */
	private String slugDe(String nombre) {
		return Normalizer.normalize(nombre, Normalizer.Form.NFD)
				.replaceAll("\\p{M}", "")
				.toLowerCase(Locale.ROOT)
				.replaceAll("[^a-z0-9]+", "-")
				.replaceAll("^-+|-+$", "");
	}
}
