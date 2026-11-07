[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/geocodificar](../README.md) / conCoordenadas

# Function: conCoordenadas()

> **conCoordenadas**\<`T`\>(`negocios`, `coordenadas`): `T`[]

Defined in: [lib/geocodificar.ts:157](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/geocodificar.ts#L157)

Devuelve la lista con las coordenadas recién resueltas ya puestas en
cada negocio. Los que ya traían latitud/lng de la base no se tocan.

## Type Parameters

### T

`T` *extends* [`ConDireccion`](../type-aliases/ConDireccion.md)

## Parameters

### negocios

`T`[]

### coordenadas

`Record`\<`string`, [`Punto`](../type-aliases/Punto.md)\>

## Returns

`T`[]
