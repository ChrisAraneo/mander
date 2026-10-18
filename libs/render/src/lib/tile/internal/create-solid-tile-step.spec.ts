import { TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../../test/create-render-test-level';
import { drawRecorded } from '../../../test/draw-recorded';
import { getMaterialStyle } from '../../material/get-material-style';
import { createSolidTileStep } from './create-solid-tile-step';

describe('createSolidTileStep', () => {
  it('should draw the block with its cap and its outline when nothing stands on it', () => {
    const calls = drawRecorded(
      createSolidTileStep(
        createRenderTestLevel(['...', '.B.', '...']),
        1,
        1,
        getMaterialStyle(TILE_BRICK),
      ),
    );

    expect(calls).toEqual([
      'set fillStyle(#9C4F3F)',
      'fillRect(32, 32, 32, 32)',
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(32, 40, 32, 1)',
      'fillRect(32, 48, 32, 1)',
      'fillRect(32, 56, 32, 1)',
      'fillRect(48, 32, 1, 8)',
      'fillRect(40, 40, 1, 8)',
      'fillRect(48, 48, 1, 8)',
      'fillRect(40, 56, 1, 8)',
      'set fillStyle(#B25C49)',
      'fillRect(32, 32, 32, 7)',
      'set fillStyle(#C86E59)',
      'fillRect(32, 32, 32, 3)',
      'set fillStyle(#0f0d16)',
      'fillRect(32, 32, 32, 2)',
      'fillRect(32, 62, 32, 2)',
      'fillRect(32, 32, 2, 32)',
      'fillRect(62, 32, 2, 32)',
    ]);
  });

  it('should leave the cap off when another block stands on it', () => {
    const calls = drawRecorded(
      createSolidTileStep(
        createRenderTestLevel(['.B.', '.B.', '...']),
        1,
        1,
        getMaterialStyle(TILE_BRICK),
      ),
    );

    expect(calls).toEqual([
      'set fillStyle(#9C4F3F)',
      'fillRect(32, 32, 32, 32)',
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(32, 40, 32, 1)',
      'fillRect(32, 48, 32, 1)',
      'fillRect(32, 56, 32, 1)',
      'fillRect(48, 32, 1, 8)',
      'fillRect(40, 40, 1, 8)',
      'fillRect(48, 48, 1, 8)',
      'fillRect(40, 56, 1, 8)',
      'set fillStyle(#0f0d16)',
      'fillRect(32, 62, 32, 2)',
      'fillRect(32, 32, 2, 32)',
      'fillRect(62, 32, 2, 32)',
    ]);
  });
});
