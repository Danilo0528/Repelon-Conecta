[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/subirImagen](../README.md) / subirImagen

# Function: subirImagen()

> **subirImagen**(`carpeta`, `id`, `archivo`): `Promise`\<`string`\>

Defined in: [lib/subirImagen.ts:76](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/subirImagen.ts#L76)

Sube `archivo` al bucket y devuelve su URL pública.

Lanza Error con mensaje listo para mostrarle al estudiante: cada
fallo posible (sin configurar, sin sesión, bucket inexistente, RLS)
dice qué hacer, no un código crudo de Supabase.

## Parameters

### carpeta

[`CarpetaFotos`](../type-aliases/CarpetaFotos.md)

### id

`string`

### archivo

`File`

## Returns

`Promise`\<`string`\>
