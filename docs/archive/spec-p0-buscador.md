# Spec — P0: Buscador "¿dónde consigo X?" + perfil del vendedor + WhatsApp

**Estado:** listo para implementar (`ready-for-agent`) · **Fecha:** oct. 2026
**Fuente:** `docs/estado-del-proyecto.md` y `docs/cuestionario-cliente.md` (28/28 preguntas cerradas)
**Plazo acordado:** 5 días

---

## Problem Statement

Un vecino o visitante de Repelón no sabe **quién tiene un producto ni
dónde conseguirlo**. Hoy la plataforma solo lista negocios por nombre; si
escribas "20 kilos de yuca" no aparece nada que te diga dónde está la yuca,
a cuánto está ni quién la vende. Los negocios agrícolas y pesqueros del
pueblo no tienen una vitrina digital, y la gente termina preguntando de
puerta en puerta o por WhatsApp a ciegas.

## Solution

Un **buscador público** donde cualquiera escriba lo que necesita (por
ejemplo "yuca" o "pescado fresco") y vea **al instante, en lista y en el
mapa al mismo tiempo**, los negocios que lo tienen — con **precio (en kilos
y libras), barrio y estado** — y de ahí entre al **perfil del vendedor**
para ver su catálogo, su ubicación y escribirle **por WhatsApp**. La app es
solo intermediaria: no cobra, no consulta, no notifica; todo el trato
cierra el vecino con el dueño en WhatsApp.

## User Stories

1. As a visitante, I want to search for a product (e.g. "yuca") and see which businesses have it, so that I know where to go.
2. As a visitante, I want my search results shown as a **list** (product, price, business, barrio) **and as highlighted pins on the map at the same time**, so that the result is dynamic and easy to locate.
3. As a visitante, I want to see the **price** of each product without logging in, so that I can compare before writing to anyone.
4. As a visitante, I want prices expressed in **kilos and libras** (the units this town uses), so that I understand what I'm paying for.
5. As a visitante, I want to filter results by **category (agro · pesca · turismo)** and by **barrio**, so that I narrow down what's near me.
6. As a visitante, I want to click a result and open the **seller's profile** (products with photos, address, hours, map, phone), so that I can verify before going.
7. As a visitante, I want a **WhatsApp button** on the seller's profile that opens a chat with the owner (wa.me link with the product pre-filled), so that we close the deal directly there.
8. As a visitante, I want to browse a **general map of all the businesses** of Repelón with a search box on top, so that I can explore even without knowing what I want.
9. As a visitante, I want a **Turismo section** showing addresses and tourist zones of the town (no products, no prices), so that visitors can find those places.
10. As a visitante, I want to use search and profiles **without creating an account**, so that nothing gets in the way.
11. As a visitante, I want the app to work on **mobile and desktop**, so that it works however I open it.
12. As a visitante, I want **no cart, no checkout, no in-app orders and no money handling**, so that the app stays a simple directory that ends in WhatsApp.
13. As a visitante, I want the catalog to only show **agricultural, fishing and tourism businesses** (ferreterías, droguerías y tiendas fuera), so that results match what the pueblo's project is about.
14. As a estudiante-admin, I want a search that returns **products joined with their business** (name, barrio, open state, coordinates), so that the list and the map can be drawn from one call.
15. As a estudiante-admin, I want to **create and edit products with a unit field (kilo | libra)**, so that prices are unambiguous.
16. As a estudiante-admin, I want the catalog categories reduced to **agro, pesca y turismo**, so that the screens don't show out-of-scope businesses.
17. As a estudiante-admin, I want the existing **business management panel** (create, edit, approve, highlight) to keep working as before, so that I can operate the directory.
18. As a cliente/admin inicial, I want the **"Carrito", "Checkout" and "Mis pedidos" entry points hidden** from navigation and direct URLs redirected home, so that users only see the intermediary flow.
19. As a visitante, I want each business profile to show its **WhatsApp/phone prominently**, so that contact is one tap away.
20. As a visitante, I want search to work **without interpreting quantities** ("20 kilos" still matches "yuca"), so that simple text matching is enough.
21. As a estudiante-admin, I want search to consider only **approved** businesses, so that unapproved ones never appear publicly.
22. As a visitante, I want empty results to show a helpful empty state (with the search term and a hint), so that I know nothing matched.
23. As a visitante, I want opening hours/`abierto` state visible per business in the list, so that I don't travel to a closed shop.
24. As a visitante, I want the home page to keep the approved template design, so that the first impression matches what was approved.
25. As a visitante, I want related products from different businesses to appear side by side with their prices, so that I can compare where to buy.

