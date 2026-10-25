import { createRandom } from '@mander/engine';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_CHOICES } from '../structure-choices';
import { createStructureWorldPalette } from './create-structure-world-palette';

const CHOICE = STRUCTURE_CHOICES[0];

describe('createStructureWorldPalette', () => {
  it('should pass the chosen structure on when it makes the palette', () => {
    const result = createStructureWorldPalette({
      choice: CHOICE,
      random: createRandom('SEED'),
    });

    expect(result.choice).toBe(CHOICE);
  });

  it('should pass the generator on when it makes the palette', () => {
    const random = createRandom('SEED');

    expect(createStructureWorldPalette({ choice: CHOICE, random }).random).toBe(
      random,
    );
  });

  it('should make the same palette when it is seeded with the same text', () => {
    expect(
      createStructureWorldPalette({
        choice: CHOICE,
        random: createRandom('SEED'),
      }).palette,
    ).toEqual(
      createStructureWorldPalette({
        choice: CHOICE,
        random: createRandom('SEED'),
      }).palette,
    );
  });

  it('should make another palette when it is seeded with other text', () => {
    expect(
      createStructureWorldPalette({
        choice: CHOICE,
        random: createRandom('SEED'),
      }).palette,
    ).not.toEqual(
      createStructureWorldPalette({
        choice: CHOICE,
        random: createRandom('OTHER'),
      }).palette,
    );
  });
});
