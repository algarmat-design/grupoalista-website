/**
 * Feature: frontend-decoupling, Property 5: Standard script-mode JavaScript
 *
 * Validates: Requirements 6.3
 *
 * For any JavaScript file in assets/js/, the file should not contain
 * ES module syntax (import/export statements) or TypeScript-specific syntax
 * (type annotations, interfaces, enums), ensuring it can be loaded as a
 * classic script without a bundler or transpiler.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const JS_DIR = join(process.cwd(), 'assets', 'js');

/**
 * Collect all JS files from assets/js/.
 */
function getJsFiles() {
  const files = readdirSync(JS_DIR).filter((f) => f.endsWith('.js'));
  return files.map((f) => ({
    name: f,
    content: readFileSync(join(JS_DIR, f), 'utf-8')
  }));
}

/**
 * Split JS content into individual lines for line-level scanning.
 */
function getLines(content) {
  return content.split('\n');
}

/**
 * Patterns that indicate ES module syntax or TypeScript-specific syntax.
 */
const FORBIDDEN_PATTERNS = [
  // ES module import statements (but not dynamic import())
  { name: 'ES module import', regex: /^\s*import\s+/m },
  // ES module export statements
  { name: 'ES module export', regex: /^\s*export\s+/m },
  // TypeScript type annotations — colon followed by a type (e.g., `: string`, `: number`)
  // Match patterns like `param: string` or `): void` but not object literals or ternaries
  {
    name: 'TypeScript type annotation',
    regex: /\):\s*(string|number|boolean|void|any|never|unknown|object)\b/m
  },
  // TypeScript interface declarations
  { name: 'TypeScript interface', regex: /^\s*interface\s+[A-Z]/m },
  // TypeScript enum declarations
  { name: 'TypeScript enum', regex: /^\s*enum\s+[A-Z]/m },
  // TypeScript type alias declarations
  { name: 'TypeScript type alias', regex: /^\s*type\s+[A-Z]\w*\s*=/m },
  // TypeScript generic syntax on functions/classes (e.g., function foo<T>)
  { name: 'TypeScript generic', regex: /(?:function|class)\s+\w+\s*<[A-Z]/m },
  // TypeScript non-null assertion operator (!)
  // Match `identifier!.` or `identifier!;` patterns
  {
    name: 'TypeScript as assertion',
    regex: /\bas\s+(string|number|boolean|any|unknown|never|void)\b/m
  }
];

describe('Property 5: Standard script-mode JavaScript', () => {
  const jsFiles = getJsFiles();

  it('should find at least one JS file in assets/js/', () => {
    expect(jsFiles.length).toBeGreaterThan(0);
  });

  it('no JS file contains ES module or TypeScript syntax (property-based)', () => {
    // Use fast-check to sample random lines from random JS files
    // and verify none match forbidden patterns.
    const allFileLines = jsFiles.flatMap((file) =>
      getLines(file.content).map((line, idx) => ({
        file: file.name,
        lineNumber: idx + 1,
        line
      }))
    );

    // We need at least some lines to test
    expect(allFileLines.length).toBeGreaterThan(0);

    // Arbitrary that picks from the actual JS lines
    const jsLineArb = fc.constantFrom(...allFileLines);

    fc.assert(
      fc.property(jsLineArb, ({ _file, _lineNumber, line }) => {
        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.regex.test(line)) {
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

  // Exhaustive check: verify every file against all forbidden patterns
  it('exhaustive scan — no file contains ES module or TypeScript syntax', () => {
    for (const file of jsFiles) {
      for (const pattern of FORBIDDEN_PATTERNS) {
        const match = pattern.regex.test(file.content);
        expect(match, `${file.name} contains ${pattern.name} syntax`).toBe(false);
      }
    }
  });
});
