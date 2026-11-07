[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/ubicacion](../README.md) / useUbicacion

# Function: useUbicacion()

> **useUbicacion**(): `object`

Defined in: [lib/ubicacion.ts:100](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/ubicacion.ts#L100)

Ubicación actual, o el centro del pueblo mientras no se sepa.

Devuelve tambien `pidiendo` y `preguntado` para que la pantalla pueda
explicar en vez de dejar el boton igual. `pidiendo` evita el segundo
permiso si el usuario pulsa otra vez mientras la primera peticion
sigue en vuelo.

## Returns

`object`

### origen

> **origen**: [`OrigenRuta`](../type-aliases/OrigenRuta.md)

### pidiendo

> **pidiendo**: `boolean`

### preguntado

> **preguntado**: `boolean`

### pedir

> **pedir**: () => `void`

#### Returns

`void`
