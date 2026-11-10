# PROJECT_CONTEXT.md — CyberAI Website Master Context & Tracking File

> **Last Updated:** 2026-11-10
> **Analyst:** Lead Web Developer / UI-UX Architect / Technical PM
> **Domain:** `aicybercourse.ai.iith.ac.in`
> **Repository:** `cyber-AI`

---

## 1. PROJECT META

### 1.1 Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Markup** | Vanilla HTML5 | No templating engine; pages are standalone `.html` files |
| **Styling** | Vanilla CSS | Two separate stylesheets: `main.css` (index page) and `about.css` (about, certificate, and register pages) |
| **JavaScript** | Vanilla JS (ES6) | `main.js` (global — phase switcher, FAQ accordion, modal, hamburger menu), `nav.js` (fetch-injected nav/footer for register and thank-you pages) |
| **Fonts** | Google Fonts — **Ruda** (400, 700) | Loaded via `@import url()` at the top of both CSS files |
| **Icons** | Font Awesome 5.15.4 (CDN) | Used for social-media icons in footer only |
| **Forms** | Tally.so (embedded iframe) | Registration form on `register.html` only; Tally embed script on most pages |
| **Forms** | Google Apps Script → Google Form | "Enroll Now" modal — custom HTML form POSTs JSON to an Apps Script web app (deployed from the enroll form owner's account), which records a response in the enroll Google Form and replies `{ok}`; URL in `ENROLL_ENDPOINT` (`main.js`) |
| **Analytics** | Google Analytics (GA4: `G-KWDYBFBBNX`), GTM (`GTM-PLBRZSKP`, `GTM-NNLCB9RF`, `GTM-M5X6STR5`), Meta Pixel (`1598215347533453`), OpenAI Ads pixel (`D8nHwhhHMM34BQfMXRkJHV`; index, about, terms, register) | Tag snippets duplicated in head of every HTML file; **event tracking is centralized in `main.js`** — see 2.6 |
| **Hosting** | GitHub Pages | `CNAME` points to `aicybercourse.ai.iith.ac.in` |
| **Assets** | SVG-heavy (logos, icons, backgrounds, illustrations), PNG for photos/certificates | Two asset directories: `assets/` and `aboutassets/` |

### 1.2 Core Theme Definition — "CyberAI"

| Token | Current Value | Role |
|-------|---------------|------|
| `--primary-color` | `#F2644C` (main.css) / `#F46B45` (about.css) | **INCONSISTENT** — Brand coral/orange accent |
| `--text-color` | `#FFFFFF` | Default text on dark backgrounds |
| `--background-dark` | `#1A1A1A` | Dark surface color |
| `--text-dark` | `#333` (about.css only) | Body copy on light backgrounds |
| `--text-light` | `#666` (about.css only) | Secondary/muted text |
| `--bg-light` | `#f8f9fa` (about.css only) | Light section backgrounds |
| `--border-radius` | `20px` (about.css only) | Card corners |
| Hover accent | `#ff836f` / `#ff5542` (inline) | Button hover states — not tokenized |
| Section BGs | `#F6F6F6`, `#f8f9fa`, `#EFEFEF`, `#f7f3f3` | Multiple grays used across sections — **not standardized** |

### 1.3 Layout Rules (Current)

| Rule | Value |
|------|-------|
| Max container width | `1600px` (main.css), `1800px` (about.css `--container-width`) |
| Navbar height | `113px` fixed, collapses to `auto` on 800px and below |
| Hero min-height | `100vh` (index), `clamp(226px, 35vh, 600px)` (about/cert) |
| Responsive breakpoints | `1600px`, `1200px`, `800px`, `600px`, `400px`, `320px` |
| Grid system | CSS Grid + Flexbox (no framework) |
| Mobile nav | Hamburger toggle at 800px and below; `.nav-links.active` shows dropdown |

---

## 2. CURRENT SYSTEM ARCHITECTURE

### 2.1 Page Inventory

| Page File | Purpose | Stylesheet | Scripts | Nav/Footer |
|-----------|---------|-----------|---------|------------|
| `index.html` (663 lines) | **Landing page** — Hero, Course Offerings, Program Features, Benefits/Certificate, Skills, Program Fee, FAQs | `main.css` | `main.js` | Inline (hardcoded) |
| `about.html` (213 lines) | **About page** — Company intro, Vision/Values/Mission cards, IIT-H section, Faculty profiles | `about.css` | `main.js` | Inline (hardcoded) |
| `AICS2025[01-23].html` (x23 files) | **Individual certificate pages** — Per-student completion certificate display (photo, name, ID, certificate image, program description) | `about.css` | `main.js` | Inline (hardcoded) |
| `register.html` | **Registration** — Tally.so iframe form | `about.css` | `nav.js`, `main.js` | Fetched via `nav.js` |
| `thankyou.html` | Post-registration confirmation | `about.css` | `nav.js`, `main.js` | Fetched via `nav.js` |
| `thankyou-enroll.html` | Post-enrollment confirmation | `about.css` | `nav.js`, `main.js` | Fetched via `nav.js` |
| `termsandcondition.html` | Legal terms and policy | `termsandcondition.css` | — | Inline |
| `nav.html` | Reusable navbar partial (injected by `nav.js`) | — | — | — |
| `footer.html` | Reusable footer partial (injected by `nav.js`) | — | — | — |

### 2.2 Active Components (index.html)

```
+--------------------------------------------------------+
|  NAVBAR (fixed, white bg, logo + 7 nav links + CTA)    |
+--------------------------------------------------------+
|  HERO SECTION                                           |
|  +------------------+--+------------------+             |
|  | Left: H1 + desc  |  | Right: Campus    |             |
|  | + brochure CTA   |  | Immersion info   |             |
|  | + partner logo   |  | + bullet points  |             |
|  +------------------+--+------------------+             |
|  Background: assets/Background.svg                      |
+--------------------------------------------------------+
|  OVERLAP CARDS (3 cards: Duration, Delivery, Cert)      |
|  Negative margin overlap with hero bottom               |
+--------------------------------------------------------+
|  COURSE OFFERINGS SECTION                               |
|  +----------------------+------------------+            |
|  | Phase tabs (1-4)     | Countdown card   |            |
|  | + Dynamic modules    | (reg date, fee,  |            |
|  |   (JS-rendered)      |  duration, CTA)  |            |
|  +----------------------+------------------+            |
+--------------------------------------------------------+
|  PROGRAM FEATURES (5 image cards in 6-col grid)         |
|  3x span-2 top row + 2x span-3 bottom row              |
+--------------------------------------------------------+
|  BENEFITS / CERTIFICATE RECOGNITION                     |
|  Two-column: text (left) + illustration (right)         |
+--------------------------------------------------------+
|  SKILLS SECTION (2-column checklist grid, 17 skills)    |
+--------------------------------------------------------+
|  PROGRAM FEE & SCHEDULE                                 |
|  3-column grid: Fee structure | divider | Timeline      |
+--------------------------------------------------------+
|  FAQ SECTION (12 items in 2-column accordion layout)    |
+--------------------------------------------------------+
|  FOOTER (logo + description | contact + social icons)   |
|  FOOTER BOTTOM (copyright + policy link, gray bg)       |
+--------------------------------------------------------+
```

### 2.3 Active Components (about.html)

```
+--------------------------------------------------------+
|  NAVBAR (same as index, inline copy)                    |
+--------------------------------------------------------+
|  HERO BANNER (short, centered "About Cyber AI" title)   |
|  Background: aboutassets/mainbg.svg                     |
+--------------------------------------------------------+
|  CONTENT SECTION (text + image, side-by-side)           |
|  Company intro with label badge                         |
+--------------------------------------------------------+
|  VALUES SECTION (3 cards: Vision | Values | Mission)    |
|  Middle card has inverted orange bg                     |
+--------------------------------------------------------+
|  IIT-H SECTION (full-width bg, heading, gallery)        |
|  Decorative SVG overlays (designbg1, designbg2)         |
+--------------------------------------------------------+
|  FACULTY SECTION (3 faculty profile cards)              |
+--------------------------------------------------------+
|  FOOTER (same structure as index, different CSS)        |
+--------------------------------------------------------+
```

### 2.4 JavaScript Feature Map

| Feature | Location | Mechanism |
|---------|----------|-----------|
| **Mobile hamburger menu** | `main.js:12-14` | `toggleMenu()` toggles `.active` class on `.nav-links` |
| **Phase tab switcher** | `main.js:16-537` | Click on `.phase` elements triggers `updateContent()` that rebuilds `.course-modules` DOM from a JS data object containing all 4 phases, 16+ module entries with topics |
| **Video modal** | `main.js:541-563` | Click on `#videoImage` shows modal with YouTube iframe; currently **partially commented out** in HTML |
| **FAQ accordion** | `main.js:565-587` | Click-to-expand with animated height; only one FAQ open at a time |
| **Nav/footer injection** | `nav.js:1-41` | Fetches `nav.html` and `footer.html`, injects into `#header-container` and `#footer-container`; used only by `register.html`, `thankyou.html`, `thankyou-enroll.html` |
| **Hide Apply button** | `nav.js:28-41` | Hides "Register Now" CTA on registration/thank-you pages |

### 2.5 Content Strategy

| Content Element | Current State | Notes |
|----------------|---------------|-------|
| Program duration | "4 months" (overlap card), "16 Weeks" (countdown card) | Discrepancy |
| Program fee | "TBD" / "*To be Determined" | Placeholder |
| Registration date | "Coming Soon" | Placeholder |
| Course start date | Commented out ("23 June 2025") | Hidden |
| Brochure download | Links to `CyberAI-brochure-v4.pdf` | Active (6 brochure versions in assets) |
| Certificate pages | 23 individual student pages (`AICS202501-23.html`) | Active, each ~228 lines |
| Faculty | 3 profiles (Dr. Karthik P N, Dr. Konda Reddy Mopuri, Dr. Saurabh Kumar) | About page only |

### 2.6 Analytics Event Map (2026-11-10)

**Why it was added:** the team saw visits but no enrollments. The enroll submit was a bare `dataLayer.push({event: 'enroll_form_submit'})`, which only GTM can see. GA4 is configured directly in each page's head (not through GTM), so it never got the enrollment, and the Meta / OpenAI pixels never got a conversion at all (only `PageView` / `init`).

**How it works:** `trackEvent(name, params)` in `main.js` sends each event once as `gtag('event', name, params)`:
- **GA4** `G-KWDYBFBBNX` records it directly.
- **GTM** (`GTM-PLBRZSKP`, `GTM-NNLCB9RF`, `GTM-M5X6STR5`) sees it as a **Custom Event** with the same name. Parameters are Data Layer Variables `eventModel.<param>` (e.g. `eventModel.form_name`).
- **Meta Pixel** / **OpenAI pixel** get the events listed in `AD_PIXEL_EVENTS` (same event ID on both, for a future Conversions API). The OpenAI pixel is on index, about, terms and register (the pages with a form).
- No personal data is ever sent. The Tally submit payload holds the answers; only `form_id` / `form_name` go out. mailto addresses aren't sent.
- index.html lazy-loads its tag scripts (PageSpeed). A form submit loads them at once (`loadTagsNow`). A link clicked before they've loaded has its navigation held until the event is sent (≤ 1 s, `tagScriptsPending` / `whenTagScriptsLoaded`). register.html waits for the conversion (≤ 1 s) before redirecting to `thankyou.html`.
- **Debug:** open any page with `?analytics_debug=1`. Each event is logged to the console and shows in GA4 → Admin → DebugView for the session. `?analytics_debug=0` turns it off.

| Event | When | Key params | Meta / OpenAI |
|-------|------|-----------|---------------|
| `enroll_modal_open` | Enroll modal opens | `modal_trigger` (`auto` / `enroll_tab`), `form_provider` | `EnrollModalOpen` (custom) |
| `enroll_form_load` | Tally enroll form rendered | `form_id`, `form_name`, `form_provider` | — |
| `enroll_form_page_view` | Tally form page shown | `form_page` | — |
| `enroll_form_start` / `enroll_form_error` | Custom (non-Tally) form only: first keystroke / validation, timeout or submit failure | `error_type`, `form_field` | — |
| **`enroll_form_submit`** | Enrollment submitted (name kept for existing GTM triggers) | `form_name`, `form_id`, `form_provider` | **`Lead`** / **`lead_created`** |
| **`generate_lead`** | With every form submit (GA4 lead reports) | `lead_source` (`enroll_form` / `register_form`) | — |
| `enroll_thankyou_view` | Thank-you popup shown (`display: modal`) or `thankyou-enroll.html` loaded (`display: page`) | `display` | — |
| `enroll_modal_close` | Modal closed | `close_method` (`close_button` / `thankyou_button` / `backdrop` / `escape_key`), `modal_stage` (`form` / `thank_you`), `open_seconds` | — |
| `register_form_load` / `register_form_page_view` | Tally registration form on `register.html` | `form_id`, `form_page` | — |
| **`register_form_submit`** | Registration submitted | `form_name`, `form_id` | **`CompleteRegistration`** / **`registration_completed`** |
| `register_thankyou_view` | `thankyou.html` loaded | `display` | — |
| `cta_click` | Register Now / Apply Now / fee box / Back to Home | `cta_text`, `cta_destination` (`register` / `home`), `click_location` | `CTAClick` (custom) |
| `brochure_download` | Brochure PDF link | `file_name`, `click_location` | `BrochureDownload` (custom) |
| `nav_click` / `link_click` | Navbar links / any other link | `link_text`, `link_url`, `click_location`, `outbound` | — |
| `social_click` / `contact_click` | Footer social icons / mailto, tel | `social_network` / `contact_method` | — / `Contact` |
| `course_phase_select`, `faq_open`, `learner_image_view`, `alumni_slide_change`, `nav_menu_toggle` | Course weekend tabs, FAQ opened, learner photo, slider dots, mobile menu | `phase_number`, `faq_question`, `image_title`, `slide_number`, `menu_state` | — |
| `video_start` / `video_progress` / `video_complete` | Alumni story videos (25/50/75 %) | `video_title`, `video_percent`, `video_duration` | — |
| `section_view` | A section's top reaches the upper half of the screen (once per page) | `section_id`, `section_title` | — |
| `scroll_depth` | 25/50/75/100 % (GA4's own scroll event can't fire on index: `<body>` is the scroll container) | `percent_scrolled` | — |

`click_location` = `navbar`, `footer`, `enroll_modal`, `hero`, `thank_you`, or the section id (`course-offerings`, `fee`, …).

**One-time setup in the dashboards (not in code):**
1. **GA4 → Admin → Events → Key events:** mark `enroll_form_submit` and `register_form_submit`, or `generate_lead` instead. Not both, or each conversion counts twice.
2. **GA4 → Admin → Custom definitions:** add event-scoped dimensions for the params you want in reports. GA4 shows unregistered params only in DebugView. Start with `form_name`, `modal_trigger`, `close_method`, `modal_stage`, `cta_destination`, `click_location`, `section_id`, `lead_source`; add a metric for `open_seconds`.
3. **GTM:** if any container already has a GA4 Event tag that forwards `enroll_form_submit` to `G-KWDYBFBBNX`, pause it, because GA4 now gets the event directly. Google Ads / other conversion tags can keep the same Custom Event trigger.
4. **Meta Events Manager:** `Lead` and `CompleteRegistration` arrive as standard events. Check `register.html`'s Tally embed (`formEventsForwarding=1`, Tally's "Track form events") isn't also sending a registration event to the pixel.
5. **OpenAI pixel:** every snippet has `debug: true` (as first pasted). Set it to `false` once conversions show in OpenAI Ads Manager.

