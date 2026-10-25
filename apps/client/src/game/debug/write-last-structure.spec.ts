import { describe, expect, it } from 'vitest';

import { LAST_STRUCTURE_KEY } from './consts';
import { writeLastStructure } from './write-last-structure';

const createStorage = (store: Map<string, string>): Storage =>
  ({
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

describe('writeLastStructure', () => {
  it('should store the structure when it is played', () => {
    const store = new Map<string, string>();

    writeLastStructure('VERTICAL_005', createStorage(store));

    expect(store.get(LAST_STRUCTURE_KEY)).toBe('VERTICAL_005');
  });

  it('should replace the old structure when another one is played', () => {
    const store = new Map([[LAST_STRUCTURE_KEY, 'NORMAL_001']]);

    writeLastStructure('HARD_010', createStorage(store));

    expect(store.get(LAST_STRUCTURE_KEY)).toBe('HARD_010');
  });

  it('should leave other entries alone when it stores the structure', () => {
    const store = new Map([['MANDER:SAVE:V2', '{}']]);

    writeLastStructure('HARD_010', createStorage(store));

    expect(store.get('MANDER:SAVE:V2')).toBe('{}');
  });

  it('should carry on quietly when the storage fails to answer', () => {
    expect(() =>
      writeLastStructure('HARD_010', {} as unknown as Storage),
    ).not.toThrow();
  });

  it('should carry on quietly when there is no storage at all', () => {
    expect(() => writeLastStructure('HARD_010', undefined)).not.toThrow();
  });
});
