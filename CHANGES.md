# Redesign — change notes

Branch: `redesign`

This is a visual redesign only. All text, pages, image assets and URLs are the same as before:
`index.html` and the five pages in `projects/` keep their filenames, anchors (`#projects`, `#rowing`,
`#about`, `#resume`, `#contact`) and copy. The site is still plain static HTML/CSS/JS for GitHub Pages,
with no framework, build step or third-party JS library.

## At a glance

| Area | Before | After |
| --- | --- | --- |
| Overall feel | Muted drafting sheet: grey line grid, white panels, steel-blue accent | Bright, modern and still professional: soft dot grid, layered cards, electric-blue → cyan gradient accents with a coral highlight |
| Typography | IBM Plex Sans for everything, IBM Plex Mono for labels | **Space Grotesk** (headings, display), **Inter** (body), **JetBrains Mono** (labels and metadata); larger, tighter display sizes |
| Color | One steel-blue accent | Token-based palette: `--accent` blue, `--accent-2` cyan, `--accent-3` coral, and two gradients (`--grad`, `--grad-warm`) used sparingly for marks, rules and the primary button |
| Dark mode | Followed the OS only, with flat colors; the `theme-btn` toggle code had no button in the markup | Tuned deep-navy palette with its own shadows and glows. A sun/moon toggle in the header on every page saves the choice in `localStorage` and applies it before first paint (no flash). Switching uses a short cross-fade |
| Motion | Short translate-only reveal on the home page; figure fade-ins on some case pages | Full motion system (details below), all CSS or a few lines of vanilla JS |
| Page transitions | None | Cross-document View Transitions: the page cross-fades and slides while the header stays put. Browsers without them get a soft fade-in |
| Reduced motion | Partial | Every animation and transition is turned off under `prefers-reduced-motion: reduce`, and all content shows at once |

## Page by page

### Home (`index.html`)
- **Header**: transparent at the top of the page; turns into a frosted bar with a hairline border once you scroll. Nav links get a gradient underline on hover, and the link for the section in view is highlighted (scroll-spy). New dark-mode toggle.
- **Mobile menu**: before, it snapped open with `display` toggling. Now it slides and fades in on a solid panel, the burger turns into an ✕, and Esc or a tap outside closes it. `aria-expanded` and `aria-label` update.
- **Hero**: before, a static name, lede and photo. Now:
  - The eyebrow, name, lede, button, portrait and fact cards come in with a short stagger.
  - The name gets a single gradient sheen as it loads.
  - Faint aerodynamic streamlines flow around the portrait (a small inline SVG with animated dashes), and two soft color glows drift slowly behind.
  - The portrait sits on an offset gradient card that floats gently.
  - The three fact items are separate glassy cards with gradient edge marks instead of one boxed row.
- **Section headings**: larger Space Grotesk headings with a short gradient rule underneath. "About Me" used an inline style; it now uses the shared `section-title` class.
- **Project cards**: rounded 18px cards. On hover they lift with a spring, show a gradient border and a spotlight that follows the cursor (fine pointers only), zoom the image slightly, and slide the "Read more →" link into a pill. Labels use the accent color.
- **Additional work, rowing and life photos**: gradient side rules, soft shadows, and gentle lift or zoom on hover.
- **Buttons**: primary is a gradient with a glow and a light sweep on hover; the arrow icons nudge forward.
- **Footer**: gradient hairline at the top; contact links get an animated underline.
- **Scroll reveal**: sections fade and slide up as they enter the viewport. Items that enter together (such as the project grid) are staggered slightly.

### Case studies (`projects/*.html`)
- **Hero**: bigger display title. The eyebrow, title and lede come in with a stagger.
- The **"← All projects"** link now lines up with the 860px content column on wide screens (before, it sat at the far-left container edge) and slides on hover.
- **Summary** (Objective / Contribution / Result): before, one bordered strip with dividers. Now three cards, each with its own gradient top edge; they stack on mobile.
- **Prose card**: more padding, larger radius, a gradient marker above each `h2`, accent-colored list markers, and monospace numbers for ordered steps. Tables get zebra rows.
- **Figures and galleries**: rounded, with gentle zoom on hover. The existing figure fade-ins (`.glide`) and chart draw-in animations still work.
- **Rim aerodynamics**: the yaw selector is now a segmented pill control, and the angle tag is easier to read.
- **Reading progress**: a thin gradient bar under the header tracks scroll position. It uses CSS scroll-driven animation with no JS, and browsers without support just don't show it.
- **Next/previous** links are cards that lift, with a gradient underline that grows on hover.

## Layout fixes found while checking each page
Each page was checked at 320, 390, 820, 1024, 1440 and 1920px wide in both light and dark themes (72 page loads), with a script that flags horizontal overflow and console errors. Screenshots at those widths were reviewed by eye.
- The mobile menu panel was see-through over the hero; it's now opaque and the header goes solid while the menu is open.
- The "← All projects" link was out of line with the centered case-study column on desktop.
- The Concrete Canoe hero has no lede, which left extra space under the title; that gap is gone.
- On tablets (681–900px) the three hero fact cards stacked into one tall column; they now stay in a row until 680px.
- No page scrolls horizontally at any of those widths. Wide figures on the rim page still scroll inside their own frame on small phones, as before.

## Performance
- Still no frameworks or animation libraries: GSAP/Framer Motion weren't needed for a static site. Animations use only `transform` and `opacity` (plus a handful of SVG dash offsets), so they stay on the compositor.
- `css/style.css`: about 7.9 KB → 9.5 KB gzipped. I deleted a set of rules for components no page uses (timeline, KPI tiles, callouts, filters and so on) to offset the new styles.
- `js/main.js`: about 1.0 KB → 1.8 KB gzipped. It now also handles the figure reveals that were copied inline on three case-study pages; those inline copies are gone.
- Fonts: one Google Fonts request with `display=swap`, as before (three families, seven weights).

## Accessibility
- `prefers-reduced-motion: reduce` turns off all keyframe animations, transitions, the hero streamlines and glows, card lifts, image zooms and view transitions. Reveal content shows immediately.
- Reveal animations only hide content once JS is confirmed running (`html.js`). If `main.js` fails to load, a fallback in `<head>` removes that class so nothing stays invisible.
- The theme toggle has an `aria-label` and `aria-pressed`. Decorative SVGs are `aria-hidden`. Focus rings use the accent color.
- Text colors meet WCAG AA contrast in both themes. White text always sits on the solid `#3355ff` fill (about 5.4:1).

## Files touched
- `css/style.css`: rewritten around the new design tokens. All selectors the pages use are kept.
- `js/main.js`: menu, reveal with stagger, card spotlight, scroll-spy, theme toggle, and video fade-in.
- `index.html`, `projects/*.html`: new font link, head script (theme and JS flag), header actions (theme toggle, animated burger), progress bar on case pages, and the hero streamline SVG on the home page. No copy changed.
- `CHANGES.md`: this file.
