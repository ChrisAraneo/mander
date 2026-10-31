import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPaletteMaterials } from './create-palette-materials';
import { createRandomMaterials } from './create-random-materials';
import type { PaletteGround } from './types/palette-ground';
import type { PaletteSky } from './types/palette-sky';

const SPRING: Season = 'SPRING';

const SUMMER: Season = 'SUMMER';

const AUTUMN: Season = 'AUTUMN';

const WINTER: Season = 'WINTER';

const SKY: PaletteSky = {
  hue: 200,
  glowHue: 30,
  saturation: 30,
  glowSaturation: 50,
  topLightness: 30,
};

const GROUND: PaletteGround = {
  hue: 40,
  saturation: 25,
  lightness: 32,
  capHue: 100,
  capSaturation: 40,
  capLightness: 50,
};

const createMaterialsIn = (season: Season, seed: string) =>
  createPaletteMaterials({
    season,
    sky: SKY,
    ground: GROUND,
    random: createRandom(seed),
  });

describe('createPaletteMaterials', () => {
  it('should pick the materials from the generator when it adds the materials', () => {
    expect(createMaterialsIn(SPRING, 'DAY-1').materials).toEqual(
      createRandomMaterials(SPRING, createRandom('DAY-1')),
    );
  });

  it('should pick other materials when the season turns', () => {
    expect(createMaterialsIn(SPRING, 'DAY-1').materials).not.toEqual(
      createMaterialsIn(AUTUMN, 'DAY-1').materials,
    );
    expect(createMaterialsIn(AUTUMN, 'DAY-1').materials).not.toEqual(
      createMaterialsIn(WINTER, 'DAY-1').materials,
    );
    expect(createMaterialsIn(SUMMER, 'DAY-1').materials).not.toEqual(
      createMaterialsIn(SPRING, 'DAY-1').materials,
    );
  });

  it('should pick other materials when the generator starts from another seed', () => {
    expect(createMaterialsIn(SPRING, 'DAY-1').materials).not.toEqual(
      createMaterialsIn(SPRING, 'DAY-2').materials,
    );
  });

  it('should pass the sky and the ground on when it picks the materials', () => {
    expect(createMaterialsIn(SPRING, 'DAY-1').sky).toBe(SKY);
    expect(createMaterialsIn(SPRING, 'DAY-1').ground).toBe(GROUND);
  });
});
