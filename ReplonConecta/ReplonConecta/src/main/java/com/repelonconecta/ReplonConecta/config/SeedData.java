package com.repelonconecta.ReplonConecta.config;

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

import com.repelonconecta.ReplonConecta.entity.Categoria;
import com.repelonconecta.ReplonConecta.entity.Negocio;
import com.repelonconecta.ReplonConecta.entity.Producto;
import com.repelonconecta.ReplonConecta.entity.Rol;
import com.repelonconecta.ReplonConecta.entity.Usuario;
import com.repelonconecta.ReplonConecta.repository.CategoriaRepository;
import com.repelonconecta.ReplonConecta.repository.NegocioRepository;
import com.repelonconecta.ReplonConecta.repository.ProductoRepository;
import com.repelonconecta.ReplonConecta.repository.UsuarioRepository;

/**
 * Datos de ejemplo para que la app no arranque vacia.
 *
 * Corre solo cuando app.seed.activo=true Y la base no tiene categorias
 * todavia. Es idempotente a proposito: reiniciar el backend no duplica
 * negocios ni productos.
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

	public SeedData(CategoriaRepository categorias, NegocioRepository negocios,
			ProductoRepository productos, UsuarioRepository usuarios) {
		this.categorias = categorias;
		this.negocios = negocios;
		this.productos = productos;
		this.usuarios = usuarios;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (!activo) {
			return;
		}

		if (categorias.count() > 0 || negocios.count() > 0) {
			log.info("Seed omitido: la base ya tiene datos.");
			return;
		}

		log.info("Sembrando negocios de ejemplo de Repelon...");

		Map<String, Categoria> cat = sembrarCategorias();

		// ---- 1. Panadería -------------------------------------------
		Negocio panaderia = negocio("Panadería La Espiga", "Calle 8 # 5-23", "Centro",
				UUID.fromString("11111111-1111-1111-1111-111111111101"), "573001111001",
				"Pan casero todos los días desde las 5 de la mañana. Bollería, "
						+ "pasteles y tortas por encargo.");

		producto(panaderia, cat.get("comida"), "Pan de queso (x5)", 4000, 40,
				"Pan de queso recién horneado, bolsa de 5 unidades.");
		producto(panaderia, cat.get("comida"), "Pan blandito (x10)", 5000, 60,
				"Pan blanco suave, ideal para el desayuno.");
		producto(panaderia, cat.get("comida"), "Pastel de carne", 4500, 20,
				"Pastel de carne con papa y arroz.");
		producto(panaderia, cat.get("comida"), "Torta de chocolate (1 lb)", 18000, 5,
				"Torta de chocolate por encargo. Pedir con un día de anticipación.");
		producto(panaderia, cat.get("comida"), "Arepa de huevo", 4000, 25,
				"Arepa de huevo costeña, recién frita.");

		// ---- 2. Tienda de barrio ------------------------------------
		Negocio tienda = negocio("Tienda El Buen Vecino", "Carrera 12 # 4-05", "El Carmen",
				UUID.fromString("11111111-1111-1111-1111-111111111102"), "573001111002",
				"La tienda de la esquina de toda la vida. Víveres, aseo, "
						+ "bebidas y lo que se necesite a última hora.");

		producto(tienda, cat.get("comida"), "Arroz Diana 500g", 3200, 100,
				"Arroz blanco de grano largo.");
		producto(tienda, cat.get("comida"), "Aceite Mazola 1L", 9500, 40,
				"Aceite vegetal para cocina.");
		producto(tienda, cat.get("comida"), "Panela (tapas x4)", 4000, 50,
				"Panela cuadrada campesina.");
		producto(tienda, cat.get("aseo"), "Jabón Rey", 3800, 60,
				"Jabón de barra para ropa.");
		producto(tienda, cat.get("bebidas"), "Gaseosa Postobón 1.5L", 6500, 30,
				"Gaseosa bien fría.");

		// ---- 3. Droguería -------------------------------------------
		Negocio drogueria = negocio("Droguería La Salud", "Calle 6 # 7-41", "Centro",
				UUID.fromString("11111111-1111-1111-1111-111111111103"), "573001111003",
				"Medicamentos, cuidado personal y aplicación de inyecciones. "
						+ "Si no tenemos algo, lo conseguimos de un día para otro.");

		producto(drogueria, cat.get("drogueria"), "Acetaminofén 500mg (x10)", 3500, 80,
				"Alivio del dolor y la fiebre.");
		producto(drogueria, cat.get("drogueria"), "Suero oral", 2500, 70,
				"Sobre de sales de rehidratación oral.");
		producto(drogueria, cat.get("drogueria"), "Alcohol antiséptico 300ml", 6000, 45,
				"Alcohol al 70%.");
		producto(drogueria, cat.get("aseo"), "Crema dental Colgate", 7200, 35,
				"Crema dental 90g.");
		producto(drogueria, cat.get("drogueria"), "Tapabocas (caja x10)", 9000, 25,
				"Caja de tapabocas desechables.");

		// ---- 4. Ferretería ------------------------------------------
		Negocio ferreteria = negocio("Ferretería Don Chucho", "Carrera 9 # 11-18", "Buenos Aires",
				UUID.fromString("11111111-1111-1111-1111-111111111104"), "573001111004",
				"Herramientas, materiales y todo para la construcción y el "
						+ "arreglo de la casa. Asesoría para lo que necesite.");

		producto(ferreteria, cat.get("ferreteria"), "Cemento gris 50kg", 32000, 20,
				"Bulto de cemento.");
		producto(ferreteria, cat.get("ferreteria"), "Alambre dulce (kg)", 11000, 30,
				"Alambre galvanizado por kilo.");
		producto(ferreteria, cat.get("ferreteria"), "Martillo mango madera", 25000, 10,
				"Martillo de bola para uso general.");
		producto(ferreteria, cat.get("ferreteria"), "Bombillo LED 9W", 13000, 40,
				"Bombillo ahorrador, luz blanca.");
		producto(ferreteria, cat.get("ferreteria"), "Pintura blanca 1 galón", 45000, 8,
				"Vinilo blanco tipo 1.");

		// ---- 5. Del campo -------------------------------------------
		Negocio agro = negocio("Agro Repelón", "Vereda Rotinet, km 3", "Vereda Rotinet",
				UUID.fromString("11111111-1111-1111-1111-111111111105"), "573001111005",
				"Productos del campo de la región: frutas, verduras y granos "
						+ "directo del productor. Entregas en el casco urbano.");

		producto(agro, cat.get("agro"), "Yuca (kilo)", 2500, 100,
				"Yuca fresca de la región.");
		producto(agro, cat.get("agro"), "Mango de azúcar (x10)", 8000, 50,
				"Mango dulce de la zona.");
		producto(agro, cat.get("agro"), "Aguacate (kilo)", 6000, 40,
				"Aguacate criollo.");
		producto(agro, cat.get("agro"), "Frijol rojo (libra)", 7500, 60,
				"Frijol rojo seleccionado.");
		producto(agro, cat.get("agro"), "Coco (unidad)", 3000, 80,
				"Coco fresco.");

		log.info("Seed completo: {} negocios, {} productos, {} categorias.",
				negocios.count(), productos.count(), categorias.count());
		log.info("Los negocios sembrados no tienen cuenta en Supabase: sirven para ver "
				+ "el catalogo. Para probar el flujo de vendedor, registrate en la app "
				+ "y crea tu propio negocio.");
	}

	private Map<String, Categoria> sembrarCategorias() {
		Map<String, Categoria> mapa = new HashMap<>();

		mapa.put("comida", categorias.save(new Categoria("Comida y mercadito", "comida", "pan", 1)));
		mapa.put("tienda", categorias.save(new Categoria("Tienda de barrio", "tienda", "tienda", 2)));
		mapa.put("drogueria", categorias.save(new Categoria("Droguería", "drogueria", "drogueria", 3)));
		mapa.put("ferreteria", categorias.save(new Categoria("Ferretería", "ferreteria", "ferreteria", 4)));
		mapa.put("agro", categorias.save(new Categoria("Del campo", "agro", "campo", 5)));
		mapa.put("aseo", categorias.save(new Categoria("Aseo y hogar", "aseo", "aseo", 6)));
		mapa.put("bebidas", categorias.save(new Categoria("Bebidas", "bebidas", "bebida", 7)));
		mapa.put("ropa", categorias.save(new Categoria("Ropa y calzado", "ropa", "ropa", 8)));
		mapa.put("servicios", categorias.save(new Categoria("Servicios", "servicios", "servicio", 9)));

		return mapa;
	}

	/**
	 * Crea el dueno sintetico y el negocio.
	 *
	 * Los duenos del seed no pueden iniciar sesion porque no existen en
	 * Supabase Auth; su UUID es de mentira. Es el precio de sembrar un
	 * catalogo sin haber creado cinco cuentas a mano.
	 */
	private Negocio negocio(String nombre, String direccion, String barrio,
			UUID duenoId, String whatsapp, String descripcion) {

		Usuario dueno = usuarios.findById(duenoId).orElseGet(() -> {
			// El correo lleva el UUID completo, no un prefijo: los UUID de
			// ejemplo comparten los primeros 8 caracteres, y cortarlos hacia
			// que los cinco duenos chocaran en el mismo email y el seed
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

	private void producto(Negocio negocio, Categoria categoria, String nombre,
			long precio, Integer stock, String descripcion) {

		Producto producto = new Producto(negocio, categoria, nombre, precio);
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