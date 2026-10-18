import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../../test/create-render-test-level';
import { drawRecorded } from '../../../test/draw-recorded';
import { createTileCornerStep } from './create-tile-corner-step';

const TOP_LEFT = { column: -1, row: -1, x: 0, y: 0 };

describe('createTileCornerStep', () => {
  it('should fill the notch when both sides are solid and the diagonal is open', () => {
    const calls = drawRecorded(
      createTileCornerStep(createRenderTestLevel(['.#', '##']), 1, 1, TOP_LEFT),
    );

    expect(calls).toEqual(['fillRect(32, 32, 2, 2)']);
  });

  it('should draw nothing when the diagonal is solid too', () => {
    const calls = drawRecorded(
      createTileCornerStep(createRenderTestLevel(['##', '##']), 1, 1, TOP_LEFT),
    );

    expect(calls).toEqual([]);
  });

  it('should draw nothing when a side faces open air', () => {
    const calls = drawRecorded(
      createTileCornerStep(createRenderTestLevel(['..', '.#']), 1, 1, TOP_LEFT),
    );

    expect(calls).toEqual([]);
  });
});
