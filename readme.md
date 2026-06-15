# UBCab Design System

A brand & UI system for **UBCab** — Mongolia's national mobility and logistics super-app. The system anchors on UBCab's vivid orange, friendly rounded display type, the self-hosted Calibri corporate font, and the parcel/route iconography seen across the **UBCab Express** sub-brand.

> **Tagline:** Хялбар. Найдвартай. Хурдан. — *Easy. Reliable. Fast.*
> **Mission:** Driving Mongolia forward by connecting people, places & businesses with more efficient solutions.

---

## 1. Company & product context

UBCab Holding LLC operates a multi-service app used across 16+ areas of Mongolia, with 74K+ drivers and 1.4M+ users. The platform spans several products under one brand:

| Product | What it is | One-liner |
|---|---|---|
| **UBCab (Ride)** | On-demand taxi / ride-hailing (Standard, XL, SUV) | "Anywhere, anytime, your ride awaits." |
| **UBEats** | Food delivery | "Delivering healthy and delicious food, right on time." |
| **UBCab Express** | On-demand parcel / cargo delivery, insured | "Fast delivery, insured service." |
| **CabPay** | In-app wallet & online payment | "All-in-one seamless payment." |
| **UBCab Rent** | Driver-included car rental (web only) | "Your private ride." |

### Sources used to build this system
- **Uploaded brand assets** (`uploads/`): UBCab Express business card, two campaign posters ("НҮҮХЭД ХЯЛБАР БОЛЛОО" moving promo; "АЧАА ТЭЭВРИЙН ХҮРГЭЛТ" cargo illustration), and a photographic courier ad ("ЯМАР Ч НӨХЦӨЛД ТАНЫ ИЛГЭЭМЖИЙГ ОРУУЛЖ ӨГНӨ").
- **Uploaded brand font**: Calibri (regular / italic / bold / bold-italic) — now self-hosted in `fonts/`.
- **Public website**: https://www.ubcab.mn (and /en, /express). Product structure, copy and stat figures were read from the live site. App store listings (UBCab on Google Play & App Store) for tone of voice.
- Brand colors were **sampled directly** from the uploaded raster assets (primary orange = `#F78320`).

> ⚠️ No product **codebase** or **Figma** file was provided. The app UI kit is a brand-faithful *interpretation* built from the visual assets, public site, and known feature set — not a pixel copy of the shipping app screens. Provide the app repo or Figma to tighten fidelity.

---

## 2. Content fundamentals (voice & copy)

- **Bilingual, Mongolian-first.** Primary copy is Mongolian Cyrillic; English is used as a confident secondary (taglines, product names). Product names stay in Latin: *Ride, Eats, Express, Rent, CabPay*.
- **Tone:** confident, warm, plain-spoken and action-first. Short imperative verbs in the UI: *Захиалах* (Order), *Илгээх* (Send), *Залгах* (Call). Marketing lines are punchy and benefit-led: "НҮҮХЭД ХЯЛБАР БОЛЛОО" (Moving just got easy), "Ямар ч нөхцөлд таны илгээмжийг оруулж өгнө" (We deliver your package, whatever it takes).
- **Casing:** Mongolian headlines often set ALL-CAPS in posters for impact; in-app titles use sentence case. English product names are Title Case.
- **Person:** speaks *to* the user ("таны" / "your"), warm and direct. Light, friendly — a single 👋 emoji appears in greetings, but emoji are **not** a core device. Avoid emoji in transactional/system copy.
- **Numbers & money:** currency is Mongolian tögrög, written `₮6,500` (symbol prefix, comma thousands). Set fares, codes and plate numbers in the mono face for alignment.
- **Vibe:** trustworthy national-scale utility with a human, neighbourly warmth — not slick fintech minimalism, not playful toy.

---

## 3. Visual foundations

