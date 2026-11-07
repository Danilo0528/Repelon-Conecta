[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/cultura](../README.md) / PublicacionCultura

# Type Alias: PublicacionCultura

> **PublicacionCultura** = `object`

Defined in: [lib/cultura.ts:40](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/cultura.ts#L40)

Una publicación del feed de cultura.

## Properties

### id

> **id**: `string`

Defined in: [lib/cultura.ts:42](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/cultura.ts#L42)

ID estable: se usa como ancla (#pub-…) y como clave de "me gusta".

***

### autor

> **autor**: `string`

Defined in: [lib/cultura.ts:44](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/cultura.ts#L44)

Quién publica, p. ej. "Repelón Conecta" o una escuela/organización.

***

### lugar?

> `optional` **lugar?**: `string`

Defined in: [lib/cultura.ts:46](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/cultura.ts#L46)

Lugar o contexto. Si no hay, solo se muestra autor y fecha.

***

### fecha

> **fecha**: `string`

Defined in: [lib/cultura.ts:48](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/cultura.ts#L48)

Fecha de publicación en ISO (yyyy-mm-dd).

***

### texto

> **texto**: `string`

Defined in: [lib/cultura.ts:50](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/cultura.ts#L50)

Pie de la publicación.

***

### media

> **media**: [`MediaPublicacion`](MediaPublicacion.md)

Defined in: [lib/cultura.ts:51](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/cultura.ts#L51)

***

### meGusta

> **meGusta**: `number`

Defined in: [lib/cultura.ts:53](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/cultura.ts#L53)

Contador de "me gusta" de partida.
