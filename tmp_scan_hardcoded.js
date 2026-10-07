// Script temporaire : détecte les textes en dur (non traduits) dans une page JSX
const fs = require("fs");

function scan(file) {
  const src = fs.readFileSync(file, "utf8");
  const lines = src.split(/\r?\n/);
  console.log("=== " + file + " ===");
  lines.forEach((l, i) => {
    if (l.includes("t(")) return;
    if (!/label=|placeholder=/.test(l)) {
      const m = l.match(/>\s*([A-ZÀ-Ý0-9][^<>{}\n]{3,}?)\s*<\/(h\d|p|span|a|button|div)>/) ||
                l.match(/>\s*([A-ZÀ-Ý][^<>{}\n]{3,}?)\s*\{/);
      if (m) console.log(i + 1 + ": " + m[1].trim());
    } else if (!/\bt\(/.test(l)) {
      const m = l.match(/(?:label|placeholder)="([^"]+)"/);
      if (m) console.log(i + 1 + ": [attr] " + m[1]);
    }
  });
}

scan("app/[locale]/login/page.jsx");
scan("app/[locale]/register/page.jsx");
scan("app/[locale]/forgot-password/page.jsx");
