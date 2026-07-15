# Modern Portfolio

A sleek, single-file personal portfolio template for any developer or engineer. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, just open and ship.

![Preview](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-5FBFB3?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-E3A548?style=flat-square)
![Single File](https://img.shields.io/badge/files-1-9B96A8?style=flat-square)

---

## ✨ Features

- **Zero dependencies** — pure HTML, CSS, and vanilla JS in a single `portfolio.html` file
- **Dark-mode-first** design with a deep charcoal/navy palette, gold (`#E3A548`) and teal (`#5FBFB3`) accents
- **Animated hero** with a gradient-shift heading, hero code-editor typing effect, and a floating device mockup
- **Floating particle canvas** and mouse-glow follower for a premium, alive feel
- **Scroll-reveal system** — elements fade/slide/scale in using `IntersectionObserver` (respects `prefers-reduced-motion`)
- **Terminal stats panel** with animated number counters
- **Git-log experience timeline** — career history styled as a commit graph
- **`skills.json` panel** — tech stack displayed as a package dependency tree with hover glow tags
- **Project cards** with gradient border glow and spring lift on hover
- **Testimonials** with shimmer sweep animation
- **Sticky nav** with backdrop blur, scroll shadow, and a mobile hamburger toggle
- **Responsive** down to mobile breakpoints (`≤860px`)
- **Google Fonts** — Space Grotesk · IBM Plex Sans · JetBrains Mono

---

## 🚀 Getting Started

No build tools required. Just open the file in a browser:

```bash
# Clone the repo
git clone https://github.com/jamaghafoor/modern-portfolio.git
cd modern-portfolio

# Open directly
open portfolio.html        # macOS
start portfolio.html       # Windows
xdg-open portfolio.html    # Linux
```

Or serve it locally (recommended for font loading):

```bash
npx serve .
# → http://localhost:3000/portfolio.html
```

---

## 🛠 Customisation

All personal content is clearly marked with `[Placeholder …]` / `[X]` tokens in the HTML. Search and replace to make it yours:

| Section          | What to change                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **Hero**         | Name, role, company, city/country, years of experience, team size                        |
| **Stats**        | `data-count` values on `.val` elements in the terminal panel                             |
| **About**        | Two bio paragraphs and the four engineering principles                                   |
| **Experience**   | Company names, dates, and bullet achievements                                            |
| **Skills**       | Tag lists inside each skill group (e.g. core languages, frameworks, tooling, leadership) |
| **Projects**     | App names, descriptions, tech tags, and impact metrics                                   |
| **Testimonials** | Quote text and attribution                                                               |
| **Contact**      | Email address and GitHub / LinkedIn URLs                                                 |
| **Footer**       | Copyright name                                                                           |

### Design tokens

All colours, fonts, and spacing are CSS custom properties at the top of `<style>`:

```css
:root {
  --bg-base: #1b1a20; /* page background */
  --bg-panel: #242230; /* card / panel background */
  --accent-gold: #e3a548; /* primary CTA, headings */
  --accent-teal: #5fbfb3; /* secondary, links, prompts */
  --text-primary: #f3efe7;
  --text-muted: #9b96a8;
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "IBM Plex Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

---

## 📁 Project Structure

```
modern-portfolio/
├── portfolio.html   # Entire site — HTML, CSS, and JS in one file
├── LICENSE          # MIT
└── README.md
```

---

## ♿ Accessibility & Performance

- All interactive elements have `:focus-visible` outlines
- Animations respect `prefers-reduced-motion` (all transitions collapse to instant)
- Semantic HTML5 (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`)
- Single `<h1>` per page with logical heading hierarchy
- No external JS — no render-blocking scripts

---

## 📄 License

[MIT](./LICENSE) — free to use, adapt, and redistribute. Attribution appreciated but not required.

---

## 👤 Built by

**Abdul Ghafoor**

- GitHub: [@jamaghafoor](https://github.com/jamaghafoor)
- Email: [abdulghafoor1525@gmail.com](mailto:abdulghafoor1525@gmail.com)
