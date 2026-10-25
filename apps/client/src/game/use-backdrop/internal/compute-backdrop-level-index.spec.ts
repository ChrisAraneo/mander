import type { Level } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BACKDROP_LEVEL } from '../consts';
import { computeBackdropLevelIndex } from './compute-backdrop-level-index';

const createLevels = (count: number): Level[] =>
  times(count, (index) => ({ seed: `L${index}` }) as unknown as Level);

describe('computeBackdropLevelIndex', () => {
  it('should show the backdrop level when the world is long enough', () => {
    expect(computeBackdropLevelIndex(createLevels(10))).toBe(
      BACKDROP_LEVEL - 1,
    );
  });

  it('should show the last level when the world is shorter than that', () => {
    expect(computeBackdropLevelIndex(createLevels(2))).toBe(1);
  });

  it('should show the first level when the world has no levels', () => {
    expect(computeBackdropLevelIndex([])).toBe(0);
  });
});