---

## 3. UI/UX AND DESIGN TOKEN REVIEW — "Antigravity" Theme Vision

### 3.1 Current Design Gaps

| Gap Area | Current State | Opportunity |
|----------|---------------|-------------|
| **Floating elements** | Overlap cards use negative margin but feel static | Add CSS `@keyframes float` animation with subtle `translateY` oscillation on cards and icons |
| **Weightless depth** | Flat card shadows (`0 4px 8px rgba(0,0,0,0.1)`) | Introduce layered multi-shadow system for elevation, glassmorphism on key cards |
| **Micro-interactions** | Only hover: `translateY(-5px)`, `scale(1.1)` on social icons | Add hover ripple effects, button pulse on CTA, scroll-triggered reveal animations |
| **CSS Animations** | Zero keyframe animations exist | Add entrance animations (fade-up, slide-in), gradient text shimmer on headings, orbiting particles for hero |
| **Color consistency** | `--primary-color` differs between stylesheets; 5+ unnamed gray shades | Unify into a single design token system with named semantic variables |
| **Typography depth** | Single font (Ruda), no weight variation beyond 400/700 | Consider adding a display/heading font pairing, use `clamp()` for fluid typography throughout |
| **Dark mode** | Not implemented | The dark hero background already hints at a dark-mode aesthetic — extend site-wide |
| **Scroll experience** | `scroll-behavior: smooth` only | Add Intersection Observer-based reveal animations, parallax on hero background |
| **Loading states** | None | Add skeleton loaders or subtle pulse animation for dynamic content |

