# Cuestionario para el cliente — Repelón Conecta

**Propósito:** confirmar qué quiere realmente antes de programar la búsqueda
"20 kilos de yuca" y el resto del alcance. De aquí sale el alcance del P0.

**De:** equipo de desarrollo · **Para:** profesor/propietario de la idea
**Cómo se usan:** por WhatsApp, una respuesta por pregunta; con "no sé" basta.

## Contexto

La idea es que quien busque "dónde consigo 20 kilos de yuca" o "pescado
fresco" aparezca en la plataforma, con el mapa de Repelón — solo negocios
**agrícolas, pesqueros y de turismo**. Ya tenemos mapa, fichas, carrito,
pedidos y paneles. Estas preguntas son para decidir **cómo** queda la
búsqueda y **hasta dónde** llega el administrador.

> **✅ TODO CERRADO (28 de 28): 22 por respuestas/síntesis + 6 por
> decisión del equipo ("no se pregunta más").**
> 1. **Alcance**: solo negocios **agrícolas, pesqueros y de turismo** del
>    pueblo (ferreterías, droguerías y tiendas quedan fuera).
> 2. **Precios públicos**: visibles en búsqueda y ficha; productos con
>    precio = pescados y agrícolas (turismo sin precios).
> 3. **Sin domicilios**: la app no entrega ni cobra (ver 11).
> 4. **Datos**: el cliente proporciona las direcciones y los mapas; la
>    lista de negocios la pasa él (26); productos: mezcla (8, decisión).
> 5. **Fotos**: las suben los estudiantes.
> 6. **Resultado**: en mapa y en lista (los dos), para que se vea más
>    dinámico.
> 7. **Operación**: los estudiantes-admin **hacen todo** — cargan negocios,
>    productos, fotos y atienden por WhatsApp; **el rol de admin primero es
>    tuyo** y tú se lo compartes al equipo (preguntas 10, 19 y 25).
> 8. **Ubicación** de los negocios en el mapa: bien, nada mal ubicado (13).
> 9. **Turismo**: solo direcciones y zonas turísticas del pueblo, sin
>    productos (16).
> 10. **Sin cuenta**: buscar y ver precios es libre, sin registro (17).
> 11. **La app es solo intermediaria**: sin dinero ni consultas en la app
>     (20 refinada, 18) — se ve el **perfil del vendedor** y se habla por
>     **WhatsApp**; avisos también por WhatsApp, lo coordinan ellos (21) →
>     **carrito, checkout, pedidos y notificaciones fuera de la v1**.
> 12. **Sin avisos** de producto agotado o de temporada (22).
> 13. **WhatsApp/teléfono visible** en la ficha de cada negocio (27).
> 14. **Gratis** para los negocios; después se verá cómo sostenerla (28).
> 15. **Fecha: 5 días** (15).
> 16. **Unidades: kilos y libras** (9).
> 17. **Búsqueda sí es por producto**: "20 kilos de yuca" → lista con
>     precio en mapa + lista → perfil del vendedor → WhatsApp (cierra la
>     tensión "perfil vs. producto"; decisiones 2 y 12).
>
> **Decisiones del equipo (3, 8, 11, 12, 14, 23):** basta con encontrar
> el producto (sin interpretar cantidades) · productos de ejemplo que los
> estudiantes editan/fotografían · sin CMS (textos del home fijos) · el
> mínimo es el buscador · ninguna pregunta nueva · materiales de ejemplo
> hasta que el cliente pase los suyos.

## Cómo responder

Responde solo el número, por ejemplo: `1) sí, con precio y mapa`. Si algo no
queda claro, di "no sé" y lo hablamos.

---

## A. Lo más importante (la búsqueda)

### 1. ✅ Ya respondido — Ferreterías, droguerías y tiendas de barrio:
> ¿desaparecen del mapa y del listado, o siguen ahí pero sus productos no
> entran en la búsqueda?

_Importa: decide si acotamos **solo la búsqueda** o **todo el catálogo**; es
la diferencia entre un cambio de una semana y uno grande._

> **✅ Respuesta del cliente: solo negocios agrícolas, pesqueros y de
> turismo.** Los demás quedan fuera del catálogo.

### 2. ✅ Ya respondido (por síntesis) — Cuando alguien escribe "20 kilos
> de yuca", ¿qué debe aparecerle?

_Importa: es literalmente el objetivo del trabajo; define todo lo demás._

