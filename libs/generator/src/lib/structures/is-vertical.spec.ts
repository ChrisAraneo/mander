import { filter } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelVariant } from '../types/level-variant';
import { isMirrored } from './is-mirrored';
import { isVertical } from './is-vertical';

const LEVEL_VARIANTS: LevelVariant[] = [
  'NORMAL',
  'MIRRORED',
  'VERTICAL',
  'HARD',
];

describe('isVertical', () => {
  it('should send the player up when the level is a vertical one', () => {
    expect(isVertical('VERTICAL')).toBe(true);
  });

  it('should leave the level running sideways when it is any other variant', () => {
    expect(filter(LEVEL_VARIANTS, isVertical)).toEqual(['VERTICAL']);
  });

  it('should never stand the level up when it is a normal one', () => {
    expect(isVertical('NORMAL')).toBe(false);
  });

  it('should never turn the level around as well when it stands it up', () => {
    expect(
      filter(
        LEVEL_VARIANTS,
        (levelVariant) => isVertical(levelVariant) && isMirrored(levelVariant),
      ),
    ).toEqual([]);
  });
});
