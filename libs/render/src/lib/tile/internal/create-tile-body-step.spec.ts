import { TILE_STONE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { getMaterialStyle } from '../../material/get-material-style';
import { createTileBodyStep } from './create-tile-body-step';

const STONE_BODY = [
  'set fillStyle(#6D7480)',
  'fillRect(0, 0, 32, 32)',
  'set fillStyle(RGBA(0, 0, 0, 0.26))',
  'fillRect(6, 7, 7, 5)',
  'fillRect(19, 16, 8, 6)',
  'set fillStyle(RGBA(255, 255, 255, 0.16))',
  'fillRect(8, 20, 6, 4)',
  'fillRect(20, 6, 5, 4)',
];

describe('createTileBodyStep', () => {
  it('should draw the block with its cap when the cap is wanted', () => {
    const calls = drawRecorded(
      createTileBodyStep(TILE_STONE, 0, 0, getMaterialStyle(TILE_STONE), true),
    );

    expect(calls).toEqual([
      ...STONE_BODY,
      'set fillStyle(#838B98)',
      'fillRect(0, 0, 32, 7)',
      'set fillStyle(#9AA2AE)',
      'fillRect(0, 0, 32, 3)',
    ]);
  });

  it('should draw the block without a cap when the cap is not wanted', () => {
    const calls = drawRecorded(
      createTileBodyStep(TILE_STONE, 0, 0, getMaterialStyle(TILE_STONE), false),
    );

    expect(calls).toEqual(STONE_BODY);
  });
});
