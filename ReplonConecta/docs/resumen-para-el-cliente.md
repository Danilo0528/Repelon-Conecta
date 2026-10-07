# Repelón Conecta — Resumen para el cliente

**Versión:** octubre 2026 · **Estado:** alcance cerrado, **P0
(buscador), P1 (ubicación + fotos) y P2 (panel admin) entregados** ·
**Entrega:** 5 días

---

## La idea

Una página para el pueblo donde cualquiera pueda escribir **"dónde consigo
20 kilos de yuca"** y ver al instante quién lo tiene, con precio, en el
**mapa de Repelón** — para conectar los negocios locales con la gente.

**Alcance confirmado con usted:**

- Solo negocios **agrícolas, pesqueros y de turismo** del pueblo.
- **Los precios se ven públicos** (en la búsqueda y en la ficha), y se
  pueden comparar entre negocios. Los productos con precio son **los
  pescados y los productos agrícolas**; el turismo queda como ficha de
  contacto, sin precios.
- **La app solo es intermediaria**: **sin dinero y sin consultas** en la
  app — se ve el **perfil del vendedor** y la comunicación es **por
  WhatsApp**. Sin domicilios, sin carrito ni compra en línea.
- El resultado se muestra **en lista y en el mapa al mismo tiempo**, para
  que se vea más dinámico.
- **Usted nos pasa las direcciones y los mapas** de los negocios.
- **Las fotos las suben los estudiantes** desde su panel.
- Quienes operan la plataforma son **los estudiantes (admins)**: cargan
  negocios, productos y fotos, moderan y atienden por WhatsApp.
- Las unidades de los productos son **kilos y libras**.

---

## Estado de la entrega (lo que ya funciona)

✅ **Entregado y probado en celular y computador:**

- Buscador "¿dónde consigo X?" con **lista y mapa al mismo tiempo**
  (ej.: "20 kilos de yuca" encuentra la Yuca de Agro Repelón con su
  precio en kilo).
- **Alcance acotado**: el catálogo solo muestra agro, pesca y turismo —
  ferreterías, droguerías y tiendas ya no aparecen en ninguna pantalla.
- **Sección de Turismo** en el home: lugares y zonas del pueblo sin
  precios, con "Cómo llegar" en el mapa.
- **Ficha del negocio** con productos, precios en kilo/libra, horario y
  el botón **WhatsApp** que abre el chat con el mensaje listo.
- **Sin carrito, sin pagos, sin pedidos**: esas pantallas están
  ocultas y no se ven en ninguna parte.
- Unidades **kilo | libra** editables por el vendedor al crear o editar
  un producto.
- **"Usar mi ubicación"** en la pantalla de resultados: desde el
  celular, el mapa pinta un pin azul con dónde está el vecino frente a
  los negocios — y las direcciones ya no se salen de Repelón (la
  geocodificación quedó encerrada en el pueblo).
- **Panel del administrador completo**: ver **todos los usuarios** (y
  cambiar su rol o desactivarlos), ver **todos los pedidos** (y anular
  los que aún no salen), crear y desactivar **categorías**, y editar los
  **textos del home** (títulos del inicio, mapa, turismo e invitación)
  sin tocar el código — todo probado en vivo (26 verificaciones).

⏳ **Pendiente de configuración en Supabase (pasos técnicos, sin más
programación):**

- **Fotos**: el panel del estudiante ya tiene "Subir logo" y "Subir
  foto" (con vista previa); falta correr el SQL de políticas de
  escritura del bucket y hacer la prueba final con la cuenta del
  administrador (instrucciones en el ticket 02).
- **Rol de administrador**: el SQL en Supabase (sigue pendiente).

🔜 **Sigue (programación aparte):**

- **Materiales de ustedes**: lista de negocios, logos, fotos y textos
  del home (mientras tanto, los de ejemplo).

---

## Qué incluye el alcance

### 1. Buscador "¿dónde consigo X?"

Escribe lo que necesitas (ej. "yuca", "pescado fresco", "20 kilos de
yuca") y aparece:

- **Lista de resultados**: producto, precio (en kilos y libras), negocio,
  barrio.
- **El mapa con los pines** de esos negocios resaltados, encima.
- Filtros por tipo de negocio (agro · pesca · turismo) y por barrio.

### 2. Ficha de cada negocio

- Qué vende (productos con foto, precio y disponibilidad).
- **Cómo llegar** (mapa embebido con la ubicación exacta).
- Teléfono / WhatsApp del negocio para hablar directo.
- Horario y dirección.

### 3. Mapa general de Repelón

Todos los negocios del pueblo en un solo mapa, con buscador encima.

### 4. Ver el vendedor y hablar por WhatsApp

- **Sin carrito, sin pagos ni consultas dentro de la app**: la app es un
  **intermediario**.
- El usuario encuentra el negocio, **ve su perfil** (qué vende, fotos,
  ubicación, horario) y toca **"WhatsApp"** — se abre el chat con el
  dueño y allí cierran todo (precio, cantidad, recogida, pago).
- La app **no manda notificaciones** ni maneja dinero.
- Las cuentas son **libres**: para buscar y ver precios no hay que
  registrarse.

### 5. Paneles de administración (los usan los estudiantes)

- **Admin**: aprobar y destacar negocios, **ver usuarios y pedidos**,
  **categorías y textos del home** (✅ todo esto ya está entregado).
- **Carga de contenido**: subir fotos de productos y de los negocios,
  cargar productos y precios.
- El **rol de administrador primero queda en la cuenta de ustedes** y
  ustedes se lo comparten al equipo.

### 6. Ajustes visuales

- Home y navegación con el diseño aprobado (ya entregado, versión para
  celular y computador).
- Del catálogo se quitó todo lo que no sea agro, pesca o turismo: solo
  quedan esas tres familias (entregado).

---

## Lo que aún falta de ustedes (cuando lo tengan)

No hay más preguntas — el alcance está cerrado. Solo nos pueden pasar:

1. **La lista de negocios** que entran (dirección y cómo llegar).
2. **Materiales** cuando estén: logo, fotos del pueblo, textos del home.
   (Mientras tanto se usa contenido de ejemplo.)

---

## Cómo se entrega

1. **En 5 días**, en orden:
2. ✅ Primero quedó funcionando el **buscador con mapa** — la idea
   central — con el perfil del vendedor y el botón de WhatsApp.
3. ✅ Después el resto del P0: alcance acotado, sección de turismo y
   unidades kilo/libra.
4. ✅ Después el P1: **mapa con "Usar mi ubicación"**, direcciones
   encerradas en Repelón y **panel de fotos** listo (falta correr la
   configuración en Supabase).
5. ✅ Después el P2: **panel admin completo** — usuarios, pedidos,
   categorías y textos del home editables — con tests automáticos del
   frontend y del backend.
6. ✅ **Cada avance se probó en vivo** (celular y computador), y todo
   queda documentado para la feria.
7. Lo que sigue (materiales de ustedes) se agenda por separado.

---

_Preguntas y respuestas consolidadas en `estado-del-proyecto.md` y
`cuestionario-cliente.md` (documentos internos del equipo)._
