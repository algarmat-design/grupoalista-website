---
inclusion: auto
---

# Project Structure

## Directory Organization

```
grupoalista-website/
├── index.html              # Single-page landing site
├── assets/                 # Static assets
│   ├── css/                # Stylesheets (currently inline in index.html)
│   ├── js/                 # JavaScript files (currently inline in index.html)
│   ├── fonts/              # Custom fonts (using Google Fonts)
│   └── images/
│       ├── logos/          # Brand and division logos
│       ├── hero/           # Hero section media
│       └── about/          # About section images
├── .github/                # GitHub configuration
├── .kiro/                  # Kiro AI assistant configuration
│   └── steering/           # AI guidance documents
└── [config files]          # Linting, formatting, security configs
```

## Architecture Patterns

### Single-Page Application

- All content in `index.html` with inline styles and scripts
- Smooth scroll navigation between sections
- No routing or page transitions required

### CSS Architecture

- **CSS Variables** — Design tokens in `:root` for colors, spacing
- **BEM-like naming** — Semantic class names (e.g., `hero-content`,
  `company-card`)
- **Mobile-first responsive** — Media queries at 1024px, 768px, 480px
- **Utility classes** — Reveal animations, section padding, containers

### JavaScript Patterns

- Vanilla JS with no dependencies
- Event-driven interactions (scroll, navigation, form handling)
- Intersection Observer for scroll animations
- Progressive enhancement approach

## Key Sections

1. **Navigation** — Fixed header with smooth scroll links
2. **Hero** — Full-screen intro with animated elements
3. **About** — Founder story and company stats
4. **Purpose** — Mission statement
5. **Companies** — Grid of 5 business lines with cards
6. **Contact** — Contact form and information
7. **Footer** — Copyright and legal

## Asset Conventions

### Images

- **Logos** — PNG format in `assets/images/logos/`
  - `logo-main.png` — Primary Grupo Alista logo
  - `logo-[division].png` — Individual business line logos
- **Placeholders** — Marked with comments for hero video, founder image

### Naming Conventions

- **Files** — kebab-case (e.g., `logo-consulting.png`)
- **CSS Classes** — kebab-case with BEM-like structure
- **IDs** — camelCase for JavaScript targets (e.g., `navLinks`)

## Code Style

### HTML

- Semantic HTML5 elements
- WCAG 2.0 AA accessibility compliance
- Alt text required for images
- Proper heading hierarchy

### CSS

- 2-space indentation
- Single quotes for strings
- Long-form hex colors (`#ffffff` not `#fff`)
- Organized by sections with comment headers

### JavaScript

- 2-space indentation
- Single quotes for strings
- Semicolons required
- ES2021+ features allowed
- No console logs in production

## Configuration Files

- `.editorconfig` — Editor settings (2-space indent, LF line endings)
- `.prettierrc` — Code formatting (100 char width, 120 for HTML)
- `.eslintrc.json` — JavaScript rules (ES2021, browser environment)
- `.stylelintrc.json` — CSS rules (standard config)
- `.htmlhintrc` — HTML validation rules
- `.pa11yci.json` — Accessibility testing config
- `.pre-commit-config.yaml` — Git hooks for quality checks