### 3.2 Recommended "Antigravity" Design Tokens (For New UI)

```css
/* PROPOSED — Unified Design Token System */
:root {
  /* Brand Palette */
  --ag-brand-primary: #F2644C;
  --ag-brand-primary-hover: #ff836f;
  --ag-brand-primary-dark: #893B2E;
  --ag-brand-gradient: linear-gradient(135deg, #F2644C, #FF8A6B);

  /* Neutrals */
  --ag-surface-dark: #0D0D12;
  --ag-surface-mid: #1A1A2E;
  --ag-surface-light: #F4F4F8;
  --ag-surface-card: #FFFFFF;
  --ag-border-subtle: rgba(255, 255, 255, 0.08);

  /* Text */
  --ag-text-primary: #FFFFFF;
  --ag-text-secondary: rgba(255, 255, 255, 0.7);
  --ag-text-dark: #1A1A1A;
  --ag-text-muted: #666666;

  /* Elevation (Antigravity floating feel) */
  --ag-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --ag-shadow-md: 0 8px 24px rgba(0, 0, 0, 0.12);
  --ag-shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.16);
  --ag-shadow-glow: 0 0 30px rgba(242, 100, 76, 0.15);

  /* Motion */
  --ag-transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --ag-transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --ag-transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Spacing */
  --ag-space-xs: 0.25rem;
  --ag-space-sm: 0.5rem;
  --ag-space-md: 1rem;
  --ag-space-lg: 2rem;
  --ag-space-xl: 4rem;
  --ag-space-2xl: 8rem;

  /* Border Radius */
  --ag-radius-sm: 8px;
  --ag-radius-md: 16px;
  --ag-radius-lg: 24px;
  --ag-radius-full: 9999px;
}
```

