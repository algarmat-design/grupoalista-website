/**
 * Feature: frontend-decoupling, Property 3: Interactive element state preservation
 *
 * Validates: Requirements 5.4
 *
 * For any interactive element selector (a, button, input, textarea) that has
 * a :hover or :focus pseudo-class rule in the original inline CSS, the external
 * stylesheets should also contain a corresponding :hover or :focus rule for
 * that same selector.
 *
 * Since the inline CSS has been extracted into external files, the known set of
 * interactive state selectors from the original inline CSS is defined as a constant.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS_DIR = join(process.cwd(), 'assets', 'css');

/**
 * Known interactive :hover/:focus selectors that existed in the original inline CSS.
 * These must all be preserved in the external stylesheets.
 */
const ORIGINAL_INTERACTIVE_SELECTORS = [
  '.nav-links a:hover',
  '.nav-cta:hover',
  '.btn-primary:hover',
  '.btn-secondary:hover',
  '.company-card:hover',
  '.company-card:hover .card-logo-bg',
  '.company-card:hover .card-logo-main',
  '.company-card:hover .card-link',
  '.contact-item-text a:hover',
  '.form-group input:focus',
  '.form-group textarea:focus',
  '.social-link:hover',
  '.social-link:hover svg'
];

/**
 * Collect all CSS files from assets/css/.
 */
function getCssFiles() {
  const files = readdirSync(CSS_DIR).filter((f) => f.endsWith('.css'));
  return files.map((f) => ({
    name: f,
    content: readFileSync(join(CSS_DIR, f), 'utf-8')
  }));
}

/**
 * Normalize a selector for comparison: collapse whitespace, lowercase.
 */
function normalizeSelector(selector) {
  return selector.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Extract all selectors from CSS content.
 */
function extractAllSelectors(cssContent) {
  const selectors = [];
  const ruleRegex = /([^{}@]+?)\s*\{/g;
  let match;

  while ((match = ruleRegex.exec(cssContent)) !== null) {
    const selectorGroup = match[1].trim();
    if (selectorGroup.startsWith('@') || selectorGroup === '') {
      continue;
    }

    const individualSelectors = selectorGroup.split(',').map((s) => s.trim());
    selectors.push(...individualSelectors);
  }

  return selectors;
}

/**
 * Check if a selector has a matching rule in the combined external CSS content.
 */
function hasMatchingRule(originalSelector, externalCssContent) {
  const normalized = normalizeSelector(originalSelector);
  const externalSelectors = extractAllSelectors(externalCssContent);

  return externalSelectors.some((extSel) => normalizeSelector(extSel) === normalized);
}

describe('Property 3: Interactive element state preservation', () => {
  const cssFiles = getCssFiles();
  const combinedExternalCss = cssFiles.map((f) => f.content).join('\n');

  it('should have a known set of original interactive :hover/:focus selectors', () => {
    expect(ORIGINAL_INTERACTIVE_SELECTORS.length).toBeGreaterThan(0);
  });

  it('should find at least one CSS file in assets/css/', () => {
    expect(cssFiles.length).toBeGreaterThan(0);
  });

  it('every interactive :hover/:focus rule from inline CSS exists in external stylesheets (property-based)', () => {
    const selectorEntries = ORIGINAL_INTERACTIVE_SELECTORS.map((selector) => ({
      selector,
      normalized: normalizeSelector(selector)
    }));

    const selectorArb = fc.constantFrom(...selectorEntries);

    fc.assert(
      fc.property(selectorArb, ({ selector }) => {
        return hasMatchingRule(selector, combinedExternalCss);
      }),
      {
        numRuns: Math.max(100, selectorEntries.length * 10),
        verbose: 1
      }
    );
  });

  it('exhaustive scan — every interactive :hover/:focus selector is preserved', () => {
    for (const selector of ORIGINAL_INTERACTIVE_SELECTORS) {
      expect(
        hasMatchingRule(selector, combinedExternalCss),
        `Interactive state selector "${selector}" from inline CSS not found in external stylesheets`
      ).toBe(true);
    }
  });
});
