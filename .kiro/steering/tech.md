---
inclusion: auto
---

# Technology Stack

## Core Technologies

- **HTML5** — Semantic markup with accessibility considerations
- **CSS3** — Custom styling with CSS variables, no frameworks
- **Vanilla JavaScript** — No frameworks or libraries required
- **Static Site** — No build process, deployable to any static host

## Development Environment

- **Node.js** — v18.0.0+ required for tooling
- **Package Manager** — npm (package-lock.json present)

## Code Quality Tools

### Linting

- **HTMLHint** — HTML validation (`.htmlhintrc`)
- **Stylelint** — CSS linting with standard config (`.stylelintrc.json`)
- **ESLint** — JavaScript linting (`.eslintrc.json`)
- **Vale** — Prose/content linting (`.vale.ini`)

### Formatting

- **Prettier** — Code formatting (`.prettierrc`)
- **EditorConfig** — Editor consistency (`.editorconfig`)

### Security

- **Gitleaks** — Secret detection (`.gitleaks.toml`)
- **detect-secrets** — Baseline secret scanning (`.secrets.baseline`)
- **Pre-commit hooks** — Automated checks before commits

### Accessibility

- **Pa11y CI** — WCAG 2.0 AA compliance testing (`.pa11yci.json`)

## Common Commands

```bash
# Development
python -m http.server 8000  # Python 3 local server
npx serve .                 # Node.js local server

# Code Quality
npm run lint                # Run all linters
npm run lint:html           # HTML validation
npm run lint:css            # CSS linting
npm run lint:js             # JavaScript linting
npm run lint:prose          # Content/prose linting

# Formatting
npm run format              # Format all files
npm run format:check        # Check formatting without changes

# Validation
npm run validate            # Run all linting and format checks

# Git Hooks
npm run prepare             # Install husky git hooks
```

## Deployment

Static site compatible with:

- GitHub Pages
- Netlify
- Vercel
- Any web server (Apache, Nginx, etc.)

No build step required — deploy files directly.
