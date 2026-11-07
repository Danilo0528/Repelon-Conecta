[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/turismo](../README.md) / zonaALugar

# Function: zonaALugar()

> **zonaALugar**(`zona`): [`LugarTuristico`](../type-aliases/LugarTuristico.md)

Defined in: [lib/turismo.ts:149](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/lib/turismo.ts#L149)

Zona cargada por el estudiante en el panel → ficha del home.

`motivo` llega como texto de la base: lo que no coincida con una
ilustración conocida (o venga vacío) cae en "pueblo" para que la
ficha siempre tenga fondo dibujado.

## Parameters

### zona

[`ZonaTuristica`](../../tipos/interfaces/ZonaTuristica.md)

## Returns

[`LugarTuristico`](../type-aliases/LugarTuristico.md)
