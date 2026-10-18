import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../test/create-render-test-level';
import { drawRecorded } from '../../test/draw-recorded';
import { createTileEdgesStep } from './create-tile-edges-step';

describe('createTileEdgesStep', () => {
  it('should outline all four sides when the block stands alone', () => {
    const level = createRenderTestLevel(['...', '.#.', '...']);

    const calls = drawRecorded(createTileEdgesStep(level, 1, 1));

    expect(calls).toEqual([
      'set fillStyle(#0f0d16)',
      'fillRect(32, 32, 32, 2)',
      'fillRect(32, 62, 32, 2)',
      'fillRect(32, 32, 2, 32)',
      'fillRect(62, 32, 2, 32)',
    ]);
  });

  it('should fill the notch when an inside corner leaves one', () => {
    const level = createRenderTestLevel(['.#', '##']);

    const calls = drawRecorded(createTileEdgesStep(level, 1, 1));

    expect(calls).toEqual([
      'set fillStyle(#0f0d16)',
      'fillRect(32, 62, 32, 2)',
      'fillRect(62, 32, 2, 32)',
      'fillRect(32, 32, 2, 2)',
    ]);
  });

  it('should outline every side when the block is the whole level', () => {
    const level = createRenderTestLevel(['#']);

    const calls = drawRecorded(createTileEdgesStep(level, 0, 0));

    expect(calls).toEqual([
      'set fillStyle(#0f0d16)',
      'fillRect(0, 0, 32, 2)',
      'fillRect(0, 30, 32, 2)',
      'fillRect(0, 0, 2, 32)',
      'fillRect(30, 0, 2, 32)',
    ]);
  });
});
