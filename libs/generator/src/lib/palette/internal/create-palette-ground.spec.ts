import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPaletteGround } from './create-palette-ground';
import { createRandomGround } from './create-random-ground';
import type { PaletteSky } from './types/palette-sky';

const SPRING: Season = 'SPRING';

const SKY: PaletteSky = {
  hue: 200,
  glowHue: 30,
  saturation: 30,
  glowSaturation: 50,
  topLightness: 30,
};

const createGroundIn = (seed: string) =>
  createPaletteGround({
    season: SPRING,
    sky: SKY,
    random: createRandom(seed),
  });

describe('createPaletteGround', () => {
  it('should pick the ground from the generator when it adds the ground', () => {
    expect(createGroundIn('DAY-1').ground).toEqual(
      createRandomGround(SPRING, createRandom('DAY-1')),
    );
  });

  it('should pick the same ground when the generator starts from the same seed', () => {
    expect(createGroundIn('DAY-1').ground).toEqual(
      createGroundIn('DAY-1').ground,
    );
  });

  it('should pick another ground when the generator starts from another seed', () => {
    expect(createGroundIn('DAY-1').ground).not.toEqual(
      createGroundIn('DAY-2').ground,
    );
  });

  it('should pass the sky on when it picks the ground', () => {
    expect(createGroundIn('DAY-1').sky).toBe(SKY);
  });
});
