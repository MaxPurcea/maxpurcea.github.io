# Redesign — change notes

Branch: `redesign`

A visual redesign of the portfolio. Pages, anchors (`#projects`, `#rowing`, `#about`, `#resume`,
`#contact`) and URLs are unchanged. All copy is unchanged, except for the content removals listed at the
end, made on request. The site is still plain static HTML/CSS/JS for GitHub Pages, with no
framework, build step or third-party JS library.

## At a glance

| Area | Before | After |
| --- | --- | --- |
| Overall feel | Muted drafting sheet: grey line grid, white panels, steel-blue accent | Sleek and modern: soft dot grid, layered rounded cards, generous spacing, one restrained accent |
| Typography | IBM Plex Sans for everything, IBM Plex Mono for labels | **Space Grotesk** (headings, display), **Inter** (body), **JetBrains Mono** (labels and metadata); larger, tighter display sizes |
| Color | One steel-blue accent (`#36678f`) | One muted steel-blue accent (`#2f5f8f` light / `#8fb2d6` dark) on neutral cool greys. No gradients, glows or secondary hues: accents are 1.5–2px solid rules and marks |
| Dark mode | Followed the OS only, with flat colors; the `theme-btn` toggle code had no button in the markup | Tuned charcoal-navy palette with its own shadows. A sun/moon toggle in the header on every page saves the choice in `localStorage` and applies it before first paint (no flash). Switching uses a short cross-fade |
| Motion | Short translate-only reveal on the home page; figure fade-ins on some case pages | Light motion system (details below), all CSS or a few lines of vanilla JS |
| Page transitions | None | Cross-document View Transitions: the page cross-fades and slides while the header stays put. Browsers without them get a soft fade-in |
| Reduced motion | Partial | Every animation and transition is turned off under `prefers-reduced-motion: reduce`, and all content shows at once |

## Signature details
- **Physics-based hero streamlines.** The faint lines behind the hero are real potential-flow streamlines
  past a cylinder (ψ = y(1 − R²/r²)), stretched into an ellipse around the portrait. `js/main.js` computes them
  from the portrait's actual on-screen position and redraws on resize, so the flow wraps the photo on phone,
  tablet and desktop alike. A few lines carry a slow moving dash, like particles in the flow. The whole set is a
  few dozen SVG paths and costs well under 1 ms to compute.
- **Flow on the Fluid-Mechanical Dissection card**: on hover, the streamlines in its illustration start
  moving as dashed flow.
- **Images fade in** as they finish loading, so lazy-loaded photos never pop in. If a download fails
  (flaky connection, stale cache), the image retries once with a fresh URL instead of showing a broken icon.
- **Drafting-style eyebrow mark**: a small outlined square, as on the original site.
- **Reading-progress hairline** under the header on case studies (CSS scroll-driven animation, no JS).
- **Theme-aware scrollbar** color.

## Page by page

### Home (`index.html`)
- **Header**: transparent at the top of the page; turns into a frosted bar with a hairline border once you
  scroll. Nav links get a thin accent underline on hover, and the link for the section in view is highlighted
  (scroll-spy). The monochrome "MP" mark tilts slightly on hover. New dark-mode toggle.
- **Mobile menu**: before, it snapped open with `display` toggling. Now it slides and fades in on a solid
  panel, the burger turns into an ✕, and Esc or a tap outside closes it. `aria-expanded` and `aria-label` update.
- **Hero**: before, a static name, lede and photo. Now:
  - The eyebrow, name, lede, button, portrait and fact cards come in with a short stagger.
  - The name gets one subtle tonal sheen as it loads.
  - Streamlines flow around the rounded portrait (above), with a very soft single-tone glow behind.
  - The three fact items are separate cards with a thin accent edge, instead of one boxed row.
- **Section headings**: larger Space Grotesk headings with a short 2px accent rule underneath. "About Me" used
  an inline style; it now uses the shared `section-title` class.
- **Project cards**: rounded 18px cards. On hover they lift with a spring, the border picks up a hint of the
  accent, a faint spotlight follows the cursor (fine pointers only), the image zooms slightly, and the
  "Read more →" link slides into a pill.
- **Additional work, rowing and life photos**: thin accent side rule, soft shadows, and gentle lift or zoom on hover.
- **Buttons**: primary is solid accent with a faint light sweep on hover; the arrow icons nudge forward.
- **Footer**: hairline top border; contact links get an animated underline.
- **Scroll reveal**: sections fade and slide up as they enter the viewport. Items that enter together (such as
  the project grid) are staggered slightly.

### Case studies (`projects/*.html`)
- **Hero**: bigger display title. The eyebrow, title and lede come in with a stagger.
- The **"← All projects"** link now lines up with the 860px content column on wide screens (before, it sat at
  the far-left container edge) and slides on hover.
