# Observation: AI-Assisted FDE Landing Page

**Task:** Develop a professional landing page for an FDE (Forward Deployed Engineer) Service using AI-assisted coding tools.

---

## 1. AI Models Used

| # | Model | Tool | Output file |
|---|-------|------|-------------|
| 1 | Gemini 3.8 Flash (high) | Antigravity CLI | `index_gemini.html` |
| 2 | Sonnet 5.0 | Claude Code | `index_sonet.html` |
| 3 | Opus 5.5 | Claude Code | `index_opus.html` |

---

## 2. Prompt Used

The same prompt was given to all three models:

> Create a responsive landing page for an FDE service using HTML and CSS.

---

## 3. Code Quality Observation

### Output at a glance

| Metric | Gemini 3.8 | Sonnet 5.0 | Opus 5.5 |
|--------|-----------|-----------|----------|
| File size | ~106 KB | ~24 KB | ~31 KB |
| Lines | ~3,000 | ~850 | ~640 |
| Brand name chosen | AXIOM | FDEWorks | Fieldline |
| Theme | Dark only | Dark only | Light + automatic dark mode |
| JavaScript used | Yes (menu, FAQ, form, scroll) | Yes (mobile menu) | Almost none (one inline form handler) |
| External dependencies | Google Fonts | None | None |
| Sections | Banner, hero, metrics, why FDE, services, roadmap, pods, case studies, testimonials, FAQ, contact form, footer | Hero, logos, services, process, testimonial, pricing, CTA, footer | Hero, logos, problem/solution, services, process, metrics, quote, pricing, FAQ, contact form, footer |

### Ranking (1 = Excellent, 5 = Very poor)

| Criteria | Gemini 3.8 | Sonnet 5.0 | Opus 5.5 |
|----------|:---------:|:---------:|:--------:|
| Code structure | 2 | 2 | 1 |
| Readability | 3 | 1 | 2 |
| Component design | 2 | 3 | 1 |
| Documentation | 1 | 3 | 2 |
| Error handling | 2 | 4 | 2 |
| **Total (lower is better)** | **10** | **13** | **8** |
| **Average** | **2.0** | **2.6** | **1.6** |

### Notes per criterion

**Code structure**
- *Gemini:* Clearly sectioned with semantic tags (`header`, `nav`, `main`, `section`, `footer`) and a full set of CSS variables. However, about 1,800 lines of CSS in a single file is heavy for a landing page.
- *Sonnet:* Clean and conventional: CSS variables, shared `.btn`/`.card` classes, sections in a logical order. Small and easy to follow.
- *Opus:* The most compact. It uses design tokens on `:root` and dark-mode overrides, and its layouts (bento grid, timeline, pricing) use CSS Grid without extra wrapper markup. A few inline `style=""` attributes are left on sections.

**Readability**
- *Gemini:* Each block is readable, but the file is long and the many decorative SVGs inlined in the HTML make it hard to scan.
- *Sonnet:* The easiest to read: one CSS property per line and descriptive class names (`.hero-stats`, `.price-card`, `.process-item`).
- *Opus:* Clear class names, but many CSS rules are written on a single line, which saves space but is a bit harder to read and diff.

**Component design**
- *Gemini:* The richest set of components (terminal mock-up, telemetry box, floating badge, accordion FAQ, multi-field scoping form). Visually impressive but over-engineered for the prompt.
- *Sonnet:* Generic but consistent cards (emoji icons, pricing cards, testimonial). The nav links to an `#faq` section that does not exist, and there is no contact form.
- *Opus:* Well-chosen components that serve the FDE message (deployment-status "console", before/after comparison, bento services grid, timeline, native `<details>` FAQ, contact form). Each component is reusable and driven by tokens.

**Documentation**
- *Gemini:* Banner comments for every CSS area and an HTML comment for every section and card. The best documented.
- *Sonnet:* Only CSS section headers. No HTML comments.
- *Opus:* CSS section headers plus HTML comments for each page section.
- *None* of the three produced a README or usage notes.

