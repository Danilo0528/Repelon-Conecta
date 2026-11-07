[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/subirImagen](../README.md) / subirVideo

# Function: subirVideo()

> **subirVideo**(`carpeta`, `id`, `archivo`): `Promise`\<`string`\>

Defined in: [lib/subirImagen.ts:134](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/subirImagen.ts#L134)

Sube un video (mp4/webm) al bucket y devuelve su URL pública.

Misma vía que `subirImagen` (sesión del admin, clave pública, políticas
RLS del bucket), pero sin redimensionar: el navegador manda el archivo
tal cual y el límite es de 60 MB para que un video de celular no llene
el bucket. Los mensajes de error son los mismos que los de la imagen,
ya que las causas (sin configurar, sin sesión, bucket, RLS) son las
mismas.

## Parameters

### carpeta

[`CarpetaFotos`](../type-aliases/CarpetaFotos.md)

### id

`string`

### archivo

`File`

## Returns

`Promise`\<`string`\>
