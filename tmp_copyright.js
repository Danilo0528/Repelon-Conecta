const fs = require("fs");

const files = [
  "docs/SRS_Repelon_Conecta_Completo.html",
  "docs/Preguntas_Cliente_Repelon_Conecta.html",
];

for (const f of files) {
  let c = fs.readFileSync(f, "utf8");
  if (!c.includes("\u00A9 2026 Equipo de Desarrollo")) {
    const footer =
      '\n<div style="margin-top:40px; font-size:8.5pt; color:#6b7280; border-top:1px solid #e5e7eb; padding-top:12px; text-align:center;">\u00A9 2026 Equipo de Desarrollo Repel\u00F3n Conecta. Todos los derechos reservados.</div>\n</body>';
    c = c.replace("</body>", footer);
    fs.writeFileSync(f, c, "utf8");
    console.log("Updated copyright in:", f);
  } else {
    console.log("Already has copyright:", f);
  }
}
