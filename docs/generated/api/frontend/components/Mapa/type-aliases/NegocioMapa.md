[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [components/Mapa](../README.md) / NegocioMapa

# Type Alias: NegocioMapa

> **NegocioMapa** = `Pick`\<[`Negocio`](../../../lib/tipos/interfaces/Negocio.md), `"id"` \| `"nombre"` \| `"slug"` \| `"abierto"` \| `"barrio"` \| `"direccion"` \| `"latitud"` \| `"longitud"`\>

Defined in: [components/Mapa.tsx:35](https://github.com/Danilo0528/Repelon-Conecta/blob/2f374b1802c1ab4b248cb29f684e271ee789f890/ReplonConecta/frontend/src/components/Mapa.tsx#L35)

Lo mínimo que el mapa necesita para dibujar un pin: el negocio
completo (home) o el recorte que trae un resultado de búsqueda,
cumplen el mismo contrato y el componente no distingue.
