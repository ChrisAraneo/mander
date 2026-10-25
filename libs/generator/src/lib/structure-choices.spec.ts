import {
  HARD_LIBRARY,
  NORMAL_LIBRARY,
  VERTICAL_LIBRARY,
} from '@mander/structures';
import { countBy, keys, map, size, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_CHOICES } from './structure-choices';

describe('STRUCTURE_CHOICES', () => {
  it('should offer every structure of each pool when it lists the choices', () => {
    expect(countBy(STRUCTURE_CHOICES, (choice) => choice.category)).toEqual({
      NORMAL: size(keys(NORMAL_LIBRARY)),
      HARD: size(keys(HARD_LIBRARY)),
      VERTICAL: size(keys(VERTICAL_LIBRARY)),
    });
  });

  it('should give every choice its own name when it lists the choices', () => {
    const names = map(STRUCTURE_CHOICES, (choice) => choice.name);

    expect(size(uniq(names))).toBe(size(names));
  });

  it('should hold the structure itself when a choice is named after it', () => {
    expect(STRUCTURE_CHOICES[0]).toEqual({
      name: 'NORMAL_001',
      category: 'NORMAL',
      structure: NORMAL_LIBRARY.NORMAL_001,
    });
    expect(STRUCTURE_CHOICES[0].structure).toBe(NORMAL_LIBRARY.NORMAL_001);
  });
});