## Implementation Decisions

- **Search is the core seam.** One public search endpoint answers with
  products joined to their business: `GET /api/buscar?q=&categoria=&barrio=`
  → `[{ producto: { id, nombre, precio, unidad, imagenUrl }, negocio: {
  id, slug, nombre, barrio, abierto, latitud, longitud, whatsapp } }]`.
  The existing negocios-texto search is kept for business-name search but
  the UI search box uses the new endpoint.
- **Matching:** tokenized case-insensitive substring match (ILIKE) over
  product name + description; digits are ignored so "20 kilos de yuca"
  matches "yuca". Full-text search (tsvector) is deliberately deferred.
- **Schema change:** products gain a `unidad` column (`KILO` | `LIBRA`),
  backfilled from the seed where the unit was embedded in the name.
  Seed data is normalized to the three families: agro, pesca, turismo.
- **Scope filter everywhere public:** listados, home y búsqueda solo
  muestran negocios `aprobado = true` y de categorías agro/pesca/turismo.
  Turismo no expone productos ni precios: es una sección de direcciones y
  zonas turísticas.
- **Results = list + map in one view.** The search screen renders the
  result list and the Leaflet map together; every result with coordinates
  becomes a pin, and pins correspond to the list (results without
  coordinates simply don't get a pin).
- **Seller profile is the terminal screen:** products with photo/price/unit,
  embedded map ("cómo llegar"), hours, and a **WhatsApp CTA** built as a
  `wa.me/<numero>?text=<mensaje>` link prefilled with the product and
  business name. Same CTA in the search results.
- **Intermediary-only flow:** cart, checkout, order screens and
  address book are **hidden, not deleted** (nav links removed, routes
  redirected home, server endpoints left in place) so a future request can
  re-enable them.
- **No auth required** for home, search, map, turismo and profiles.
  Existing seller/admin panels keep their current role checks; granting
  the initial ADMIN role is an SQL task outside this spec.
- **Layout:** keeps the approved template design and the desktop/mobile
  grid work already delivered; no new visual language.
- **Tech stays as is:** Spring Boot + PostgreSQL backend, Next.js/React +
  Tailwind frontend, Supabase for storage/auth. No new services.

## Testing Decisions

- **Good tests** assert external behavior through the service seam: given
  a seed of businesses/products, a search returns exactly the matching
  products with their business data, respects the approved flag and the
  category filter, and ignores digits in the query. No assertions on
  repository internals or SQL shape.
- **Primary seam: the search service** (highest module that owns the
  behavior). Repository calls are exercised against the real schema via
  Spring's test slice; this is the single test seam introduced by this
  spec.
- **Prior art:** the backend only has a Spring context smoke test; there
  are no frontend tests. This spec introduces the first real backend
  tests; frontend correctness is guarded by `tsc --noEmit`, `eslint` and
  `next build`, plus the manual checklist (celular y computador) agreed
  with the client.
- **Regression guard:** unit backfill and category reduction get a seed
  test (fresh database boots with KILO/LIBRA units and only the three
  families).

## Out of Scope

- Cart, checkout, in-app orders, payments, notifications (explicitly
  removed from v1 by the client; code kept but hidden).
- Photo upload to Supabase Storage (P1 — placeholder images remain until
  then).
- Precise geocoding tuning (viewbox/bounded) — client confirms locations
  are fine today (P1).
- Quantity interpretation ("20 kilos" is not parsed), stock/season
  alerts, in-app messaging.
- Admin expansion (users, orders, categories UI), CMS/editable home
  texts, tests beyond the search service (P2/P3).
- Real client materials (logo, photos, texts) and the list of real
  businesses — delivered later, seeded with example data meanwhile.
- The SQL `UPDATE usuarios SET rol='ADMIN'` for the initial admin
  (pending, run in Supabase when instructed).

## Further Notes

- **5-day deadline:** order of work = search (list+map) → seller profile
  with WhatsApp → category reduction + hiding of cart/checkout → turismo
  section → polish.
- Client decisions are auditable in `docs/cuestionario-cliente.md`
  (28/28 closed) and summarized in `docs/estado-del-proyecto.md`.
- `docs/resumen-para-el-cliente.md` is the client-facing summary; keep it
  in sync if scope shifts during implementation.
- The project is a student fair demo: prioritise a visible, working
  search over backend elegance; everything must be documented for the
  fair.
