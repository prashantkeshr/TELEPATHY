// Regenerates every raster icon from public/favicon.svg (the single source of
// truth for the mark): PNG sizes, maskable PNG, a real multi-size favicon.ico,
// and the 1200x630 social image. Run manually after changing the logo:
//   node scripts/generate-icons.mjs
// Also verifies the mark is centred in its tile, so alignment is measured.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PUB = join(import.meta.dirname, "..", "public");
const svg = readFileSync(join(PUB, "favicon.svg"));
const render = (size) => sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 });

for (const size of [16, 32, 48, 180, 192, 512]) {
  await render(size).toFile(join(PUB, `icon-${size}.png`));
}

// Maskable: platforms crop to a circle/squircle, so keep the mark inside the
// central safe zone (~70%) on a solid background.
const inner = Math.round(512 * 0.7);
const pad = Math.round((512 - inner) / 2);
await sharp(svg, { density: 384 })
  .resize(inner, inner)
  .extend({ top: pad, bottom: 512 - inner - pad, left: pad, right: 512 - inner - pad, background: "#0B0C10" })
  .png({ compressionLevel: 9 })
  .toFile(join(PUB, "icon-512-maskable.png"));

// favicon.ico: PNG-compressed entries at 16/32/48 (supported by every modern
// browser and by Google's favicon fetcher, which wants multiples of 48px).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => render(s).toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt16LE(1, 4); // planes
  e.writeUInt16LE(32, 6); // bit depth
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
writeFileSync(join(PUB, "favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));

await sharp(join(PUB, "og-image.svg"), { density: 144 }).resize(1200, 630).png({ compressionLevel: 9 }).toFile(join(PUB, "og-image.png"));

// Alignment check: render the mark alone (no tile) and measure its bounding
// box against the canvas; margins on opposite sides should match.
const markOnly = Buffer.from(
  svg.toString().replace(/<rect[^>]*\/>/, ""),
);
const { data, info } = await sharp(markOnly, { density: 384 }).resize(512, 512).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 16) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
}
const m = { left: minX, right: info.width - 1 - maxX, top: minY, bottom: info.height - 1 - maxY };
console.log("mark margins at 512px:", m);
const off = Math.max(Math.abs(m.left - m.right), Math.abs(m.top - m.bottom));
if (off > 4) throw new Error(`mark is off-centre by ${off}px at 512px`);
console.log("icons regenerated; mark centred within", off, "px");
