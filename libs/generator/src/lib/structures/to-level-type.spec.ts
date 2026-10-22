import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelVariant } from '../types/level-variant';
import { toLevelType } from './to-level-type';

const LEVEL_VARIANTS: LevelVariant[] = [
  'NORMAL',
  'MIRRORED',
  'VERTICAL',
  'HARD',
];

describe('toLevelType', () => {
  it('should say vertical when the level is a vertical one', () => {
    expect(toLevelType('VERTICAL')).toBe('VERTICAL');
  });

  it('should say horizontal when the level is a normal one', () => {
    expect(toLevelType('NORMAL')).toBe('HORIZONTAL');
  });

  it('should say horizontal when the level is any other variant it lays out', () => {
    expect(map(LEVEL_VARIANTS, toLevelType)).toEqual([
      'HORIZONTAL',
      'HORIZONTAL',
      'VERTICAL',
      'HORIZONTAL',
    ]);
  });
});
