import { TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../../test/create-render-test-level';
import { drawRecorded } from '../../../test/draw-recorded';
import { STROKE_WIDTH } from '../../stroke/consts';
import { createTileEdgeStep } from './create-tile-edge-step';

const TOP_EDGE = {
  column: 0,
  row: -1,
  x: 0,
  y: 0,
  width: TILE_SIZE,
  height: STROKE_WIDTH,
};

describe('createTileEdgeStep', () => {
  it('should draw the top bar when the tile above is open', () => {
    const calls = drawRecorded(
      createTileEdgeStep(createRenderTestLevel(['...', '.#.']), 1, 1, TOP_EDGE),
    );

    expect(calls).toEqual(['fillRect(32, 32, 32, 2)']);
  });

  it('should draw nothing when the tile above is solid', () => {
    const calls = drawRecorded(
      createTileEdgeStep(createRenderTestLevel(['.#.', '.#.']), 1, 1, TOP_EDGE),
    );

    expect(calls).toEqual([]);
  });
});
