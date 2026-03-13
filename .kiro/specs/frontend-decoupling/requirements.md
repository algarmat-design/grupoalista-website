# Requirements Document

## Introduction

This document defines the requirements for decoupling the Grupo Alista landing
page frontend architecture. Currently, all CSS (~900 lines) and JavaScript (~50
lines) are inline within `index.html` (1349 total lines). The goal is to extract
these into separate files under `assets/css/` and `assets/js/`, introduce a
scalable CSS methodology, and ensure responsive design best practices — all
while preserving the existing visual design, brand identity, and static-site
deployment model.

## Glossary

- **Landing_Page**: The single-page Grupo Alista website served from
  `index.html`
- **Build_System**: An optional toolchain (e.g., PostCSS, Sass) that processes
  source files into production-ready assets
- **CSS_Methodology**: A systematic approach to organizing CSS (e.g., BEM,
  ITCSS, CUBE CSS) for maintainability and scalability
- **Design_Tokens**: CSS custom properties (variables) that define the brand's
  visual language (colors, spacing, typography)
- **Breakpoint**: A viewport width threshold at which the layout adapts
  (currently 1024px, 768px, 480px)
- **Critical_CSS**: The minimal CSS required to render above-the-fold content
  without a flash of unstyled content (FOUC)
- **External_Stylesheet**: A `.css` file linked via `<link>` tag in the HTML
  document head
- **External_Script**: A `.js` file linked via `<script>` tag in the HTML
  document
- **Inline_Style**: CSS written inside a `<style>` tag directly in the HTML
  document
- **Inline_Script**: JavaScript written inside a `<script>` tag directly in the
  HTML document
- **FOUC**: Flash of Unstyled Content — a brief moment where HTML renders
  without styles applied
- **Linting_Pipeline**: The set of tools (Stylelint, ESLint, HTMLHint, Prettier)
  that validate code quality

## Requirements

### Requirement 1: Extract Inline CSS into External Stylesheets

**User Story:** As a frontend developer, I want all inline CSS extracted from
`index.html` into external stylesheet files in `assets/css/`, so that styles are
maintainable, cacheable, and lintable by the existing Stylelint pipeline.

#### Acceptance Criteria

1. WHEN the Landing_Page loads, THE Landing_Page SHALL link to one or more
   External_Stylesheets located in `assets/css/`.
2. WHEN the extraction is complete, THE `index.html` file SHALL contain zero
   `<style>` tags with Inline_Styles.
3. THE External_Stylesheets SHALL produce a visual rendering identical to the
   current Inline_Style rendering across all Breakpoints (1024px, 768px, 480px,
   and default).
4. WHEN the Linting_Pipeline runs `npm run lint:css`, THE External_Stylesheets
   SHALL pass Stylelint validation with zero errors.
5. WHEN the Linting_Pipeline runs `npm run format:check`, THE
   External_Stylesheets SHALL pass Prettier formatting validation.

### Requirement 2: Extract Inline JavaScript into External Scripts

**User Story:** As a frontend developer, I want all inline JavaScript extracted
from `index.html` into external script files in `assets/js/`, so that scripts
are maintainable, cacheable, and lintable by the existing ESLint pipeline.

#### Acceptance Criteria

1. WHEN the Landing_Page loads, THE Landing_Page SHALL link to one or more
   External_Scripts located in `assets/js/`.
2. WHEN the extraction is complete, THE `index.html` file SHALL contain zero
   `<script>` tags with Inline_Scripts.
3. THE External_Scripts SHALL preserve all existing interactive behaviors:
   navbar scroll effect, mobile menu toggle, scroll reveal animations, and
   smooth anchor scrolling.
4. WHEN the Linting_Pipeline runs `npm run lint:js`, THE External_Scripts SHALL
   pass ESLint validation with zero errors.
5. WHEN the Linting_Pipeline runs `npm run format:check`, THE External_Scripts
   SHALL pass Prettier formatting validation.

### Requirement 3: Organize CSS with a Scalable Methodology

**User Story:** As a frontend developer, I want the extracted CSS organized
using a clear methodology, so that styles are predictable, modular, and easy to
extend with future CSS frameworks or components.

#### Acceptance Criteria

1. THE External_Stylesheets SHALL be organized into logical files following a
   CSS_Methodology (e.g., base/reset, tokens/variables, layout, components,
   utilities).
2. THE External_Stylesheets SHALL define all Design_Tokens (colors, typography,
   spacing) as CSS custom properties in a dedicated variables or tokens file.
