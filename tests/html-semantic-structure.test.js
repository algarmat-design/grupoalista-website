/**
 * Validates: Requirements 5.1, 5.2
 *
 * Verifies HTML semantic structure and accessibility attributes are preserved
 * after CSS/JS extraction from index.html.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const htmlPath = join(process.cwd(), 'index.html');
const html = readFileSync(htmlPath, 'utf-8');

describe('HTML semantic structure preservation', () => {
  it('contains nav element', () => {
    expect(html).toMatch(/<nav[\s>]/);
  });

  it('contains multiple section elements', () => {
    const sections = html.match(/<section[\s>]/g);
    expect(sections).not.toBeNull();
    expect(sections.length).toBeGreaterThanOrEqual(5);
  });

  it('contains footer element', () => {
    expect(html).toMatch(/<footer[\s>]/);
  });

  it('contains form element', () => {
    expect(html).toMatch(/<form[\s>]/);
  });

  it('contains label elements for all form fields', () => {
    const labels = html.match(/<label[\s>]/g);
    expect(labels).not.toBeNull();
    expect(labels.length).toBeGreaterThanOrEqual(4);
  });

  it('contains button elements', () => {
    const buttons = html.match(/<button[\s>]/g);
    expect(buttons).not.toBeNull();
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});

describe('ARIA attributes preservation', () => {
  it('mobile toggle has aria-label="Menu"', () => {
    expect(html).toMatch(/id="mobileToggle"[^>]*aria-label="Menu"/);
  });

  it('Facebook link has aria-label="Facebook"', () => {
    expect(html).toMatch(/aria-label="Facebook"/);
  });

  it('Instagram link has aria-label="Instagram"', () => {
    expect(html).toMatch(/aria-label="Instagram"/);
  });
});
