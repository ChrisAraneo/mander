import { filter } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelVariant } from '../types/level-variant';
import { isMirrored } from './is-mirrored';

const LEVEL_VARIANTS: LevelVariant[] = [
  'NORMAL',
  'MIRRORED',
  'VERTICAL',
  'HARD',
];

describe('isMirrored', () => {
  it('should turn the level around when it is a mirrored one', () => {
    expect(isMirrored('MIRRORED')).toBe(true);
  });

  it('should leave the level running the way it was built when it is any other variant', () => {
    expect(filter(LEVEL_VARIANTS, isMirrored)).toEqual(['MIRRORED']);
  });

  it('should never turn the level around when it is a normal one', () => {
    expect(isMirrored('NORMAL')).toBe(false);
  });
});
