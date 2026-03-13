/**
 * Feature: frontend-decoupling, Property 2: Consistent media query breakpoint direction
 *
 * Validates: Requirements 4.6
 *
 * For any @media rule in the external stylesheets, the media query should use
 * max-width consistently (preserving the existing desktop-first pattern), and
 * the breakpoint values should be one of the defined set: 1024px, 768px, 480px.
 *
 * Accepts both traditional syntax: @media (max-width: 1024px)
 * and modern range syntax: @media (width <= 1024px)
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS_DIR = join(process.cwd(), 'assets', 'css');

const ALLOWED_BREAKPOINTS = ['1024px', '768px', '480px'];

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
 * Extract all @media rules from CSS content.
 * Returns an array of objects with the raw media query string and source file.
 *
 * Matches both:
 *   @media (max-width: 1024px)   — traditional syntax
 *   @media (width <= 1024px)     — modern range syntax
 */
function extractMediaQueries(cssContent, fileName) {
  const queries = [];
  const mediaRegex = /@media\s*\(([^)]+)\)/g;
  let match;

  while ((match = mediaRegex.exec(cssContent)) !== null) {
    queries.push({
      file: fileName,
      raw: match[0],
      condition: match[1].trim()
    });
  }

  return queries;
}

/**
 * Validate that a media query condition uses max-width (traditional or range syntax)
 * with an allowed breakpoint value.
 *
 * Accepted forms:
 *   max-width: 1024px
 *   width <= 1024px
 */
function isValidBreakpoint(condition) {
  // Traditional: max-width: <value>
  const traditionalMatch = condition.match(/^max-width\s*:\s*(\d+px)$/);
  if (traditionalMatch) {
    return ALLOWED_BREAKPOINTS.includes(traditionalMatch[1]);
  }

  // Modern range: width <= <value>
  const rangeMatch = condition.match(/^width\s*<=\s*(\d+px)$/);
  if (rangeMatch) {
    return ALLOWED_BREAKPOINTS.includes(rangeMatch[1]);
  }

  return false;
}

describe('Property 2: Consistent media query breakpoint direction', () => {
  const cssFiles = getCssFiles();
  const allMediaQueries = cssFiles.flatMap((file) => extractMediaQueries(file.content, file.name));

  it('should find at least one CSS file in assets/css/', () => {
    expect(cssFiles.length).toBeGreaterThan(0);
  });

  it('should find @media rules in the stylesheets', () => {
    expect(allMediaQueries.length).toBeGreaterThan(0);
  });

  it('every @media rule uses max-width with an allowed breakpoint (property-based)', () => {
    const queryArb = fc.constantFrom(...allMediaQueries);

    fc.assert(
      fc.property(queryArb, ({ _file, _raw, condition }) => {
        return isValidBreakpoint(condition);
      }),
      {
        numRuns: Math.max(100, allMediaQueries.length * 10),
        verbose: 1
      }
    );
  });

  // Exhaustive check: verify every media query across all files
  it('exhaustive scan — every @media rule uses an allowed breakpoint', () => {
    for (const { file, raw, condition } of allMediaQueries) {
      expect(
        isValidBreakpoint(condition),
        `Media query "${raw}" in ${file} does not use max-width (or width <=) with an allowed breakpoint (${ALLOWED_BREAKPOINTS.join(', ')})`
      ).toBe(true);
    }
  });
});