> **✅ Síntesis de otras respuestas:** aparece la **lista de negocios que
> lo tienen, con precio, barrio y si están abiertos**, y sus **pines en el
> mapa** (lista + mapa, los dos); de ahí se entra al **perfil del
> vendedor** y se habla por **WhatsApp**.

### 3. Cerrada por decisión — ¿Que se entienda la cantidad ("20 kilos") o
> basta con encontrar "yuca"?

_Importa: entender cantidades cuesta programar más; si basta con "yuca" es
más rápido._

> **Cerrada: no se pregunta más.** Por defecto: **basta con encontrar el
> producto** (la cantidad no se interpreta; el precio sale en kilo/libra).

### 4. ✅ Ya respondido — ¿El resultado sale sobre el mapa, en una lista, o
> en las dos?

_Importa: decide si tocamos la pantalla del mapa o solo la de búsqueda._

> **✅ Respuesta del cliente: los dos**, para que se vea más dinámico.

### 5. ✅ Ya respondido (por síntesis) — ¿También debe buscar por tipo de
> negocio, o solo por producto?

_Importa: hoy ya busca negocios; confirmamos si eso se queda o se reemplaza._

> **✅ Implícito: ambas.** Se queda la búsqueda por producto (agro y
> pesca) y también por tipo/zona — las categorías de pantalla son agro,
> pesca y turismo (ver 24).

### 6. ✅ Ya respondido — ¿Se ven los precios para cualquiera o solo después
> de pedir?

_Importa: si los precios son públicos, la búsqueda los muestra; si no, cambia._

> **✅ Respuesta del cliente: sí, los precios van públicos**, y los
> productos con precio son **los pescados y los productos agrícolas** —
> el turismo queda como ficha sin precios.

## B. Los datos (quién pone el contenido)

### 7. ✅ Ya respondido — ¿Quién carga las fotos de los productos: el
> dueño, el admin, o da igual?

_Importa: el upload de fotos todavía no existe; el que carga manda el flujo._

> **✅ Respuesta del cliente: las suben los estudiantes.**

### 8. Cerrada por decisión — ¿Vamos a cargar productos REALES de Repelón o
> seguimos con los de ejemplo?

_Importa: sin datos reales la demo no convence; con datos reales hay que
coordinar con los dueños._

> **Cerrada: no se pregunta más.** Por defecto: **mezcla** — la lista de
> negocios la pasa el cliente (26) y los productos arrancan con datos de
> ejemplo de agro/pesca que los estudiantes puedan editar y fotografiar.

### 9. ✅ Ya respondido — ¿Cuáles unidades usa el pueblo: kilo, libra,
> unidad, bulto, arroba?

_Importa: la unidad va como campo en el producto, no escrita en el nombre._

> **✅ Respuesta del cliente: kilos y libras.**

## C. El administrador

### 10. ✅ Ya respondido — ¿Qué debe poder hacer el admin además de
> aprobar y destacar negocios? (elija varios: usuarios · pedidos ·
> categorías · fotos · textos del home)

_Importa: hoy solo aprueba/destaca/borra negocios; el resto no existe._

> **✅ Respuesta del cliente: los estudiantes-admin hacen todo.** El panel
> admin debe cubrir la operación completa (carga de negocios y productos,
> fotos, pedidos, moderación).

### 11. Cerrada por decisión — Cuando dices "agregar páginas", ¿qué tienes
> en mente?

_Importa: editar textos del home es rápido; páginas nuevas tipo CMS es otro
trabajo._

> **Cerrada: no se pregunta más.** Por defecto: **sin CMS** — textos del
> home fijos; si luego los piden, se abre aparte.

## D. Prioridad y entregas

### 12. Cerrada por decisión — ¿Qué es lo MÍNIMO que debes ver funcionando
> en la próxima entrega?

_Importa: con esto ordenamos los tickets (P0)._

> **Cerrada: no se pregunta más.** Por defecto: **el buscador** — buscar
> "yuca" → lista con precio en mapa y lista → perfil del vendedor →
> WhatsApp (es literalmente la idea).

### 13. ✅ Ya respondido — ¿La ubicación de los negocios en el mapa te ha
> salido bien? ¿Alguno sale mal ubicado?

_Importa: si salen mal ubicados, la corrección de coordenadas sube de
prioridad._

> **✅ Respuesta del cliente: sí, bien.**

## E. Cierre

### 14. Cerrada — ¿Algo que no te hemos preguntado y que es importante para ti?

> **Cerrada: no se pregunta más.**

---

## F. Operación y entregas (tanda 2)

### 15. ✅ Ya respondido — ¿Para cuándo hay que tenerlo listo (fecha de
> entrega o demo)?