### 3.3 Component-to-Content Mapping

| Section | HTML Component | Content Copy Source | Design Pattern |
|---------|---------------|-------------------|----------------|
| **Hero** | `.hero > .hero-content` | H1: Program title, P: Program description, CTA: "Download Brochure" | Split-screen with vertical divider; left = text + CTA, right = campus immersion bullets |
| **Overlap Cards** | `.overlap-cards > .card-wrapper` | 3 cards: Program Duration (4 months), Delivery Mode (Online), Certification (IIT-H certificate) | Numbered badges with negative-margin overlap |
| **Course Offerings** | `#course-offerings` | Phase 1-4 tabs (JS-driven content with 16+ modules, 70+ hours total) + Countdown sidebar | Tab navigation + dynamically rendered module cards |
| **Program Features** | `#program-features` | 5 feature cards: Practical Applications, Case Studies, Live Industry, Comprehensive Curriculum, Renowned Faculty | Image-backed card grid (6-col, background images) |
| **Benefits** | `#certificate` | Certificate recognition text + 2 benefit highlights | Two-column: rich text + illustration |
| **Skills** | `#skills` | 17 skill items across 2 columns | Checklist grid with SVG check icons |
| **Program Fee** | `#fee` | Fee structure (TBD) + Program schedule (Coming Soon) | 3-column split with vertical divider |
| **FAQs** | `#faqs` | 12 Q and A items in 2-column layout | Click-to-expand accordion |
| **Footer** | `.footer` | Logo + company description + contact address + 4 social links | Two-column in footer bg image |