- **Summary** (Objective / Contribution / Result): before, one bordered strip with dividers. Now three cards,
  each with a small accent tick; they stack on mobile.
- **Prose card**: more padding, larger radius, a small accent marker above each `h2`, accent list markers, and
  monospace numbers for ordered steps. Tables get subtle zebra rows.
- **Figures and galleries**: rounded, with gentle zoom on hover. The existing figure fade-ins (`.glide`) and
  chart draw-in animations still work.
- **Rim aerodynamics**: the yaw selector is now a segmented pill control, and the angle tag is easier to read.
- **Next/previous** links are cards that lift, with an accent underline that grows on hover.

## Fixes from review
- The skiing photo showed as broken in one browser even though the file is valid and loads elsewhere (likely
  a failed or stale cached download). Its URL now carries a version (`life-skiing-2.jpg?v=2`) to bypass stale
  caches, and every image retries once on error (above).

## Layout fixes found while checking each page
Each page was checked at 320, 390, 820, 1024, 1440 and 1920px wide in both light and dark themes (72 page
loads), with a script that flags horizontal overflow and console errors. Screenshots were reviewed by eye.
- The mobile menu panel was see-through over the hero; it's now opaque and the header goes solid while the
  menu is open.
- The "← All projects" link was out of line with the centered case-study column on desktop.
- The Concrete Canoe hero has no lede, which left extra space under the title; that gap is gone.
- On tablets (681–900px) the three hero fact cards stacked into one tall column; they now stay in a row until 680px.
- No page scrolls horizontally at any of those widths. Wide figures on the rim page still scroll inside their
  own frame on small phones, as before.

## Performance
- Still no frameworks or animation libraries: GSAP/Framer Motion weren't needed for a static site. Animations
  use only `transform` and `opacity` (plus a few SVG dash offsets), so they stay on the compositor.
- `css/style.css`: about 7.9 KB → 9.2 KB gzipped. I deleted a set of rules for components no page uses
  (timeline, KPI tiles, callouts, filters and so on) to offset the new styles.
- `js/main.js`: about 1.0 KB → 2.9 KB gzipped. It now includes the streamline solver, and handles the figure
  reveals that were copied inline on three case-study pages; those inline copies are gone.
- `index.html`: about 4.6 KB → 4.9 KB gzipped (the streamlines are generated, not stored in the markup).
- Fonts: one Google Fonts request with `display=swap`, as before (three families, seven weights).

## Accessibility
- `prefers-reduced-motion: reduce` turns off all keyframe animations, transitions, moving streamline dashes,
  card lifts, image zooms and view transitions. Reveal content shows immediately; the static streamlines stay.
- Reveal animations only hide content once JS is confirmed running (`html.js`). If `main.js` fails to load, a
  fallback in `<head>` removes that class so nothing stays invisible.
- The theme toggle has an `aria-label` and `aria-pressed`. Decorative SVGs are `aria-hidden`. Focus rings use
  the accent color.
- Contrast meets WCAG AA in both themes. In light mode, accent text on white is 6.7:1 and secondary grey text
  is at least 4.5:1. In dark mode, accent text is 8.6:1, and white text on the accent button is 5.9:1.

## Content removals (requested)
Everything about the carbon-frame manufacturing drawings was removed from the site, so the hanger project is
now only about the reverse engineering:
- `projects/drawings-and-hangers.html`: removed the "Manufacturing drawings for a carbon frame" section, the
  outcome line about delivered GD&T frame drawings, and the frame wording in the title, meta/OG description,
  lede and summary. The page title is now "Derailleur Hanger Replicas". The URL is unchanged, so no links break.
- `index.html`: project card title and description, and the frame-drawing clause in the About text.
- `projects/brokepart.html`, `projects/concrete-canoe.html`: previous/next link labels.
- `assets/Maximilian_Purcea_Resume.pdf`: the PCW bullet now reads "Reverse-engineered Shimano and SRAM UDH
  derailleur hangers and 3D-printed replicas that fit an existing bike frame and derailleur." It was edited
  directly in the PDF's text stream with the original embedded font, so it looks the same and the removed text is
  gone from the file, not just covered. **Make the same change in the LaTeX source** so a future rebuild
  doesn't bring it back.

## Files touched
- `css/style.css`: rewritten around the new design tokens. All selectors the pages use are kept.
- `js/main.js`: menu, reveal with stagger, streamline solver, image fade-in, card spotlight, scroll-spy, theme
  toggle, and video fade-in.
- `index.html`, `projects/*.html`: new font link, head script (theme and JS flag), header actions (theme
  toggle, animated burger), progress bar on case pages, the streamline container on the home page, and the
  content removals above.
- `assets/Maximilian_Purcea_Resume.pdf`: frame-drawing clause removed (see above).
- `CHANGES.md`: this file.
