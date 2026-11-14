const fs = require("fs");
const html = fs.readFileSync("docs/SRS_Repelon_Conecta_Completo.html", "utf8");

const oldSnippet =
  "<tr><td>RF-35</td><td>GET /api/cultura/publicaciones público; escribir (POST/PUT/DELETE) exige ADMIN.</td>";
const replacement =
  '<tr><td>RF-35</td><td>GET /api/cultura/publicaciones público; escribir (POST/PUT/DELETE) exige ADMIN.</td></tr>\n<tr><td>RF-44</td><td>POST /api/cultura/publicaciones crea entrada de feed; requiere rol ADMIN.</td><td><span class="badge-e">E</span></td><td>CulturaController.crear(), SecurityConfig</td></tr>\n<tr><td>RF-45</td><td>PUT/DELETE /api/cultura/publicaciones/{id} edita o elimina entrada; requiere rol ADMIN.</td><td><span class="badge-e">E</span></td><td>CulturaController.actualizar/eliminar()</td>';

if (html.includes(oldSnippet)) {
  html = html.replace(oldSnippet, replacement);
  fs.writeFileSync("docs/SRS_Repelon_Conecta_Completo.html", html, "utf8");
  console.log("SUCCESS UPDATED");
} else {
  console.log("SNIPPET NOT FOUND");
}
