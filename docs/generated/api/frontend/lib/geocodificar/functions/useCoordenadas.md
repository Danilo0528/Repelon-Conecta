[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/geocodificar](../README.md) / useCoordenadas

# Function: useCoordenadas()

> **useCoordenadas**(`negocios`): `Record`\<`string`, [`Punto`](../type-aliases/Punto.md)\>

Defined in: [lib/geocodificar.ts:100](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/geocodificar.ts#L100)

Mapa `id del negocio -> coordenada` para los que no la tienen.

El valor solo cambia cuando aparece una coordenada nueva, así que el
mapa no vuelve a encuadrar en cada tecla que se teclea.

## Parameters

### negocios

[`ConDireccion`](../type-aliases/ConDireccion.md)[]

## Returns

`Record`\<`string`, [`Punto`](../type-aliases/Punto.md)\>
