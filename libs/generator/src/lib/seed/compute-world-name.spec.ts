import { hashString } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { computeWorldName } from './compute-world-name';

const DATE = new Date(Date.UTC(2026, 0, 5));

describe('computeWorldName', () => {
  it('should hash the day when it names the world', () => {
    expect(computeWorldName(DATE)).toBe(hashString('2026-01-05'));
  });

  it('should give the same name when it is given the same day', () => {
    expect(computeWorldName(DATE)).toBe(
      computeWorldName(new Date(Date.UTC(2026, 0, 5, 18))),
    );
  });

  it('should give another name when the day is different', () => {
    expect(computeWorldName(DATE)).not.toBe(
      computeWorldName(new Date(Date.UTC(2026, 0, 6))),
    );
  });
});
