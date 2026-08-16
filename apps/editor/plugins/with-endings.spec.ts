import { describe, expect, it } from 'vitest';

import { withEndings } from './with-endings.ts';

describe('withEndings', () => {
  it('should follow a file that ends its lines the windows way', () => {
    expect(withEndings('a\nb\n', 'x\r\ny\r\n')).toBe('a\r\nb\r\n');
  });

  it('should follow a file that ends its lines the unix way', () => {
    expect(withEndings('a\r\nb\r\n', 'x\ny\n')).toBe('a\nb\n');
  });

  it('should leave a file already in step alone', () => {
    expect(withEndings('a\r\nb\r\n', 'x\r\n')).toBe('a\r\nb\r\n');
    expect(withEndings('a\nb\n', 'x\n')).toBe('a\nb\n');
  });
});
