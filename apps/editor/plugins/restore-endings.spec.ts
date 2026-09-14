import { describe, expect, it } from 'vitest';

import { restoreEndings } from './restore-endings.ts';

describe('restoreEndings', () => {
  it('should follow a file that ends its lines the windows way', () => {
    expect(restoreEndings('a\nb\n', 'x\r\ny\r\n')).toBe('a\r\nb\r\n');
  });

  it('should follow a file that ends its lines the unix way', () => {
    expect(restoreEndings('a\r\nb\r\n', 'x\ny\n')).toBe('a\nb\n');
  });

  it('should leave a file already in step alone', () => {
    expect(restoreEndings('a\r\nb\r\n', 'x\r\n')).toBe('a\r\nb\r\n');
    expect(restoreEndings('a\nb\n', 'x\n')).toBe('a\nb\n');
  });
});
