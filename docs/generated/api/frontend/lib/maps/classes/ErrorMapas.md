[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/maps](../README.md) / ErrorMapas

# Class: ErrorMapas

Defined in: [lib/maps.ts:150](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/maps.ts#L150)

Fallo de carga del mapa, con el motivo a mano para que la pantalla
pueda decirle al usuario qué salió mal en vez de dejar un hueco gris.

## Extends

- `Error`

## Constructors

### Constructor

> **new ErrorMapas**(`motivo`): `ErrorMapas`

Defined in: [lib/maps.ts:153](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/maps.ts#L153)

#### Parameters

##### motivo

[`MotivoFalloMapas`](../type-aliases/MotivoFalloMapas.md)

#### Returns

`ErrorMapas`

#### Overrides

`Error.constructor`

## Properties

### motivo

> `readonly` **motivo**: [`MotivoFalloMapas`](../type-aliases/MotivoFalloMapas.md)

Defined in: [lib/maps.ts:151](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/maps.ts#L151)
