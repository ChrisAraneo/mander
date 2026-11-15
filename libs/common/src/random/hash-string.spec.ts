import { describe, expect, it } from 'vitest';

import { hashString } from './hash-string';

describe('hashString', () => {
  it('should give a fourteen character upper-case hash when it is given text', () => {
    const result = hashString('mander');

    expect(result).toBe('0BLN4TW1RE6GPX');
  });

  it('should give a hash when it is given empty text', () => {
    const result = hashString('');

    expect(result).toBe('02RFLUX176AJRD');
  });

  it('should give a different hash when the text differs only in case', () => {
    const result = hashString('Mander');

    expect(result).toBe('1MU7OZT0EC9Y0I');
  });
});
