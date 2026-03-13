/**
 * Feature: frontend-decoupling, Property 1: BEM-like class naming consistency
 *
 * Validates: Requirements 3.3
 *
 * For any CSS class selector in the external stylesheets, the class name
 * should match the kebab-case BEM-like pattern (e.g., block-name,
 * block-name__element, block-name--modifier) — specifically the regex:
 * ^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS_DIR = join(process.cwd(), 'assets', 'css');

/**
 * BEM-like kebab-case regex from the design document.
 */
const BEM_PATTERN =
  /^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$/;

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
 * Extract all class names from CSS file content.
 * Matches `.class-name` patterns in selectors, stripping pseudo-classes/elements.
 */
function extractClassNames(cssContent) {
  const classNames = new Set();

  // Match class selectors: a dot followed by an identifier
  // This regex captures .className patterns from selector rules
  const classRegex = /\.([a-zA-Z_][\w-]*)/g;
  let match;

  while ((match = classRegex.exec(cssContent)) !== null) {
    const className = match[1];
    // Skip if this looks like a file extension (e.g., inside url())
    // or a decimal number (e.g., opacity: 0.5)
    const before = cssContent.substring(Math.max(0, match.index - 20), match.index);
    if (/url\s*\([^)]*$/.test(before) || /[\d]$/.test(before)) {
      continue;
    }
    classNames.add(className);
  }

  return [...classNames];
}

describe('Property 1: BEM-like class naming consistency', () => {
  const cssFiles = getCssFiles();
  const allClassNames = cssFiles.flatMap((file) =>
    extractClassNames(file.content).map((className) => ({
      file: file.name,
      className
    }))
  );

  it('should find at least one CSS file in assets/css/', () => {
    expect(cssFiles.length).toBeGreaterThan(0);
  });

  it('should find class selectors in the stylesheets', () => {
    expect(allClassNames.length).toBeGreaterThan(0);
  });

  it('all class names match BEM-like kebab-case pattern (property-based)', () => {
    const classArb = fc.constantFrom(...allClassNames);

    fc.assert(
      fc.property(classArb, ({ _file, className }) => {
        const matches = BEM_PATTERN.test(className);
        if (!matches) {
          return false;
        }
        return true;
      }),
      {
        numRuns: Math.max(100, allClassNames.length * 3),
        verbose: 1
      }
    );
  });

  // Exhaustive check: verify every class name across all files
  it('exhaustive scan — every class name matches BEM-like pattern', () => {
    for (const { file, className } of allClassNames) {
      expect(
        BEM_PATTERN.test(className),
        `Class ".${className}" in ${file} does not match BEM-like pattern`
      ).toBe(true);
    }
  });
});
