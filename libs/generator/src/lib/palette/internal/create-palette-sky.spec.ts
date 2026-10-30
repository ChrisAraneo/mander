import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPaletteSky } from './create-palette-sky';
import { createRandomSky } from './create-random-sky';

const SPRING: Season = 'SPRING';

describe('createPaletteSky', () => {
  it('should pick the sky from the generator when it starts a palette', () => {
    expect(
      createPaletteSky({ season: SPRING, random: createRandom('DAY-1') }).sky,
    ).toEqual(createRandomSky(createRandom('DAY-1')));
  });

  it('should pick the same sky when the generator starts from the same seed', () => {
    expect(
      createPaletteSky({ season: SPRING, random: createRandom('DAY-1') }).sky,
    ).toEqual(
      createPaletteSky({ season: SPRING, random: createRandom('DAY-1') }).sky,
    );
  });

  it('should pick another sky when the generator starts from another seed', () => {
    expect(
      createPaletteSky({ season: SPRING, random: createRandom('DAY-1') }).sky,
    ).not.toEqual(
      createPaletteSky({ season: SPRING, random: createRandom('DAY-2') }).sky,
    );
  });

  it('should pass the season on when it picks the sky', () => {
    expect(
      createPaletteSky({ season: SPRING, random: createRandom('DAY-1') })
        .season,
    ).toBe(SPRING);
  });

  it('should pass the generator on when it picks the sky', () => {
    const random = createRandom('DAY-1');

    expect(createPaletteSky({ season: SPRING, random }).random).toBe(random);
  });
});
