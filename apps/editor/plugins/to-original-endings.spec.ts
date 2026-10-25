import { describe, expect, it } from 'vitest';

import { toOriginalEndings } from './to-original-endings.ts';

describe('toOriginalEndings', () => {
  it('should end its lines the windows way when the file does', () => {
    expect(toOriginalEndings('a\nb\n', 'x\r\ny\r\n')).toBe('a\r\nb\r\n');
  });

  it('should end its lines the unix way when the file does', () => {
    expect(toOriginalEndings('a\r\nb\r\n', 'x\ny\n')).toBe('a\nb\n');
  });

  it('should leave the text alone when it already ends its lines the way the file does', () => {
    expect(toOriginalEndings('a\r\nb\r\n', 'x\r\n')).toBe('a\r\nb\r\n');
    expect(toOriginalEndings('a\nb\n', 'x\n')).toBe('a\nb\n');
  });
});
