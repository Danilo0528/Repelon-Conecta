[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/useDatos](../README.md) / useDatos

# Function: useDatos()

> **useDatos**\<`T`\>(`cargar`, `deps?`): `object`

Defined in: [lib/useDatos.ts:12](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/useDatos.ts#L12)

## Type Parameters

### T

`T`

## Parameters

### cargar

() => `Promise`\<`T`\>

### deps?

readonly `unknown`[] = `[]`

## Returns

`object`

### datos

> **datos**: `T` \| `null`

### cargando

> **cargando**: `boolean`

### error

> **error**: `string` \| `null`

### setDatos

> **setDatos**: `Dispatch`\<`SetStateAction`\<`T` \| `null`\>\>