_Importa: ordena todo lo demás._

> **✅ Respuesta del cliente: 5 días.**

### 16. ✅ Ya respondido — Un negocio turístico, ¿qué lista: productos, o
> solo ficha con fotos, dirección y WhatsApp?

_Importa: define si turismo entra en el buscador de productos o solo en el
mapa._

> **✅ Respuesta del cliente:** en la sección de turismo se muestran las
> **direcciones y las zonas turísticas del pueblo** — sin productos ni
> precios.

### 17. ✅ Ya respondido — ¿Crear cuenta solo para pedir, o también para
> buscar y ver precios?

_Importa: hoy buscar es público y pedir pide cuenta._

> **✅ Respuesta del cliente:** no hace falta que el usuario pida ni se
> registre — **todo libre**: buscar, ver precios y consultar sin cuenta.

### 18. ✅ Ya respondido — Si no hay domicilios: ¿el pago es en el negocio
> al recoger (efectivo o transferencia), o hay que pagar en línea?

_Importa: define si tocamos la pasarela de pagos._

> **✅ Respuesta del cliente:** la app **no maneja dinero** — el pago lo
> arreglan el cliente y el negocio directamente (la 20).

### 19. ✅ Ya respondido — ¿Quién carga los productos y precios en la app:
> los estudiantes, el admin, o cada dueño desde su panel?

_Importa: el que carga define el flujo de edición._

> **✅ Respuesta del cliente: los estudiantes-admin hacen todo.**

### 20. ✅ Ya respondido — ¿El vecino hace el pedido en la app (carrito y
> checkout) o solo consulta y te escribe por WhatsApp?

_Importa: si es solo consulta, el carrito puede quedar fuera de la v1._

> **✅ Respuesta del cliente (refinada):** la app **no maneja dinero ni
> consultas** — solo sirve de **intermediario**: se **ve el perfil del
> vendedor** y la comunicación es **por WhatsApp**. Carrito, checkout,
> pedidos y mensajes dentro de la app quedan **fuera de la v1**.

### 21. ✅ Ya respondido — Cuando el pedido esté listo, ¿cómo se entera el
> que lo pidió: WhatsApp, llamada o aviso en la app?

_Importa: una notificación en la app es trabajo extra de backend._

> **✅ Respuesta del cliente: por WhatsApp** — eso lo arreglan ellos con el
> cliente; **sin notificaciones en la app.**

### 22. ✅ Ya respondido — ¿Hay que avisar cuando un producto se agote o
> sea de temporada ("hoy no hay pescado")?

_Importa: define si necesitamos estado de stock/temporada._

> **✅ Respuesta del cliente: no hace falta.**

### 23. Cerrada por decisión — ¿Qué materiales nos pasas? (logo, colores,
> fotos del pueblo y de los productos, textos del home)

_Importa: sin textos ni fotos, el home queda con los de ejemplo._

> **Cerrada: no se pregunta más.** Por defecto: se usa lo de **ejemplo**
> hasta que el cliente pase lo suyo (logo, fotos, textos).

### 24. ✅ Ya respondido (por síntesis) — ¿Cuáles son las categorías exactas
> que quieres mostrar? (agro · pesca · turismo, ¿con subcategorías?)

_Importa: hoy hay 9 categorías en la base; hay que recortarlas._

> **✅ Implícito: las tres familias — agro, pesca y turismo.** Recortar
> las otras 6 de la base; subcategorías solo si él las pide después.

### 25. ✅ Ya respondido — ¿Quién queda como administrador de la plataforma
> (nombre y WhatsApp para darle el rol)?

_Importa: hoy no hay ningún usuario con rol admin._

> **✅ Respuesta del cliente: primero el rol para él (el usuario actual),
> y después él se lo comparte a los estudiantes.**

### 26. ✅ Ya respondido — ¿Quién registra los negocios: nos pasas la lista
> o cada dueño pide su ficha?

_Importa: define quién llena las fichas en la v1._

> **✅ Respuesta del cliente: la lista la pasan ellos.**

### 27. ✅ Ya respondido — ¿Cada negocio debe mostrar su WhatsApp o
> teléfono para hablar directo?

_Importa: casi es estándar; lo confirmamos._

> **✅ Respuesta del cliente: sí.**

### 28. ✅ Ya respondido — ¿La plataforma es gratuita para los negocios o
> tiene algún costo?

_Importa: afecta textos y registro._

> **✅ Respuesta del cliente: gratis** — después se buscará una manera de
> sostenerla.
