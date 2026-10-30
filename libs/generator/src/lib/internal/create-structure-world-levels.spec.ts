import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { find, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_WORLD_REPEATS } from '../consts';
import { createPalette } from '../palette/create-palette';
import { STRUCTURE_CHOICES } from '../structure-choices';
import type { StructureChoice } from '../types/structure-choice';
import { createStructureWorldLevels } from './create-structure-world-levels';

const SPRING: Season = 'SPRING';

const PALETTE = createPalette(SPRING, createRandom('PALETTE'));

const NORMAL_CHOICE = STRUCTURE_CHOICES[0];

const VERTICAL_CHOICE: StructureChoice =
  find(STRUCTURE_CHOICES, (choice) => choice.category === 'VERTICAL') ??
  NORMAL_CHOICE;

const createWith = (choice: StructureChoice, seed: string) =>
  createStructureWorldLevels({
    choice,
    season: SPRING,
    palette: PALETTE,
    random: createRandom(seed),
  });

describe('createStructureWorldLevels', () => {
  it('should build one level when it is given a structure', () => {
    expect(size(createWith(NORMAL_CHOICE, 'SEED').levels)).toBe(1);
  });

  it('should repeat the structure three times when it builds the level', () => {
    expect(
      createWith(NORMAL_CHOICE, 'SEED').levels[0].meta?.structures,
    ).toEqual(times(STRUCTURE_WORLD_REPEATS, () => NORMAL_CHOICE.name));
  });

  it('should repeat the structure three times when the structure is vertical', () => {
    expect(
      createWith(VERTICAL_CHOICE, 'SEED').levels[0].meta?.structures,
    ).toEqual(times(STRUCTURE_WORLD_REPEATS, () => VERTICAL_CHOICE.name));
  });

  it('should name the world after the structure when it builds the level', () => {
    expect(createWith(NORMAL_CHOICE, 'SEED').name).toBe(NORMAL_CHOICE.name);
  });

  it('should keep the season it was given when it builds the level', () => {
    expect(createWith(NORMAL_CHOICE, 'SEED').season).toBe(SPRING);
  });

  it('should keep the palette it was given when it builds the level', () => {
    expect(createWith(NORMAL_CHOICE, 'SEED').palette).toBe(PALETTE);
  });

  it('should start the world with no score when it builds the level', () => {
    expect(createWith(NORMAL_CHOICE, 'SEED').score).toBe(0);
  });

  it('should build a level taller than it is wide when the structure is vertical', () => {
    const [level] = createWith(VERTICAL_CHOICE, 'SEED').levels;

    expect(level.height).toBeGreaterThan(level.width);
  });

  it('should build the same level when it is seeded with the same text', () => {
    expect(createWith(NORMAL_CHOICE, 'SEED')).toEqual(
      createWith(NORMAL_CHOICE, 'SEED'),
    );
  });

  it('should build another level when it is seeded with other text', () => {
    expect(createWith(NORMAL_CHOICE, 'SEED').levels[0].seed).not.toBe(
      createWith(NORMAL_CHOICE, 'OTHER').levels[0].seed,
    );
  });
});
