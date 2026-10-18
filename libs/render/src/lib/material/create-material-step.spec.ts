import {
  TILE_BRICK,
  TILE_CANNON,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import {
  BRICK_STYLE,
  CERAMIC_STYLE,
  DIRT_STYLE,
  FIREBALL_STYLE,
  STONE_STYLE,
  WOOD_STYLE,
} from './consts';
import { createMaterialStep } from './create-material-step';

const HSL_WOOD_STYLE = { ...WOOD_STYLE, base: 'HSL(26, 21%, 43%)' };

describe('createMaterialStep', () => {
  it('should draw the mortar courses when the tile is brick', () => {
    const calls = drawRecorded(
      createMaterialStep(TILE_BRICK, 64, 32, BRICK_STYLE),
    );

    expect(calls).toEqual([
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(64, 40, 32, 1)',
      'fillRect(64, 48, 32, 1)',
      'fillRect(64, 56, 32, 1)',
      'fillRect(80, 32, 1, 8)',
      'fillRect(72, 40, 1, 8)',
      'fillRect(80, 48, 1, 8)',
      'fillRect(72, 56, 1, 8)',
    ]);
  });

  it('should draw the stone flecks when the tile is stone', () => {
    const calls = drawRecorded(
      createMaterialStep(TILE_STONE, 64, 32, STONE_STYLE),
    );

    expect(calls).toEqual([
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(70, 39, 7, 5)',
      'fillRect(83, 48, 8, 6)',
      'set fillStyle(RGBA(255, 255, 255, 0.16))',
      'fillRect(72, 52, 6, 4)',
      'fillRect(84, 38, 5, 4)',
    ]);
  });

  it('should draw two planks in one tone when the tile is wood with a fixed colour', () => {
    const calls = drawRecorded(createMaterialStep(TILE_WOOD, 0, 0, WOOD_STYLE));

    expect(calls).toEqual([
      'set fillStyle(#96694F)',
      'fillRect(0, 0, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(0, 1, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(0, 13, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(0, 3, 26, 1)',
      'fillRect(6, 11, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(2, 5, 18, 1)',
      'set fillStyle(RGBA(52, 38, 30, 0.85))',
      'fillRect(0, 15, 32, 1)',
      'fillRect(3, 0, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(4, 0, 1, 15)',
      'set fillStyle(#96694F)',
      'fillRect(0, 16, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(0, 17, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(0, 29, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(3, 19, 26, 1)',
      'fillRect(12, 27, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(2, 21, 18, 1)',
      'set fillStyle(RGBA(52, 38, 30, 0.85))',
      'fillRect(0, 31, 32, 1)',
      'fillRect(6, 16, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(7, 16, 1, 15)',
    ]);
  });

  it('should draw two planks in shifted tones when the tile is wood with a rolled colour', () => {
    const calls = drawRecorded(
      createMaterialStep(TILE_WOOD, 96, 64, HSL_WOOD_STYLE),
    );

    expect(calls).toEqual([
      'set fillStyle(HSL(26, 21%, 43%))',
      'fillRect(96, 64, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(96, 65, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(96, 77, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(96, 69, 26, 1)',
      'fillRect(108, 75, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(100, 69, 18, 1)',
      'set fillStyle(RGBA(52, 38, 30, 0.85))',
      'fillRect(96, 79, 32, 1)',
      'fillRect(110, 64, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(111, 64, 1, 15)',
      'set fillStyle(HSL(26, 21%, 41%))',
      'fillRect(96, 80, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(96, 81, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(96, 93, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(97, 84, 26, 1)',
      'fillRect(106, 91, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(99, 85, 18, 1)',
      'set fillStyle(RGBA(52, 38, 30, 0.85))',
      'fillRect(96, 95, 32, 1)',
      'fillRect(100, 80, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(101, 80, 1, 15)',
    ]);
  });

  it('should draw the four ceramic panes when the tile is ceramic', () => {
    const calls = drawRecorded(
      createMaterialStep(TILE_CERAMIC, 32, 0, CERAMIC_STYLE),
    );

    expect(calls).toEqual([
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(48, 0, 1, 32)',
      'fillRect(32, 16, 32, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.16))',
      'fillRect(35, 3, 9, 1)',
      'fillRect(51, 19, 9, 1)',
    ]);
  });

  it('should draw the glowing veins when the tile is a fireball block', () => {
    const calls = drawRecorded(
      createMaterialStep(TILE_FIREBALL, 0, 32, FIREBALL_STYLE),
    );

    expect(calls).toEqual([
      'save()',
      'set fillStyle(RGBA(0, 0, 0, 0.45))',
      'fillRect(4, 38, 8, 2)',
      'fillRect(18, 37, 10, 2)',
      'fillRect(3, 48, 6, 2)',
      'fillRect(20, 52, 9, 2)',
      'fillRect(10, 39, 2, 7)',
      'fillRect(21, 42, 2, 9)',
      'set fillStyle(#FF7A2F)',
      'fillRect(4, 37, 8, 2)',
      'fillRect(18, 36, 10, 2)',
      'fillRect(3, 47, 6, 2)',
      'fillRect(20, 51, 9, 2)',
      'fillRect(10, 38, 2, 7)',
      'fillRect(21, 41, 2, 9)',
      'set fillStyle(#FFD166)',
      'beginPath()',
      'arc(16, 48, 4, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw nothing when the tile is dirt', () => {
    const calls = drawRecorded(createMaterialStep(TILE_DIRT, 0, 0, DIRT_STYLE));

    expect(calls).toEqual([]);
  });

  it('should draw nothing when the tile has no material of its own', () => {
    const calls = drawRecorded(
      createMaterialStep(TILE_CANNON, 0, 0, DIRT_STYLE),
    );

    expect(calls).toEqual([]);
  });
});
