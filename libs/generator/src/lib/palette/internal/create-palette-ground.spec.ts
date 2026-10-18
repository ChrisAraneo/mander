import { createRandom } from '@mander/engine';
import { describe, expect, it } from 'vitest';

import { createPaletteGround } from './create-palette-ground';
import { createRandomGround } from './create-random-ground';
import type { PaletteSky } from './types/palette-sky';

const SKY: PaletteSky = {
  hue: 200,
  glowHue: 30,
  saturation: 30,
  glowSaturation: 50,
  topLightness: 30,
};

describe('createPaletteGround', () => {
  it('should pick the ground from the generator when it adds the ground', () => {
    expect(
      createPaletteGround({ sky: SKY, random: createRandom('DAY-1') }).ground,
    ).toEqual(createRandomGround(createRandom('DAY-1')));
  });

  it('should pick the same ground when the generator starts from the same seed', () => {
    expect(
      createPaletteGround({ sky: SKY, random: createRandom('DAY-1') }).ground,
    ).toEqual(
      createPaletteGround({ sky: SKY, random: createRandom('DAY-1') }).ground,
    );
  });

  it('should pick another ground when the generator starts from another seed', () => {
    expect(
      createPaletteGround({ sky: SKY, random: createRandom('DAY-1') }).ground,
    ).not.toEqual(
      createPaletteGround({ sky: SKY, random: createRandom('DAY-2') }).ground,
    );
  });

  it('should pass the sky on when it picks the ground', () => {
    expect(
      createPaletteGround({ sky: SKY, random: createRandom('DAY-1') }).sky,
    ).toBe(SKY);
  });
});
