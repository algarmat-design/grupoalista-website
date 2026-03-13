# Implementation Plan: Frontend Decoupling

## Overview

Extract all inline CSS and JavaScript from `index.html` into external files
under `assets/css/` and `assets/js/`, organized using an ITCSS-inspired layered
CSS methodology. Each task builds incrementally — starting with design tokens,
layering CSS files by specificity, extracting JS, updating HTML references, and
wiring everything together.

## Tasks

- [x] 1. Create CSS design tokens file
  - [x] 1.1 Create `assets/css/tokens.css` with all `:root` CSS custom
        properties
    - Extract all 14 CSS custom properties from the inline `<style>` block in
      `index.html`
    - Define them in a single `:root` block: `--copper`, `--copper-light`,
      `--steel`, `--steel-light`, `--charcoal`, `--charcoal-light`, `--surface`,
      `--surface-hover`, `--text-primary`, `--text-secondary`, `--text-muted`,
      `--border`, `--glow-copper`, `--glow-steel`
    - Remove the `.gitkeep` file from `assets/css/`
    - _Requirements: 3.2, 6.2_

  - [x] 1.2 Write property test for design tokens — no preprocessor syntax
    - **Property 4: No preprocessor syntax in CSS files**
    - Verify `tokens.css` contains no Sass `$variables`, `@mixin`, `@include`,
      `@extend`, Less `.mixin()` calls, or Stylus syntax
    - **Validates: Requirements 6.2**

- [x] 2. Create CSS base/reset file
  - [x] 2.1 Create `assets/css/base.css` with reset and element-level typography
    - Extract `*`, `*::before`, `*::after` reset rules
    - Extract `html` and `body` base styles
    - Extract `.heading-display` and `.heading-sans` font-family declarations
    - _Requirements: 3.1, 3.3_

- [x] 3. Create CSS layout file
  - [x] 3.1 Create `assets/css/layout.css` with structural layout styles
    - Extract `nav`, `.nav-*` navigation styles
    - Extract `.container`, `.section-padding`, `.section-label`,
      `.section-title`, `.section-divider` layout rules
    - Extract grid structures: `.about-grid`, `.contact-grid`,
      `.companies-grid`, `.companies-bottom`
    - _Requirements: 3.1, 3.3, 3.4_

- [x] 4. Create CSS components file
  - [x] 4.1 Create `assets/css/components.css` with all component styles
    - Extract `.hero-*` hero section styles
    - Extract `.about-*` about section styles
    - Extract `.purpose-*` purpose section styles
    - Extract `.company-card`, `.card-*` company card styles
    - Extract `.contact-*`, `.form-*` contact form styles
    - Extract `.btn-*` button styles
    - Extract `.social-*` social link styles
    - Extract `footer` styles
    - _Requirements: 3.1, 3.3, 3.4, 5.4_

  - [x] 4.2 Write property test for BEM-like class naming
    - **Property 1: BEM-like class naming consistency**
    - Parse all class selectors from external stylesheets and verify each
      matches the kebab-case BEM-like regex pattern
    - **Validates: Requirements 3.3**

  - [x] 4.3 Write property test for interactive state preservation
    - **Property 3: Interactive element state preservation**
    - For each interactive element (`a`, `button`, `input`, `textarea`) with
      `:hover` or `:focus` in the original inline CSS, verify the external
      stylesheets contain a matching rule
    - **Validates: Requirements 5.4**

- [x] 5. Create CSS utilities file
  - [x] 5.1 Create `assets/css/utilities.css` with animations and utility
        classes
    - Extract `.reveal`, `.reveal.visible`, `.reveal-delay-*` scroll reveal
      classes
    - Extract `@keyframes fadeUp`, `@keyframes float`, `@keyframes scrollPulse`
      animation definitions
    - _Requirements: 3.1_

