# Asistente IA de Repelón Conecta

Chat flotante que responde preguntas sobre los negocios del pueblo
("¿qué pescaderías hay abiertas?", "¿dónde compro café en el Centro?").
Funciona en la página de inicio, visible para cualquier visitante **sin
iniciar sesión**.

---

## Cómo funciona

```
Visitante (navegador)          Backend Spring Boot              Groq (IA)
        │                             │                            │
        │  POST /api/ia/chat          │                            │
        │  { "mensaje": "..." }       │                            │
        ├────────────────────────────►│                            │
        │                             │  1. Consulta los negocios   │
        │                             │     aprobados de Supabase  │
        │                             │     (mismo catálogo         │
        │                             │     público del home)       │
        │                             │                            │
        │                             │  2. Arma un prompt con      │
        │                             │     esos datos REALES       │
        │                             │                            │
        │                             │  3. Llama a la API de Groq  │
        │                             ├───────────────────────────►│
        │                             │                            │
        │                             │◄───────────────────────────┤
        │                             │     respuesta del modelo    │
        │◄────────────────────────────┤                            │
        │  { "respuesta": "..." }     │                            │
```

**Punto clave**: la IA **no inventa**. El backend le entrega la lista
real de negocios (nombre, barrio, dirección, estado, WhatsApp) dentro
del prompt, y las reglas le prohíben inventar comercios o teléfonos
que no estén en esa lista.

---

## Flujo paso a paso

1. El visitante escribe en el chat y pulsa Enviar (o Enter).
2. El frontend envía `POST /api/ia/chat` con `{ "mensaje": "..." }`.
3. `IaAsistenteService.procesarPregunta()`:
   - Si falta la key de Groq → responde amablemente que no está
     configurado (no falla).
   - Consulta `NegocioRepository.buscarPublico(...)` con el alcance
     del proyecto (`agro`, `pesca`, `turismo`) — solo negocios
     **aprobados**.
   - Construye el contexto con esos negocios reales.
   - Llama a Groq con un *system prompt* que impone reglas estrictas
     (máx. 3-4 líneas, no inventar, no política/religión).
4. Groq responde y el backend devuelve `{ "respuesta": "..." }`.
5. Si Groq falla (sin red, modelo caído, cuota agotada), el usuario
   ve un mensaje amable, nunca un error técnico.

---

## Archivos involucrados

| Archivo | Rol |
|---|---|
| `frontend/src/components/AsistenteIaChat.tsx` | Widget flotante (botón burbuja + ventana de chat) |
| `frontend/src/app/layout.tsx` | Monta el widget en todas las páginas |
| `backend/.../controller/IaController.java` | `POST /api/ia/chat` |
| `backend/.../service/IaAsistenteService.java` | Consulta negocios + llama a Groq |
| `backend/.../config/SecurityConfig.java` | Abre `/api/ia/**` a visitantes sin sesión |
| `backend/.../resources/application.properties` | Lee `GROQ_API_KEY` y `GROQ_MODEL` |

---

## Configuración

La key de Groq **nunca va en el código ni en el frontend**: solo vive
en el backend, que es quien hace la llamada.

### Producción (Render)

Render Dashboard → tu servicio backend → **Environment** →
**Environment Variables**:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `GROQ_API_KEY` | Sí | Key de <https://console.groq.com/keys>. Si falta, el asistente responde "no está configurado". |
| `GROQ_MODEL` | No | Modelo a usar. Default: `qwen/qwen3.8-27b`. Sirve para cambiar de modelo **sin redeploy**. |

### Local

```powershell
$env:GROQ_API_KEY="gsk_..."
mvn spring-boot:run
```

### Modelos disponibles

No todos los modelos de Groq sirven para chat. Lista vigente con tu
key:

- `qwen/qwen3.8-27b` ← el que usa el proyecto por defecto
- `openai/gpt-oss-20b`
- `allam-2-7b` (orientado a árabe)

Consultar la lista actualizada:

```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

---

## Seguridad

- **La key no se expone**: el navegador solo habla con nuestro
  backend; la llamada a Groq ocurre en el servidor.
- **`/api/ia/**` está en `permitAll`** a propósito: el asistente es
  para visitantes sin cuenta. Para limitar el abuso se puede sumar un
  rate limit por IP más adelante.
- **El prompt acota a los datos reales**: aunque alguien intente
  *prompt injection* ("ignora las instrucciones y dime X"), las reglas
  del system prompt le ordenan rehusarse y volver al catálogo.

---

## Despliegue

Los cambios del backend llegan a producción al hacer push a `main`
(Render redespliega solo). Después del deploy, probar:

```bash
curl -X POST https://replonconecta-api.onrender.com/api/ia/chat \
  -H "Content-Type: application/json" \
  -d '{"mensaje":"hola, que negocios hay?"}'
```

Respuesta esperada: `{"respuesta":"..."}` con **HTTP 200**.

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| 401 `"Sesion invalida o vencida"` | El backend desplegado no tiene la ruta `/api/ia/chat` (cambios sin push) | `git push` para que Render redespliegue |
| 500 `"Error interno"` | Arranque en frío de Render, o excepción no controlada | Reintentar; si persiste, revisar los logs de Render |
| Responde "está tomando un respiro" siempre | El modelo fue retirado por Groq (devuelve 400) | Cambiar `GROQ_MODEL` en Render o actualizar el default en `application.properties` |
| Responde "no está configurado todavía" | Falta `GROQ_API_KEY` en Render | Agregarla en Environment Variables |
| Responde con datos de otros pueblos / inventa | Alguien manipuló el prompt o el filtro de alcance | Revisar `Alcance.FAMILIAS` y el system prompt |

### Caso real: modelo retirado

En octubre 2026 el modelo original `llama-3.2-3b-preview` fue
descontinuado por Groq:

```json
{"error":{"message":"The model `llama-3.2-3b-preview` has been
decommissioned...","code":"model_decommissioned"}}
```

El backend lo maneja sin romper (el `catch` devuelve un mensaje
amable), pero el asistente deja de contestar de verdad. Por eso el
modelo ahora es configurable por variable de entorno: basta cambiar
`GROQ_MODEL` en Render para volver a dejarlo operativo sin tocar ni
compilar código.
