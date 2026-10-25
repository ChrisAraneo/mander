import { describe, expect, it } from 'vitest';

import { LAST_STRUCTURE_KEY } from './consts';
import { readLastStructure } from './read-last-structure';

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
  }) as unknown as Storage;

describe('readLastStructure', () => {
  it('should give the last played structure when one was stored', () => {
    const storage = createStorage(new Map([[LAST_STRUCTURE_KEY, 'HARD_010']]));

    expect(readLastStructure(storage)).toBe('HARD_010');
  });

  it('should give nothing when no structure was stored', () => {
    expect(readLastStructure(createStorage(new Map()))).toBeNull();
  });

  it('should give nothing when there is no storage at all', () => {
    expect(readLastStructure(undefined)).toBeNull();
  });

  it('should give nothing when the storage fails to answer', () => {
    expect(readLastStructure({} as unknown as Storage)).toBeNull();
  });
});
