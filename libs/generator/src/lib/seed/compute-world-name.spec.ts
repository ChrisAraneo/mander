import { hashString } from '@mander/utils';
import { includes } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeLevelSeeds } from './compute-level-seeds';
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

  it('should name the world apart from its levels when it is given a day', () => {
    expect(includes(computeLevelSeeds(DATE), computeWorldName(DATE))).toBe(
      false,
    );
  });
});
