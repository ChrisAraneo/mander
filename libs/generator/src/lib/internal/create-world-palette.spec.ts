import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPalette } from '../palette/create-palette';
import { createWorldPalette } from './create-world-palette';

const SPRING: Season = 'SPRING';

const createWith = (seed: string) =>
  createWorldPalette({
    name: 'WORLD',
    season: SPRING,
    random: createRandom(seed),
  });

describe('createWorldPalette', () => {
  it('should paint the world from the generator when it starts a world', () => {
    expect(createWith('DAY-1').palette).toEqual(
      createPalette(SPRING, createRandom('DAY-1')),
    );
  });

  it('should paint the world the same way when the generator starts from the same seed', () => {
    expect(createWith('DAY-1').palette).toEqual(createWith('DAY-1').palette);
  });

  it('should paint the world another way when the generator starts from another seed', () => {
    expect(createWith('DAY-1').palette).not.toEqual(
      createWith('DAY-2').palette,
    );
  });

  it('should pass the name on when it paints the world', () => {
    expect(createWith('DAY-1').name).toBe('WORLD');
  });

  it('should pass the season on when it paints the world', () => {
    expect(createWith('DAY-1').season).toBe(SPRING);
  });

  it('should pass the generator on when it paints the world', () => {
    const random = createRandom('DAY-1');

    expect(
      createWorldPalette({ name: 'WORLD', season: SPRING, random }).random,
    ).toBe(random);
  });
});