- **Color:** one dominant brand color — **orange `#F78320`** — used boldly as full-bleed campaign backgrounds and primary CTAs. A **gold/yellow `#FDB714`** accent marks routes, highlights and "bonus" moments (the route line on the business card). Neutrals run from a warm near-black ink `#141414` to a sampled light-gray page surface `#F3F3F3`. Status greens/reds/blues are reserved for system feedback. Keep to orange + one neutral per surface; let orange do the talking.
- **Type:** **Nunito** (rounded, heavy) for display/marketing headlines — friendly and punchy, echoing the logo's rounded forms. **Calibri** (self-hosted brand font) for all UI and body text. **Roboto Mono** for fares, tracking IDs, plate numbers. Display sets tight (`-0.02em`, line-height ~1.08) and very heavy (800–900).
- **Backgrounds:** three signature treatments — (1) **solid orange** field for campaigns; (2) **real photography** with a dark bottom protection-gradient for legibility; (3) **light-gray map/grid texture** behind playful **hand-drawn line illustrations** of Ulaanbaatar landmarks & vehicles. Plus **3D isometric** product renders (room-in-a-box). No purple gradients, no glassmorphism on marketing.
- **Shape & radius:** soft and rounded throughout. App icon is a squircle; **buttons are full pills** (`--radius-control: 999px`); cards use 20px; inputs 14px; bottom sheets 28px top corners.
- **Elevation:** soft, low-contrast, warm-neutral shadows (`rgba(20,20,20,…)`). Primary CTAs and live elements carry a subtle **orange glow** (`--shadow-brand`). Bottom sheets use an upward shadow.
- **Borders:** hairline `1px` neutral borders on cards/inputs; selected states switch the border to brand orange + a soft focus ring.
- **Hover / press:** hover lifts cards 2px and deepens the shadow; buttons scale to `0.97` on press (no color flip needed — the pill + glow already read as tappable). Selected list items tint to `--orange-50` with an orange border.
- **Motion:** quick and confident. `--ease-standard` cubic-bezier(0.2,0,0,1), 120–320ms. Live tracking dots/cars ease linearly along routes. Avoid bounce on UI; reserve playfulness for marketing.
- **Imagery mood:** warm, real, local — Ulaanbaatar streets, families, couriers in UBCab orange. Photography is naturalistic (not desaturated, not heavily graded). Illustrations are loose hand-drawn line art with muted fills.
- **Cards:** white surface, 20px radius, hairline border + soft `sm` shadow; interactive cards lift on hover.

---

## 4. Iconography

- **System icons:** UBCab uses a **clean, single-weight line-icon** style (the site's `static/vectors/icon-*.svg` set — phone, info, menu, mail, coin-hand, bolt, coins, shield, social). We could not fetch those SVGs directly, so this system substitutes **[Lucide](https://lucide.dev)** (loaded from CDN) as the closest match: 2px stroke, rounded line caps/joins, geometric. ⚠️ *Substitution — replace with UBCab's own icon SVGs when available; copy them into `assets/` and swap the `Icon` helper.*
- **Brand mark:** the UBCab Express **parcel-cube** mark — a white 3D box with a tracking node inside an orange squircle — is reproduced as a crisp vector at `assets/logo-mark.svg` (faithful recreation; use the official file if you have it). Full lockups (`ubcab express`) are in `assets/logo-express-dark.png` (on light) and `assets/logo-express-white.png` (on brand).
- **Emoji:** used sparingly in friendly greetings only (👋). Never in transactional UI.
- **Money/route glyphs:** the tögrög symbol `₮` and route dots (filled circle = pickup, rounded square = drop-off) are recurring functional marks.

---

## 5. Files & index (manifest)

**Foundations**
- `styles.css` — root entry; `@import`s every token + font file (link this one file).
- `tokens/fonts.css` — Calibri @font-face (self-hosted) + Nunito & Roboto Mono (CDN).
- `tokens/colors.css` — orange scale, gold accent, neutrals, status + semantic aliases.
- `tokens/typography.css` — families, weights, type scale, roles.
- `tokens/spacing.css` — 4px grid, paddings, containers, z-index.
- `tokens/radius.css` — radii, elevation/shadows, focus ring, motion.

**Specimen cards** (`guidelines/*.card.html`) — render in the Design System tab: Colors (Brand, Accent & Status, Neutrals), Type (Display, Body, Scale), Spacing (Scale, Radii, Elevation), Brand (Logo, Imagery, Voice).

**Components** (`components/`)
- `core/` — `Button`, `Badge`, `Input`, `Card`, `Avatar`, `Switch`.
- `product/` — `ServiceTile` (super-app service launcher).
- Each: `<Name>.jsx` + `.d.ts` + `.prompt.md`; one `*.card.html` per directory.

**UI kits** (`ui_kits/`)
- `app/` — UBCab super-app interactive recreation: `index.html` + `app.jsx` (Home · Ride · Tracking · Express) + `ios-frame.jsx`.

**Assets** (`assets/`) — `logo-mark.svg`, `logo-express-dark.png`, `logo-express-white.png`, `illustration-room-box.png`, `illustration-cargo-city.png`, `photo-courier.jpg`.

**Other** — `SKILL.md` (Agent Skill entry point), `fonts/` (Calibri ttf).

---

## 6. Using this system
- Link `styles.css` and use the CSS custom properties — never hardcode hex/px.
- Compose with the React components (`window.UBCabDesignSystem_f65ba7.*` once the bundle is loaded); don't re-implement primitives inside kits.
- For marketing artifacts: lean into bold orange grounds, Nunito headlines, real photography or hand-drawn line illustration, and the parcel mark.
