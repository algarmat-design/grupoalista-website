/**
 * Feature: frontend-decoupling, Property 4: No preprocessor syntax in CSS files
 *
 * Validates: Requirements 6.2
 *
 * For any CSS file in assets/css/, the file content should not contain
 * preprocessor-specific syntax patterns such as Sass $variable declarations,
 * @mixin, @include, @extend (Sass), Less .mixin() calls, or Stylus
 * indentation-based syntax. All files should be valid standard CSS.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS_DIR = join(process.cwd(), 'assets', 'css');

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
 * Split CSS content into individual lines for line-level scanning.
 */
function getLines(content) {
  return content.split('\n');
}

/**
 * Preprocessor syntax patterns to detect.
 */
const PREPROCESSOR_PATTERNS = [
  // Sass $variable declarations or usages (not inside CSS string literals)
  { name: 'Sass $variable', regex: /(?<!\w)\$[a-zA-Z_][\w-]*/m },
  // Sass @mixin
  { name: 'Sass @mixin', regex: /@mixin\s/m },
  // Sass @include
  { name: 'Sass @include', regex: /@include\s/m },
  // Sass @extend
  { name: 'Sass @extend', regex: /@extend\s/m },
  // Less .mixin() calls — a dot-prefixed identifier followed by parentheses
  // Exclude standard CSS like .class { ... } by requiring ()
  { name: 'Less .mixin() call', regex: /^\s*\.[a-zA-Z][\w-]*\s*\(/m },
  // Stylus: lines with property: value without braces or semicolons
  // (indentation-based syntax marker — a property assignment without { } ; on a non-comment line)
  // We detect Stylus by looking for its unique assignment operator "=" for variables
  { name: 'Stylus variable assignment', regex: /^[a-zA-Z_][\w-]*\s*=\s*[^=]/m }
];

describe('Property 4: No preprocessor syntax in CSS files', () => {
  const cssFiles = getCssFiles();

  it('should find at least one CSS file in assets/css/', () => {
    expect(cssFiles.length).toBeGreaterThan(0);
  });

  it('no CSS file contains preprocessor-specific syntax (property-based)', () => {
    // Use fast-check to sample random lines from random CSS files
    // and verify none match preprocessor patterns.
    const allFileLines = cssFiles.flatMap((file) =>
      getLines(file.content).map((line, idx) => ({
        file: file.name,
        lineNumber: idx + 1,
        line
      }))
    );

    // We need at least some lines to test
    expect(allFileLines.length).toBeGreaterThan(0);

    // Arbitrary that picks from the actual CSS lines
    const cssLineArb = fc.constantFrom(...allFileLines);

    fc.assert(
      fc.property(cssLineArb, ({ _file, _lineNumber, line }) => {
        for (const pattern of PREPROCESSOR_PATTERNS) {
          const match = pattern.regex.test(line);
          if (match) {
            return false;
          }
        }
        return true;
      }),
      {
        numRuns: Math.max(100, allFileLines.length * 3),
        verbose: 1
      }
    );
  });

  // Exhaustive check: verify every single line across all files
  it('exhaustive scan — no file contains any preprocessor pattern', () => {
    for (const file of cssFiles) {
      for (const pattern of PREPROCESSOR_PATTERNS) {
        const match = pattern.regex.test(file.content);
        expect(match, `${file.name} contains ${pattern.name} syntax`).toBe(false);
      }
    }
  });
});
