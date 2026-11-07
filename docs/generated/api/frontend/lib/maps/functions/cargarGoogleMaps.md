[**Repelón Conecta — Frontend API**](../../../README.md)

***

[Repelón Conecta — Frontend API](../../../README.md) / [lib/maps](../README.md) / cargarGoogleMaps

# Function: cargarGoogleMaps()

> **cargarGoogleMaps**(): `Promise`\<`void`\>

Defined in: [lib/maps.ts:184](https://github.com/Danilo0528/Repelon-Conecta/blob/main/ReplonConecta/frontend/src/lib/maps.ts#L184)

Carga la API de Google Maps una sola vez, sin importar cuántos mapas
haya en la pantalla.

La API toca `window` al cargarse, así que va por un `<script>` puesto
aquí y no por un import estático: estas pantallas también se pintan en
el servidor durante el prerender y ahí no hay `window`. El `callback`
es la forma que Google ofrece para saber cuándo quedó lista la API
(el simple `onload` puede llegar antes que `google.maps`), con un
reloj de seguridad por si el navegador se queda esperando.

## Returns

`Promise`\<`void`\>
