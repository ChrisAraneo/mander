import { TILE_STONE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { getMaterialStyle } from '../../material/get-material-style';
import { createShadedTileStep } from './create-shaded-tile-step';
import { createTileBodyStep } from './create-tile-body-step';

const STONE_STYLE = getMaterialStyle(TILE_STONE);

describe('createShadedTileStep', () => {
  it('should draw the block inside a saved state and shade the whole tile over it when the cap is wanted', () => {
    const calls = drawRecorded(
      createShadedTileStep(TILE_STONE, 32, 64, STONE_STYLE, true),
    );

    expect(calls).toEqual([
      'save()',
      ...drawRecorded(
        createTileBodyStep(TILE_STONE, 32, 64, STONE_STYLE, true),
      ),
      'restore()',
      'set fillStyle(RGBA(15, 13, 22, 0.46))',
      'fillRect(32, 64, 32, 32)',
    ]);
  });

  it('should draw the block without its cap under the shade when the cap is not wanted', () => {
    const calls = drawRecorded(
      createShadedTileStep(TILE_STONE, 0, 0, STONE_STYLE, false),
    );

    expect(calls).toEqual([
      'save()',
      ...drawRecorded(createTileBodyStep(TILE_STONE, 0, 0, STONE_STYLE, false)),
      'restore()',
      'set fillStyle(RGBA(15, 13, 22, 0.46))',
      'fillRect(0, 0, 32, 32)',
    ]);
  });
});