---

## 4. TECHNICAL GUARDRAILS

### 4.1 Must-Preserve Rules

| Rule | Rationale |
|------|-----------|
| **Do NOT introduce build tools or frameworks** | Site is static HTML/CSS/JS hosted on GitHub Pages. No npm, no bundler, no React. |
| **Do NOT rename or move existing asset files** | 23 certificate pages + index reference specific SVG/PNG paths. Breaking these breaks production. |
| **Preserve all analytics/tracking scripts** | GA4, GTM, and Meta Pixel are business-critical. Keep them in every page head. |
| **Maintain responsive breakpoints** | 6 breakpoints exist (1600, 1200, 800, 600, 400, 320px). New CSS must work within or extend these — never remove them. |
| **Keep Tally.so integration intact** | Registration form on `register.html` + embed script on multiple pages. Do not replace. |
| **Preserve CNAME** | Domain `aicybercourse.ai.iith.ac.in` — do not modify or delete. |
| **Certificate pages follow a strict template** | All 23 `AICS2025XX.html` files share an identical structure. Any template change must be propagated to all. |

### 4.2 Known Technical Debt

| # | Issue | Location | Severity | Fix |
|---|-------|----------|----------|-----|
| 1 | **Inconsistent --primary-color** | `main.css: #F2644C` vs `about.css: #F46B45` | Medium | Unify to a single value across both files |
| 2 | **Duplicated navbar/footer HTML** | `index.html`, `about.html`, and 23 cert pages all have inline nav/footer; only `register.html` and thank-you pages use `nav.js` injection | High | Refactor all pages to use `nav.js` component injection pattern |
| 3 | **Duplicate CSS resets** | Both CSS files have their own reset and font imports | Medium | Extract shared base styles into a `base.css` |
| 4 | **Broken img src attribute** | `index.html:350` — contains malformed src value with title attribute embedded | High | Fix to `src="assets/certificteimg.svg"` |
| 5 | **main.js loaded in head without defer** | All pages load `main.js` synchronously, blocking HTML parsing | Medium | Add `defer` attribute |
| 6 | **Video modal references non-existent element** | `main.js:543-548` — `videoImage` click handler runs on all pages but `#videoImage` is commented out in HTML | Medium | Guard with null check or remove dead code |
| 7 | **Multiple DOMContentLoaded listeners** | `main.js` registers 3 separate `DOMContentLoaded` events | Low | Consolidate into single listener |
| 8 | **No CSS custom properties in main.css for spacing** | Only 3 CSS variables defined; rest is hardcoded px/rem | Medium | Migrate to token-based spacing system |
| 9 | **Footer uses hardcoded min-width: 1500px** | `main.css:1449` — causes horizontal scroll on smaller screens | High | Remove or cap at `max-width: 100%` |
| 10 | **Image accessibility** | Some img tags have empty title attributes | Medium | Add meaningful alt text, remove empty title attributes |

