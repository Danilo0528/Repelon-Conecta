package com.repelonconecta.ReplonConecta.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Encabezado de un pedido. Un pedido es siempre de UN solo negocio.
 *
 * Esta clase guarda un SNAPSHOT de los datos del comprador y del total.
 * No se enlaza a Direccion ni a los productos, porque si el comprador
 * edita su direccion o el negocio sube el precio, un pedido ya hecho
 * debe seguir mostrando lo que realmente se pidio y se cobro.
 *
 * Por eso el total vive aqui Y el detalle de lineas en ItemPedido: el
 * total es la fuente de verdad para las metricas de ventas, y se
 * recalcula al crear el pedido, no despues.
 */
@Entity
@Table(name = "pedidos")
public class Pedido {

	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id = UUID.randomUUID();

	/**
	 * Numero corto que el humano lee y dicta por telefono: "RM-1042".
	 * Deriva del timestamp, unico en la practica sin necesitar una
	 * secuencia de base de datos.
	 */
	@Column(name = "numero", nullable = false, unique = true, length = 20)
	private String numero;

	@ManyToOne(optional = false)
	@JoinColumn(name = "comprador_id", nullable = false)
	private Usuario comprador;

	@ManyToOne(optional = false)
	@JoinColumn(name = "negocio_id", nullable = false)
	private Negocio negocio;

	@Enumerated(EnumType.STRING)
	@Column(name = "estado", nullable = false, length = 30)
	private EstadoPedido estado = EstadoPedido.PEDIDO_RECIBIDO;

	@Enumerated(EnumType.STRING)
	@Column(name = "metodo_entrega", nullable = false, length = 30)
	private MetodoEntrega metodoEntrega;

	@Enumerated(EnumType.STRING)
	@Column(name = "metodo_pago", nullable = false, length = 30)
	private MetodoPago metodoPago;

	// ---- Snapshot del comprador -------------------------------------
	// Se copian aqui en vez de leer de Usuario y Direccion para que el
	// historial no cambie si el usuario edita sus datos.

	@Column(name = "comprador_nombre", nullable = false, length = 120)
	private String compradorNombre;

	@Column(name = "comprador_telefono", length = 20)
	private String compradorTelefono;

	// ---- Snapshot de la entrega -------------------------------------

	/** null cuando el metodo es RECOGER_EN_TIENDA. */
	@Column(name = "entrega_direccion", length = 200)
	private String entregaDireccion;

	@Column(name = "entrega_barrio", length = 100)
	private String entregaBarrio;

	@Column(name = "entrega_vereda", length = 100)
	private String entregaVereda;

	@Column(name = "entrega_referencia", length = 300)
	private String entregaReferencia;

	// ---- Dinero ------------------------------------------------------

	/** Suma de las lineas, en pesos. Sin decimales. */
	@Column(name = "total", nullable = false)
	private long total;

	/**
	 * Lo que el negocio confirmo que recibio. En pagos contra entrega y
	 * transferencias el comprador no paga en linea, asi que esto lo
	 * llena el vendedor a mano. false = aun no confirma.
	 */
	@Column(name = "pago_confirmado", nullable = false)
	private boolean pagoConfirmado = false;

	// ---- Notas -------------------------------------------------------

	@Column(name = "notas", length = 500)
	private String notas;

	// ---- Auditoria ---------------------------------------------------

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn = Instant.now();

	@Column(name = "actualizado_en", nullable = false)
	private Instant actualizadoEn = Instant.now();

	/**
	 * Lineas del pedido. Se borran en cascada con el encabezado, que es
	 * lo correcto: un pedido sin lineas no tiene sentido.
	 */
	@OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ItemPedido> items = new ArrayList<>();

	public Pedido() {
	}

	/** Recalcula el total a partir de las lineas. */
	public void recalcularTotal() {
		this.total = items.stream().mapToLong(ItemPedido::getSubtotal).sum();
	}

	public void agregarItem(ItemPedido item) {
		item.setPedido(this);
		items.add(item);
	}

	public void tocar() {
		this.actualizadoEn = Instant.now();
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getNumero() {
		return numero;
	}

	public void setNumero(String numero) {
		this.numero = numero;
	}

	public Usuario getComprador() {
		return comprador;
	}

	public void setComprador(Usuario comprador) {
		this.comprador = comprador;
	}

	public Negocio getNegocio() {
		return negocio;
	}

	public void setNegocio(Negocio negocio) {
		this.negocio = negocio;
	}

	public EstadoPedido getEstado() {
		return estado;
	}

	public void setEstado(EstadoPedido estado) {
		this.estado = estado;
	}

	public MetodoEntrega getMetodoEntrega() {
		return metodoEntrega;
	}

	public void setMetodoEntrega(MetodoEntrega metodoEntrega) {
		this.metodoEntrega = metodoEntrega;
	}

	public MetodoPago getMetodoPago() {
		return metodoPago;
	}

	public void setMetodoPago(MetodoPago metodoPago) {
		this.metodoPago = metodoPago;
	}

	public String getCompradorNombre() {
		return compradorNombre;
	}

	public void setCompradorNombre(String compradorNombre) {
		this.compradorNombre = compradorNombre;
	}

	public String getCompradorTelefono() {
		return compradorTelefono;
	}

	public void setCompradorTelefono(String compradorTelefono) {
		this.compradorTelefono = compradorTelefono;
	}

	public String getEntregaDireccion() {
		return entregaDireccion;
	}

	public void setEntregaDireccion(String entregaDireccion) {
		this.entregaDireccion = entregaDireccion;
	}

	public String getEntregaBarrio() {
		return entregaBarrio;
	}

	public void setEntregaBarrio(String entregaBarrio) {
		this.entregaBarrio = entregaBarrio;
	}

	public String getEntregaVereda() {
		return entregaVereda;
	}

	public void setEntregaVereda(String entregaVereda) {
		this.entregaVereda = entregaVereda;
	}

	public String getEntregaReferencia() {
		return entregaReferencia;
	}

	public void setEntregaReferencia(String entregaReferencia) {
		this.entregaReferencia = entregaReferencia;
	}

	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	public boolean isPagoConfirmado() {
		return pagoConfirmado;
	}

	public void setPagoConfirmado(boolean pagoConfirmado) {
		this.pagoConfirmado = pagoConfirmado;
	}

	public String getNotas() {
		return notas;
	}

	public void setNotas(String notas) {
		this.notas = notas;
	}

	public Instant getCreadoEn() {
		return creadoEn;
	}

	public void setCreadoEn(Instant creadoEn) {
		this.creadoEn = creadoEn;
	}

	public Instant getActualizadoEn() {
		return actualizadoEn;
	}

	public void setActualizadoEn(Instant actualizadoEn) {
		this.actualizadoEn = actualizadoEn;
	}

	public List<ItemPedido> getItems() {
		return items;
	}

	public void setItems(List<ItemPedido> items) {
		this.items = items;
	}
}