3. THE External_Stylesheets SHALL use consistent class naming following the
   existing BEM-like convention (kebab-case with semantic names).
4. WHEN a new section or component is added to the Landing_Page, THE
   CSS_Methodology SHALL allow the developer to add styles in a predictable file
   location without modifying unrelated files.
5. THE `index.html` file SHALL load the External_Stylesheets in the correct
   cascade order to preserve specificity and override behavior.

### Requirement 4: Preserve Responsive Design Across All Breakpoints

**User Story:** As a user on any device, I want the landing page to render
correctly on mobile, tablet, and desktop viewports, so that the experience is
consistent regardless of screen size.

#### Acceptance Criteria

1. THE External_Stylesheets SHALL include responsive rules for all existing
   Breakpoints: 1024px, 768px, and 480px.
2. WHEN the viewport width is 768px or less, THE Landing_Page SHALL display the
   mobile navigation toggle and hide the desktop navigation links.
3. WHEN the viewport width is 768px or less, THE companies grid SHALL display in
   a single-column layout.
4. WHEN the viewport width is 1024px or less, THE about-grid and contact-grid
   SHALL switch from two-column to single-column layout.
5. WHEN the viewport width is 480px or less, THE about-stats grid SHALL switch
   from a three-column to a single-column centered layout.
6. THE External_Stylesheets SHALL use a mobile-first approach where base styles
   target small screens and media queries progressively enhance for larger
   viewports.

### Requirement 5: Maintain HTML Semantic Structure and Accessibility

**User Story:** As a user relying on assistive technology, I want the HTML
structure to remain semantically correct and accessible after the decoupling, so
that the page continues to meet accessibility standards.

#### Acceptance Criteria

1. WHEN the decoupling is complete, THE `index.html` file SHALL retain all
   existing semantic HTML5 elements (`nav`, `section`, `footer`, `form`,
   `label`, `button`).
2. WHEN the decoupling is complete, THE `index.html` file SHALL retain all
   existing ARIA attributes (`aria-label` on the mobile toggle and social
   links).
3. WHEN the Pa11y CI accessibility test runs, THE Landing_Page SHALL produce
   zero new accessibility violations compared to the current baseline.
4. THE External_Stylesheets SHALL preserve all existing focus and hover states
   for interactive elements (links, buttons, form inputs).

### Requirement 6: Ensure Zero-Build Static Deployment Compatibility

**User Story:** As a developer deploying the site, I want the decoupled site to
remain deployable as a static site without a mandatory build step, so that the
deployment workflow stays simple.

#### Acceptance Criteria

1. THE Landing_Page SHALL function correctly when served directly from the file
   system or any static web server without a build step.
2. THE External_Stylesheets SHALL use standard CSS syntax compatible with all
   modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions) without
   requiring a preprocessor.
3. THE External_Scripts SHALL use standard ES2021+ JavaScript compatible with
   all modern browsers without requiring a transpiler or bundler.
4. IF a Build_System is introduced (e.g., for CSS preprocessing or
   minification), THEN THE Landing_Page SHALL also function without running the
   Build_System by serving the source files directly.

### Requirement 7: Prevent Flash of Unstyled Content

**User Story:** As a user visiting the landing page, I want the page to render
with styles applied immediately, so that I do not see a flash of unstyled
content during page load.

#### Acceptance Criteria

1. WHEN the Landing_Page loads, THE External_Stylesheets SHALL be linked in the
   `<head>` section of `index.html` as render-blocking resources.
2. THE External_Stylesheets SHALL load before any External_Scripts to ensure
   styles are applied before JavaScript executes.
3. WHEN the Landing_Page loads on a typical broadband connection, THE
   Landing_Page SHALL render with all styles applied without a visible FOUC.

### Requirement 8: Maintain Existing Linting and Formatting Configuration Compatibility

**User Story:** As a developer, I want the new file structure to work seamlessly
with the existing linting and formatting tools, so that code quality checks
continue to function without configuration changes.

#### Acceptance Criteria

1. WHEN `npm run lint:css` executes, THE Linting_Pipeline SHALL discover and
   lint all External_Stylesheets in `assets/css/`.
2. WHEN `npm run lint:js` executes, THE Linting_Pipeline SHALL discover and lint
   all External_Scripts in `assets/js/`.
3. WHEN `npm run format` executes, THE Linting_Pipeline SHALL format all
   External_Stylesheets and External_Scripts.
4. THE existing lint-staged configuration SHALL automatically lint and format
   External_Stylesheets and External_Scripts on git commit.