### 4.3 CSS Architecture Risks

```
main.css:  2,212 lines — monolithic, no logical file splitting
about.css: 1,023 lines — duplicates navbar, hamburger, and some utility styles from main.css

Risk: Any navbar or footer style change must be applied in BOTH files.
Risk: 6 media-query breakpoints are interspersed, not consolidated.
```

---

## 5. TASK TRACKER

### DONE — Baseline Established

- [x] Full project file audit completed (38 files, 4 directories)
- [x] Component architecture mapped for all pages
- [x] Design token inventory documented
- [x] Content-to-component mapping completed
- [x] Technical debt catalogued (10 issues identified)
- [x] Responsive breakpoint system documented
- [x] JavaScript feature map created
- [x] Asset directory inventory completed (73 assets + 22 about-assets)

### IN PROGRESS

- [/] **"Enroll Now" tag card + enrollment modal** (2026-11-03) — `index.html` only
  - [x] Floating "Enroll Now" CTA (`.enroll-fixed`, bottom-right, 78px; CSS gradient + live text/icon instead of `assets/enroll.png`, which was blurry on HiDPI) opens `#enrollModal`
  - [x] Modal per design `CyberAI- Landing Page V2.png`, scaled down for laptop screens (820px wide frame, 54px inputs)
  - [x] Custom 2×2 form (name, phone, designation, email), Esc/backdrop/✕ close, scroll lock, focus return
  - [x] In-modal thank-you view (`#enrollThankYou`) replaces the form after a successful submit; closing resets to a fresh form (no redirect to `thankyou-enroll.html`)
  - [/] **Tally test run** (2026-11-06): `ENROLL_TALLY_EMBED_URL` in `main.js` embeds Tally form `VpjZ4l` under the modal's own frame + title. Fields: name | phone, email | LinkedIn URL, then "Upload your CV" (PDF/DOC/DOCX ≤ 10 MB) full width; no Designation. LinkedIn and CV are each optional but one is needed — a Tally logic rule requires the CV while LinkedIn is empty. Default light theme (the Custom theme renders inputs 50% transparent over the dark modal). Set it to `''` to return to the custom form + Apps Script below (code kept as is). The iframe is created on first open; `Tally.FormSubmitted` → in-modal thank-you view, and closing reloads the iframe for a blank form.
    - Auto-open: the modal opens on page load (`ENROLL_AUTO_OPEN`) until the visitor closes it (✕, backdrop, Esc, or Close after submitting). Closing sets `sessionStorage.enrollModalDismissed`, so it stays closed on every page (index / about / terms) and on refresh for the rest of the browser session; the Enroll Now tab always opens it. To see the auto-open again while testing, open the site in a new tab or window.
    - Look comes from the Tally theme (free: colours, Google font such as Ruda). Input/button size and shape, and hiding "Made with Tally", need Tally Pro.
  - [x] **Backend = Google Apps Script web app → enroll Google Form** (2026-11-04; Tally is for `register.html` only — not used here).
    - `fetch(ENROLL_ENDPOINT, {method: 'POST', body: JSON.stringify({name, phone, designation, email})})` — string body = `text/plain`, so no CORS preflight; Apps Script's reply is readable JSON.
    - Script (`doPost`) lives in the enroll form (form → ⋮ → Apps Script), **deployed from the form owner's account** (not the developer's). It re-validates, maps fields to questions **by title** (Name / Email / Designation / Phone number), `FormApp.createResponse().submit()`, replies `{ok: true}` or `{ok: false, error}`. `doGet` = health check. Script source isn't in this repo (it's served by gh-pages) — it's in the Apps Script editor.
    - **Submitted at** (2026-11-04): the script also fills a Short answer question "Submitted at" with Google's server time, `yyyy-MM-dd HH:mm:ss z` in `Asia/Kolkata` (e.g. `2026-11-04 13:45:12 IST`), so the time shows in Responses → Summary/Individual without Sheets. The website doesn't send it (hidden from visitors, can't be faked); anything the browser sends for it is ignored. If the question is missing, the response is still saved without it.
    - Site: thank-you **only** on `{ok: true}`. `{ok: false}`, a non-JSON reply (e.g. Google sign-in page when the deployment isn't public), network error, or no answer within `ENROLL_SUBMIT_TIMEOUT_MS` (15 s) → inline error (`#enrollFormError`), values kept.
    - Deployment settings: **Execute as: Me** (= the account that clicked Deploy, i.e. form owner) + **Who has access: Anyone** (visitors are anonymous). Script edits → Deploy → Manage deployments → ✎ → New version (URL unchanged). Changing the "Me" account = new deployment from that account → new `/exec` URL → update `ENROLL_ENDPOINT`.
    - Enroll form: edit ID `1-LzeFL1KGI7…QneJM` (published `1FAIpQLSfJ2LAx…GrwDA`).
    - History: first shipped as a direct `no-cors` POST to `formResponse` (mind-graph pattern, `ContactFormV2.tsx`). It worked once Limit to 1 response was off (200), but the response is opaque (`status 0` to JS), so the site couldn't tell a saved response from a rejected one → replaced by Apps Script.
    - **Root cause of the earlier `401 Page not found` (2026-11-04):** the enroll form forces sign-in. Public link in Incognito shows "Sign in to continue — To fill out this form, you must be signed in. Your identity will remain anonymous." That is Google's **Settings → Responses → Limit to 1 response** behaviour (sign-in required, email not collected). Google rejects anonymous `formResponse` POSTs (401). The dialog is added by JS, so a plain fetch of `viewform` doesn't show it. The only giveaway is the second-to-last flag in `FB_PUBLIC_LOAD_DATA_`: enroll `…"[]",0,1,1]` vs mind-graph `…"[]",0,0,1]`. It was already set before any test POSTs. mind-graph's contact form (limit off) gets 200 with the same code.
    - **Fix:** turn **Limit to 1 response OFF** (and keep "Collect email addresses" = Do not collect). Required for any website-driven Google Form. It also means people can enroll again later; handle duplicates in the Responses sheet (e.g. filter by email) if needed.
  - [x] Validation (native, before submit): all 4 fields required + non-blank; phone 10–15 digits, optional `+`, single spaces/hyphens; email `type=email` + must have a dotted domain
  - [ ] **Make the deployment public + verify**: as of 2026-11-04 the `/exec` URL redirects signed-out visitors to Google sign-in (Who has access ≠ Anyone). After fixing, `/exec` in Incognito must show `{"ok":true,"status":"Enroll endpoint is live"}`; then a site submission must show the thank-you and land in Responses.
  - [ ] Swoosh modal background is a CSS approximation — replace with designer export (see comment in `main.css`)

- [ ] **Google Search Console — Domain property** for `aicybercourse.ai.iith.ac.in` (2026-11-03)
  - Needs a DNS TXT record (`google-site-verification=eqGf34k…`), not a code change. DNS zone `iith.ac.in` is run by IITH (`dns1/dns2.iith.ac.in`, SOA `root@iith.ac.in`) — request via IITH Computer Centre. Host is an A record (103.232.241.26), so a TXT can coexist.
  - Existing meta tag on `index.html` (`THMyBW…`) = an already-verified URL-prefix property — do not remove.

- [/] **New UI Sections — "Successful Learners" + "Alumni Stories"** (2026-08-25)
  - Implementation plan created, awaiting user approval before code changes
  - Location: After `#fee` section (line 511), before `#faqs` section
  - Files to modify: `index.html`, `main.css`, `main.js`

### TODO — New UI Sections Implementation (Pending Approval)

- [ ] **Section 1: "Our Successful Learners / Learners Who Chose Us"**
  - [ ] Add HTML section with `.successful-learners`, `.learners-grid` (5-col), `.learner-card` items
  - [ ] 10 learner cards visible initially (5 per row × 2 rows), more hidden
  - [ ] Placeholder `src` for all learner photos (to be replaced manually)
  - [ ] "Load More >" outlined CTA button centered below grid
  - [ ] JS: Load More click handler reveals next batch of hidden cards
  - [ ] CSS: Card styles (white bg, rounded corners, shadow, name in primary color)
  - [ ] Responsive: 5-col → 4-col → 3-col → 2-col across breakpoints

- [ ] **Section 2: "Alumni Stories / Feedback From the Frontier"**
  - [ ] Add HTML section with `.alumni-stories`, `.stories-slider-wrapper`, `.stories-track`
  - [ ] 3 testimonial cards per slide, 4 slides total (12 cards), first 3 visible
  - [ ] Card: video thumbnail placeholder + play button overlay + quote + divider + person info
  - [ ] Dot navigation (4 dots) centered below cards
  - [ ] JS: Dot click slides `.stories-track` horizontally with transform animation
  - [ ] CSS: Slider, card, dot, play button overlay styles
  - [ ] Responsive: 3 cards → 2 → 1 across breakpoints

- [ ] **CSS additions to `main.css`**
  - [ ] New section base styles (following `.skills`, `.program-fee` padding/bg patterns)
  - [ ] Learner card grid and card component styles
  - [ ] Alumni slider, track, card, and dot styles
  - [ ] Load More button styles (outlined, primary color border)
  - [ ] Play button overlay (CSS-only circle + triangle)
  - [ ] Responsive adjustments at all 6 breakpoints (1600, 1200, 800, 600, 400, 320px)

- [ ] **JS additions to `main.js`**
  - [ ] New `DOMContentLoaded` block for Load More (pattern: separate listener, matches existing)
  - [ ] New `DOMContentLoaded` block for dot slider navigation

- [ ] **Design Token Adherence Verification**
  - [ ] Font: Ruda inherited ✓
  - [ ] Colors: `#F2644C`, `#424242`, `#666`, `#f8f9fa` ✓
  - [ ] `.section-label` gradient badge reused ✓
  - [ ] `h2` at `3.6rem`, `p` at `1.125rem` ✓
  - [ ] Section padding `80px 0` ✓
  - [ ] `.container` max-width `1600px` ✓

- [ ] **Post-Implementation Review**
  - [ ] Visual comparison with UI design images
  - [ ] Test all responsive breakpoints
  - [ ] Test Load More interaction
  - [ ] Test dot slider navigation
  - [ ] Verify no regressions to existing sections

### TODO — Recommended Pre-Implementation Fixes

- [ ] **P0 — Fix broken image src** on `index.html:350`
- [ ] **P0 — Fix footer min-width: 1500px** causing horizontal overflow
- [ ] **P1 — Unify --primary-color** across `main.css` and `about.css`
- [ ] **P1 — Add defer to main.js** script tags across all pages
- [ ] **P1 — Guard video modal** with null check for `#videoImage`
- [ ] **P2 — Extract shared base.css** (reset, font import, navbar, footer)
- [ ] **P2 — Refactor all pages to use nav.js injection** for nav/footer

### TODO — UI/UX Modernization (Pending User Direction)

- [ ] Define and implement unified design token system (proposed tokens above)
- [ ] Create CSS keyframe animations library (float, fade-up, slide-in, pulse)
- [ ] Implement scroll-triggered reveal animations (Intersection Observer)
- [ ] Redesign hero section with dynamic background effects
- [ ] Add glassmorphism treatment to overlap cards
- [ ] Modernize feature cards with hover micro-interactions
- [ ] Implement fluid typography with clamp() across all headings
- [ ] Redesign FAQ section with smoother accordion animation
- [ ] Add loading/transition states between page navigations
- [ ] Consider dark mode support for key sections
- [ ] Refresh footer with modern layout and animated social icons

---

## 6. NEXT STEPS HANDOFF MEMO

**For the next AI model or developer picking up this project:**

The CyberAI website (aicybercourse.ai.iith.ac.in) is a static HTML/CSS/JS site hosted on GitHub Pages — no frameworks, no build tools, no npm. It consists of a main landing page (index.html + main.css + main.js), an About page (about.html + about.css), 23 individual certificate pages (templated from about.css), and registration/thank-you pages that inject nav/footer via nav.js.

**What has been completed:** A complete structural audit of all 38 source files, full component and content mapping, a design token inventory, and a catalogue of 10 technical debt items. No source code changes have been made yet.

**What to do next:** Before touching the UI, fix the two P0 bugs first — (1) the broken img src on index.html line 350 and (2) the footer min-width: 1500px on main.css line 1449. Then unify --primary-color across both CSS files to #F2644C. After those quick wins, the user will direct which modernization tasks to tackle — the recommended token system and animation library are pre-defined above and ready to implement. The critical constraint is: do not introduce any build tools, frameworks, or change the GitHub Pages deployment model. Every change must work as flat HTML/CSS/JS.

---

*This file is the single source of truth for the CyberAI website project. Update it as work progresses.*