- [x] 6. Create CSS responsive file
  - [x] 6.1 Create `assets/css/responsive.css` with all media queries
    - Extract all `@media` rules from the inline styles
    - Organize by breakpoint: `max-width: 1024px` → `max-width: 768px` →
      `max-width: 480px`
    - Include mobile navigation toggle visibility, single-column grid layouts,
      and stats grid adjustments
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 6.2 Write property test for media query breakpoint direction
    - **Property 2: Consistent media query breakpoint direction**
    - Extract all `@media` rules and verify each uses `max-width` with a value
      from the allowed set: `1024px`, `768px`, `480px`
    - **Validates: Requirements 4.6**

- [x] 7. Checkpoint — Verify CSS extraction
  - Ensure all six CSS files exist in `assets/css/` with correct content
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Extract JavaScript into external file
  - [x] 8.1 Create `assets/js/main.js` with all interactive behaviors
    - Extract navbar scroll effect (class toggle on `#navbar`)
    - Extract mobile menu toggle (`#mobileToggle` and `#navLinks`)
    - Extract IntersectionObserver scroll reveal for `.reveal` elements
    - Extract smooth anchor scrolling for `a[href^="#"]` links
    - Wrap in `DOMContentLoaded` listener or rely on end-of-body placement
    - Remove the `.gitkeep` file from `assets/js/`
    - _Requirements: 2.1, 2.3, 6.3_

  - [x] 8.2 Write property test for standard script-mode JavaScript
    - **Property 5: Standard script-mode JavaScript**
    - Verify `main.js` contains no `import`/`export` statements or
      TypeScript-specific syntax
    - **Validates: Requirements 6.3**

- [x] 9. Update `index.html` to reference external files
  - [x] 9.1 Replace inline `<style>` block with `<link>` tags in `<head>`
    - Add six `<link rel="stylesheet">` tags in cascade order: tokens.css →
      base.css → layout.css → components.css → utilities.css → responsive.css
    - Remove the entire `<style>...</style>` block
    - Verify all `<link>` tags are in the `<head>` section
    - _Requirements: 1.1, 1.2, 3.5, 7.1, 7.2_

  - [x] 9.2 Replace inline `<script>` block with external script reference
    - Add `<script src="assets/js/main.js"></script>` at the end of `<body>`
    - Remove the entire inline `<script>...</script>` block
    - Verify the `<script>` tag is after all `<link>` stylesheet tags
    - _Requirements: 2.1, 2.2, 7.2_

  - [x] 9.3 Verify HTML semantic structure is preserved
    - Confirm all semantic elements remain: `nav`, `section`, `footer`, `form`,
      `label`, `button`
    - Confirm all `aria-label` attributes remain on mobile toggle and social
      links
    - _Requirements: 5.1, 5.2_

- [x] 10. Checkpoint — Verify full integration
  - Ensure all CSS and JS files are correctly linked from `index.html`
  - Ensure no inline `<style>` or `<script>` tags remain
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Linting and formatting validation
  - [x] 11.1 Run Stylelint on all external CSS files
    - Execute `npm run lint:css` and fix any errors
    - _Requirements: 1.4, 8.1_

  - [x] 11.2 Run ESLint on all external JS files
    - Execute `npm run lint:js` and fix any errors
    - _Requirements: 2.4, 8.2_

  - [x] 11.3 Run Prettier formatting check
    - Execute `npm run format:check` and fix any formatting issues
    - _Requirements: 1.5, 2.5, 8.3_

  - [x] 11.4 Verify lint-staged configuration covers new files
    - Confirm `package.json` lint-staged globs (`*.css`, `*.js`) match the new
      external files
    - _Requirements: 8.4_

- [x] 12. Final checkpoint — Ensure all tests pass
  - Run all linting, formatting, and property-based tests
  - Verify visual rendering is identical across all breakpoints (1024px, 768px,
    480px, default)
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after CSS extraction and full
  integration
- Property tests use fast-check and validate universal correctness properties
  from the design document
- The CSS cascade order (tokens → base → layout → components → utilities →
  responsive) is critical — tasks are sequenced accordingly
