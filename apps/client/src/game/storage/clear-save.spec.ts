import { describe, expect, it } from 'vitest';

import { clearSave } from './clear-save';
import { STORAGE_KEY } from './consts';

const createStorage = (store: Map<string, string>): Storage =>
  ({
    removeItem: (key: string): boolean => store.delete(key),
  }) as unknown as Storage;

describe('clearSave', () => {
  it('should forget the save when it clears it', () => {
    const store = new Map([[STORAGE_KEY, '{}']]);

    clearSave(createStorage(store));

    expect(store.has(STORAGE_KEY)).toBe(false);
  });

  it('should leave other entries alone when it clears the save', () => {
    const store = new Map([
      [STORAGE_KEY, '{}'],
      ['OTHER', 'kept'],
    ]);

    clearSave(createStorage(store));

    expect(store.get('OTHER')).toBe('kept');
  });

  it('should carry on quietly when the storage fails to answer', () => {
    expect(() => clearSave({} as unknown as Storage)).not.toThrow();
  });

  it('should carry on quietly when there is no storage at all', () => {
    expect(() => clearSave(undefined)).not.toThrow();
  });
});
