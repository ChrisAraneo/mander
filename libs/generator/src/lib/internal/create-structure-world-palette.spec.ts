import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_CHOICES } from '../structure-choices';
import { createStructureWorldPalette } from './create-structure-world-palette';

const CHOICE = STRUCTURE_CHOICES[0];

const SPRING: Season = 'SPRING';

const createWith = (seed: string) =>
  createStructureWorldPalette({
    choice: CHOICE,
    season: SPRING,
    random: createRandom(seed),
  });

describe('createStructureWorldPalette', () => {
  it('should pass the chosen structure on when it makes the palette', () => {
    expect(createWith('SEED').choice).toBe(CHOICE);
  });

  it('should pass the season on when it makes the palette', () => {
    expect(createWith('SEED').season).toBe(SPRING);
  });

  it('should pass the generator on when it makes the palette', () => {
    const random = createRandom('SEED');

    expect(
      createStructureWorldPalette({ choice: CHOICE, season: SPRING, random })
        .random,
    ).toBe(random);
  });

  it('should make the same palette when it is seeded with the same text', () => {
    expect(createWith('SEED').palette).toEqual(createWith('SEED').palette);
  });

  it('should make another palette when it is seeded with other text', () => {
    expect(createWith('SEED').palette).not.toEqual(createWith('OTHER').palette);
  });
});
