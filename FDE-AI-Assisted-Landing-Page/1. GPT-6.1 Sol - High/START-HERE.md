# FDE Studio landing page

A responsive, framework-free landing page built with semantic HTML and CSS.

Open `index.html` directly in a browser. For a local preview server, run:

```powershell
node serve.cjs
```

Then visit http://localhost:3000. Stop the server with Ctrl+C.

## Customization

- Edit `index.html` for brand, service descriptions, FAQs, and calls to action.
- Edit the variables at the start of `styles.css` for colors and typography.
- The contact CTA downloads `assets/project-brief.txt`. Replace it with your real booking URL or contact endpoint when available. No email address, booking service, or backend is assumed.
- DM Sans and Manrope load from Google Fonts; local Arial fallbacks keep the page usable offline.
- The engineering illustration uses HTML, CSS, and inline SVG. It needs no external image assets or JavaScript.

Includes mobile and tablet layouts, keyboard focus states, a skip link, native expandable FAQs, and reduced-motion support. The workflow graphic is illustrative, not a performance claim.
