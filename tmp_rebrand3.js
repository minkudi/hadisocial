const fs = require("fs");

const targets = [
  "app",
  "lib",
  "messages",
  ".env.example",
];

const replacements = [
  [/HADI SOCIAL/g, "SCAP BEN"],
  [/Hadi Social/g, "SCAP BEN"],
  [/contact@hadisocial\.com/g, "contact@scap-ben.com"],
  [/no-reply@hadisocial\.com/g, "no-reply@scap-ben.com"],
  [/contact@scap-ben\.com/g, "contact@scap-ben.com"],
];

function scan(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  let total = 0;
  for (const item of items) {
    const full = dir + "/" + item.name;
    if (item.isDirectory()) {
      total += scan(full);
    } else {
      const buf = fs.readFileSync(full);
      if (buf.includes(0)) continue;
      let c = buf.toString("utf8");
      const before = c;
      for (const [re, repl] of replacements) c = c.replace(re, repl);
      if (c !== before) {
        fs.writeFileSync(full, c, "utf8");
        console.log(full);
        total++;
      }
    }
  }
  return total;
}

let total = 0;
for (const t of targets) {
  if (fs.existsSync(t)) total += scan(t);
}
console.log("FICHIERS MODIFIES: " + total);
