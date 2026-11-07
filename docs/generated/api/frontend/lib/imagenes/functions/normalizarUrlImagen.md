[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/imagenes](../README.md) / normalizarUrlImagen

# Function: normalizarUrlImagen()

> **normalizarUrlImagen**(`url`): `string`

Defined in: [lib/imagenes.ts:30](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/imagenes.ts#L30)

Normaliza URLs de imagen para que funcionen como <img src>.

Imgur: "https://imgur.com/abc123" no sirve como imagen directa;
necesita "https://i.imgur.com/abc123.jpg". Las URLs que ya apuntan a
i.imgur.com o que no son de Imgur pasan sin tocar.

## Parameters

### url

`string`

## Returns

`string`
