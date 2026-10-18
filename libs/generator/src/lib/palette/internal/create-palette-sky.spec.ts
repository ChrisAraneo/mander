import { createRandom } from '@mander/engine';
import { describe, expect, it } from 'vitest';

import { createPaletteSky } from './create-palette-sky';
import { createRandomSky } from './create-random-sky';

describe('createPaletteSky', () => {
  it('should pick the sky from the generator when it starts a palette', () => {
    expect(createPaletteSky({ random: createRandom('DAY-1') }).sky).toEqual(
      createRandomSky(createRandom('DAY-1')),
    );
  });

  it('should pick the same sky when the generator starts from the same seed', () => {
    expect(createPaletteSky({ random: createRandom('DAY-1') }).sky).toEqual(
      createPaletteSky({ random: createRandom('DAY-1') }).sky,
    );
  });

  it('should pick another sky when the generator starts from another seed', () => {
    expect(createPaletteSky({ random: createRandom('DAY-1') }).sky).not.toEqual(
      createPaletteSky({ random: createRandom('DAY-2') }).sky,
    );
  });

  it('should pass the generator on when it picks the sky', () => {
    const random = createRandom('DAY-1');

    expect(createPaletteSky({ random }).random).toBe(random);
  });
});
