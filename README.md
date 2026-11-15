# WEBLOOM — Digital Studio Website

A complete, production-style website for a web development agency, built with plain
**HTML, CSS and JavaScript**. No frameworks, no build step, no paid services or APIs.

## Preview

Open `index.html` in a browser, or serve the folder locally:

```bash
# Python 3
python -m http.server 8000
```

Then visit `http://localhost:8000`.

> For the best experience use a modern browser (Chrome, Edge, Firefox, Safari).
> The site works from the filesystem too — every image and script is local.

## Deploy on Vercel

This is a plain static site, so Vercel needs no build step. The only requirement is
that the **whole folder** is deployed — `index.html` must sit next to `css/`, `js/`
and `assets/` in the deployment. If any of those folders are missing you get the
classic symptom of a working page with unstyled content and 404s for every asset.

Project settings (Vercel dashboard → **Settings → Build & Development Settings**):

| Setting | Value |
| --- | --- |
| Framework Preset | **Other** |
| Root Directory | the folder that contains `index.html` (leave empty if it is the repo root) |
| Build Command | **off / empty** (no build) |
| Output Directory | **off / empty** (serve the repo root) |
| Install Command | **off / empty** (no dependencies) |

The included `vercel.json` pins those values (`framework`, `buildCommand`,
`installCommand` and `outputDirectory` are all `null`, i.e. plain static hosting).

No rewrites or redirects are needed. Do **not** add a catch-all rewrite such as
`"source": "/(.*)", "destination": "/index.html"` — that would answer missing assets
with the HTML page (status 200, wrong MIME type) instead of the real file.

### If assets return 404

Check the deployed file list first (Vercel → deployment → **Source** tab, or the git
repository). A 404 for `css/styles.css`, `js/main.js` or `assets/*.svg` while
`index.html` loads means those files were never committed or uploaded:

```bash
# from this folder, with the repo initialised
git add .
git status            # css/, js/ and assets/ must be listed
git commit -m "Add site assets"
git push
```

Uploading files through the GitHub web UI or deploying only `index.html` produces the
same result — add the `css/`, `js/` and `assets/` folders, then redeploy.

Verify after deploying; all of these must return **200**:

- `/` (or `/index.html`)
- `/css/styles.css`
- `/js/main.js`
- `/assets/webloom-mark.svg`
- `/assets/webloom-wordmark.svg`
- `/assets/work-nova.svg`

## What's included

- **Hero** with animated dashboard mockup, floating stat chips, cursor-reactive glow
  and animated counters.
- **Services** grid with spotlight hover effect and inline SVG icons.
- **Portfolio** with working category filters and six custom SVG project mockups.
- **About** section with layered imagery, retention badge, animated stats and team cards.
- **Pricing** with a monthly / one-time billing toggle and plan pre-fill on the contact form.
- **Testimonials** with ratings and client quotes.
- **Contact** form with inline validation, success state and a WhatsApp hand-off.
- **Floating WhatsApp button** with pulse animation and tooltip.
- **Social icons** (Instagram, Facebook, TikTok) in the footer and contact section,
  wired to `aria-label`s and ready for your profile URLs.
- Sticky glass navigation, scroll progress bar, active section highlighting,
  mobile fullscreen menu, scroll-reveal animations and back-to-top.
- Fully responsive from 320 px phones to large desktops.
- Accessibility touches: skip link, semantic landmarks, focus styles, ARIA states,
  labelled form fields, keyboard-closable mobile menu and `prefers-reduced-motion` support.

## File structure

```
.
├── index.html
├── robots.txt
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── favicon.svg
│   ├── webloom-mark.svg
│   ├── webloom-wordmark.svg
│   ├── work-nova.svg
│   ├── work-halcyon.svg
│   ├── work-lumen.svg
│   ├── work-pulse.svg
│   ├── work-orbital.svg
│   └── work-atlas.svg
└── README.md
```

## Customize it

### Brand name, copy and links

All content lives in `index.html`. Look for **WEBLOOM**, the email
`hello@webloom.studio`, the phone number and the social URLs, then replace them.

### Social media links

Instagram, Facebook and TikTok icons appear in the footer and in the contact
section. Their URLs are intentionally left empty and marked with comments in
`index.html`:

```html
<!-- Instagram URL: "" -->
<!-- Facebook URL:  "" -->
<!-- TikTok URL:    "" -->
```

Search for `SOCIAL MEDIA LINKS` in `index.html` and paste each profile URL into
the matching `href=""`. Each link already has an accessible `aria-label`.

### WhatsApp number

The number appears in three visible places (contact list, footer, floating button)
and in the `<body>` tag:

```html
<body data-whatsapp="201226866365">
```

`js/main.js` reads that value and synchronises every `wa.me` link on load. To change it:

1. Update `data-whatsapp` on `<body>`.
2. Update the visible number text (`+20 122 686 6365`) in the contact list and footer.
3. Replace `201226866365` inside the two fallback `href` attributes in `index.html`
   (floating button and success panel) so they still work without JavaScript.

Use the full international number, digits only, without `+` or spaces.

### Contact form

The form has no backend. After validating the fields it composes a tidy message and
opens **WhatsApp** in a new tab, so enquiries still reach you for free. The success
panel also contains a direct WhatsApp link in case the popup is blocked.

To use a real form backend instead, replace the submit handler in `js/main.js` with a
`fetch()` call to your provider (Formspree, Netlify Forms, etc.) and keep the existing
validation and success UI.

### Colours and type

Design tokens live at the top of `css/styles.css`:

```css
:root {
  --bg: #050605;
  --neon: #b4ff39;
  --neon-strong: #ccff6a;
  --text: #f2f4ee;
  ...
}
```

Changing `--neon` updates the accent colour across buttons, glows, icons, borders
and illustrations. Display type is **Space Grotesk**, body type is **Inter**, loaded
from Google Fonts (free). The CSS includes system fallbacks if fonts are blocked.

### Artwork

Portfolio images and the favicon are hand-built SVGs in `assets/`. Replace them with
real screenshots (keeping the 4:3 ratio for project cards) or edit the SVG files
directly. Each card also has a `project-result` badge and alt text in `index.html`.

The brand lockup is split across three files, with the supplied logo artwork embedded
as base64 WebP so it renders without extra requests:

- `assets/webloom-mark.svg` — logo symbol, used in the navbar and footer.
- `assets/webloom-wordmark.svg` — “WEBLOOM” wordmark beside the symbol.
- `assets/favicon.svg` — the symbol on a dark rounded tile.

To swap in new artwork, replace the `<image href="data:image/webp;base64,…">` payload
in each file, or point the `href` at a normal `.png`/`.svg` file and update the
`width`/`height` to the real pixel dimensions.

### Pricing

Prices are data attributes on the amount elements. Amounts are shown in Egyptian
Pounds (EGP):

```html
<span class="amount" data-monthly="4,000" data-onetime="4,000">4,000</span>
```

The three plans are **4,000 EGP**, **7,000 EGP** and **10,000 EGP**. Edit those
values, the plan features, and the plan-to-budget mapping (`planBudgets` in
`js/main.js`) to match your offer. The monthly and one-time views currently use
the same plan price; change `data-onetime` if you want a separate project fee.

## Notes

- No cookies, tracking scripts or analytics are included.
- No paid assets: all illustrations are original SVGs, fonts are free Google Fonts,
  and the WhatsApp link uses the free `wa.me` endpoint.
- The content (projects, clients, testimonials, metrics) is sample copy for a
  fictional studio — replace it with your own before going live.
