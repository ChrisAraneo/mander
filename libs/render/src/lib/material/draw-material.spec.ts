import { TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { BRICK_STYLE } from './consts';
import { drawMaterial } from './draw-material';

describe('drawMaterial', () => {
  it('should draw the material on the canvas when it is given a brick tile', () => {
    const calls = drawRecorded((context) =>
      drawMaterial(context, TILE_BRICK, 32, 32, BRICK_STYLE),
    );

    expect(calls).toEqual([
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(32, 40, 32, 1)',
      'fillRect(32, 48, 32, 1)',
      'fillRect(32, 56, 32, 1)',
      'fillRect(48, 32, 1, 8)',
      'fillRect(40, 40, 1, 8)',
      'fillRect(48, 48, 1, 8)',
      'fillRect(40, 56, 1, 8)',
    ]);
  });
});
