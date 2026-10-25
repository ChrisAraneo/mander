import { describe, expect, it } from 'vitest';

import { useLibrary } from './use-library';

describe('useLibrary', () => {
  it('should start empty, silent and not ready when it is created', () => {
    const library = useLibrary();

    expect(library.entries.value).toEqual([]);
    expect(library.status.value).toBe('');
    expect(library.isReady.value).toBe(false);
  });
});