**Error handling** (for a static page this means form validation, broken links, accessibility fallbacks and graceful degradation)
- *Gemini:* Labelled form fields with `required`, a `role="alert"` success message, and null checks before attaching menu listeners. However, form submission is simulated with `setTimeout`, and there is no `aria-expanded` on the menu or FAQ buttons, no visible focus style and no reduced-motion support.
- *Sonnet:* The weakest: a broken `#faq` anchor, CTA buttons pointing to `#`, no form, and a JS menu that sets inline styles with no null check and no `aria-expanded`. Without JavaScript the mobile menu does not work.
- *Opus:* Works without JavaScript (CSS-only menu, native `<details>`). It includes a skip link, `:focus-visible` outlines, `prefers-reduced-motion`, `prefers-color-scheme`, and a `required` email field. Weak points: the mobile menu checkbox is hidden with `display: none`, so keyboard users cannot open it, and the form only shows a "Thanks" message.

---

## 4. AI Hallucination Observation

None of the three models asked for the company name or any other business details (pricing, services, contact details, clients).

- **Gemini 3.8 Flash (high) – Antigravity CLI:** The tool was biased toward immediate delivery rather than asking clarifying questions. The existing files in the repository (`index.html`, `index_2.html`) only used a generic company name, so the model picked an arbitrary one (**AXIOM**).
- **Sonnet 5.0 and Opus 5.5 – Claude Code:** The session ran in **auto mode**, so every missing detail was chosen without asking (**FDEWorks** and **Fieldline**).

Because the prompt did not supply these details and the tools were set up to proceed without questions, filling the gaps with placeholder content is expected behaviour. **I do not consider it a mistake or hallucination.**

**Point to note before real use:** All three pages include invented "facts" that look real: client logos, testimonials with named people, metrics (e.g. "98% retention", "94% of pilots converted") and prices. Gemini goes further with specific compliance claims ("SOC2 & HIPAA Compliant", FedRAMP, "99.99% Uptime SLA"). These are fine as placeholders, but each one must be replaced or removed before the page is published, because false compliance or customer claims would be a real problem in production.

---

## 5. Final Decision

**Winner: Opus 5.5 (`index_opus.html`)**

| Consideration | Gemini 3.8 | Sonnet 5.0 | Opus 5.5 |
|---------------|-----------|-----------|----------|
| Code quality | Good, but bloated | Good, clean but basic | **Best: compact and modern CSS** |
| Accuracy (follows "HTML and CSS") | Uses a lot of JS + external fonts | Uses JS for the menu | **Almost pure HTML/CSS** |
| Maintainability | Hard (~3,000 lines) | Easy | **Easy: tokens, small file, light/dark from one set of variables** |
| Understanding of requirements | Strong FDE content, but over-scoped | Covers the basics; FAQ and contact form missing | **Best FDE story: problem → services → process → proof → pricing → FAQ → contact** |

**Why Opus 5.5:**
1. **Simple and user-friendly.** The page is clean, easy to scan, and the message (an engineer embedded with your customer to get pilots into production) is clear within the first screen.
2. **Closest to the prompt.** It is built almost entirely with HTML and CSS, as requested. The mobile menu and FAQ work without JavaScript.
3. **Most maintainable.** It is the smallest file with complete features, and all colours come from one set of variables (which also drives automatic dark mode).
4. **Best accessibility baseline.** It has a skip link, focus outlines, reduced-motion support and labelled form inputs.

**Runner-up: Gemini 3.8.** It has the richest content and the best comments, but it is about 3–4× larger than needed, depends on JavaScript and external fonts, and contains the riskiest invented claims.

**Third: Sonnet 5.0.** It is the most readable code, but the page is the most generic, has a broken FAQ link, no contact form, and the weakest error handling.
