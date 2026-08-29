/**
 * Renders the app icons from a single inline SVG source.
 *
 *   pnpm icons
 *
 * Keeping this as a script means the icon set can be regenerated after a
 * rebrand instead of being a set of opaque binaries in the repository.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const ACCENT = '#0f5f56'
const INK = '#faf9f7'

/** `padding` leaves the safe zone maskable icons need. */
function svg({ size, radius, padding, background = ACCENT, mark = INK }) {
  const inner = size - padding * 2
  const stroke = Math.max(2, inner * 0.115)
  const top = padding + inner * 0.26
  const bottom = padding + inner * 0.8
  const left = padding + inner * 0.14
  const right = padding + inner * 0.68
  const mid = (left + right) / 2
  const dotR = inner * 0.085
  const dotX = padding + inner * 0.88
  const dotY = padding + inner * 0.27

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${background}"/>
  <path d="M ${left} ${top} L ${mid} ${bottom} L ${right} ${top}"
        fill="none" stroke="${mark}" stroke-width="${stroke}"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${dotX}" cy="${dotY}" r="${dotR}" fill="${mark}"/>
</svg>`
}

const OUT = 'public/icons'
mkdirSync(OUT, { recursive: true })

const targets = [
  { file: 'icon-192.png', size: 192, radius: 42, padding: 24 },
  { file: 'icon-512.png', size: 512, radius: 112, padding: 64 },
  { file: 'icon-maskable-192.png', size: 192, radius: 0, padding: 38 },
  { file: 'icon-maskable-512.png', size: 512, radius: 0, padding: 102 },
  { file: 'apple-touch-icon.png', size: 180, radius: 0, padding: 26 },
]

for (const target of targets) {
  const source = Buffer.from(svg(target))
  const png = await sharp(source).png({ compressionLevel: 9 }).toBuffer()
  writeFileSync(`${OUT}/${target.file}`, png)
  console.log(`wrote ${OUT}/${target.file} (${png.length} bytes)`)
}

// Scalable icon for the browser tab and anywhere SVG is accepted.
writeFileSync('public/icons/icon.svg', svg({ size: 64, radius: 14, padding: 8 }))
writeFileSync('public/favicon.svg', svg({ size: 64, radius: 14, padding: 8 }))

const ico = await sharp(Buffer.from(svg({ size: 64, radius: 14, padding: 8 })))
  .resize(32, 32)
  .png()
  .toBuffer()
writeFileSync('public/favicon.png', ico)
console.log('wrote public/favicon.svg and public/favicon.png')

// Open Graph card: the same mark on paper with the product name.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf9f7"/>
  <rect x="0" y="0" width="1200" height="8" fill="${ACCENT}"/>
  <text x="88" y="300" font-family="Georgia, serif" font-size="96" fill="#14120f">Verba</text>
  <circle cx="352" cy="272" r="13" fill="${ACCENT}"/>
  <text x="90" y="372" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="34" fill="#6b665e">You recognise thousands of English words.</text>
  <text x="90" y="420" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="34" fill="#6b665e">Can you recall them in time?</text>
  <text x="90" y="536" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="26" fill="${ACCENT}" letter-spacing="3">ACTIVE RECALL TRAINING</text>
</svg>`
const ogPng = await sharp(Buffer.from(og)).png().toBuffer()
writeFileSync('public/og.png', ogPng)
console.log('wrote public/og.png')
