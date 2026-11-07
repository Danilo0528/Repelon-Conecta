[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/cultura](../README.md) / PublicacionCulturaApi

# Type Alias: PublicacionCulturaApi

> **PublicacionCulturaApi** = `object`

Defined in: [lib/cultura.ts:61](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/cultura.ts#L61)

Lo que devuelve GET /api/cultura/publicaciones (panel de admin →
backend Spring). El feed lo traduce con `aPublicacion` para no
mezclar el contrato del servidor con el modelo de pintura.

## Properties

### id

> **id**: `string`

Defined in: [lib/cultura.ts:62](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/cultura.ts#L62)

***

### autor

> **autor**: `string`

Defined in: [lib/cultura.ts:63](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/cultura.ts#L63)

***

### lugar

> **lugar**: `string` \| `null`

Defined in: [lib/cultura.ts:64](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/cultura.ts#L64)

***

### fecha

> **fecha**: `string`

Defined in: [lib/cultura.ts:66](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/cultura.ts#L66)

yyyy-mm-dd.

***

### texto

> **texto**: `string`

Defined in: [lib/cultura.ts:67](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/cultura.ts#L67)

***

### tipo

> **tipo**: `string`

Defined in: [lib/cultura.ts:69](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/cultura.ts#L69)

"FOTO" o "VIDEO".

***

### mediaUrl

> **mediaUrl**: `string`

Defined in: [lib/cultura.ts:71](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/cultura.ts#L71)

URL de la foto, o ID/enlace de YouTube, o URL de archivo .mp4.

***

### credito

> **credito**: `string` \| `null`

Defined in: [lib/cultura.ts:72](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/cultura.ts#L72)
