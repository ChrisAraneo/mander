import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { drawRecorded } from '../../test/draw-recorded';
import { drawChest } from './draw-chest';

const CHEST_ROWS = ['.@.C.', '#####'];

describe('drawChest', () => {
  it('should draw the chest shut with its latch when it has not been opened', () => {
    const state = createRenderTestState(CHEST_ROWS);

    const calls = drawRecorded((context) => drawChest(context, state));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'rect(99, 16, 26, 16)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#A97B34)',
      'fill()',
      'beginPath()',
      'rect(98, 10, 28, 9)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#C3913F)',
      'fill()',
      'set fillStyle(#E8C15C)',
      'fillRect(110, 16, 4, 7)',
      'set fillStyle(RGBA(0, 0, 0, 0.25))',
      'fillRect(102, 16, 2, 16)',
      'fillRect(120, 16, 2, 16)',
      'restore()',
    ]);
  });

  it('should draw the lid raised over a dark cavity when the chest has been opened', () => {
    const state = createRenderTestState(CHEST_ROWS, { isChestOpened: true });

    const calls = drawRecorded((context) => drawChest(context, state));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'rect(99, 16, 26, 16)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#7A5A30)',
      'fill()',
      'beginPath()',
      'rect(97, 4, 30, 7)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#8A683A)',
      'fill()',
      'set fillStyle(#2C2418)',
      'fillRect(101, 16, 22, 5)',
      'set fillStyle(RGBA(0, 0, 0, 0.25))',
      'fillRect(102, 16, 2, 16)',
      'fillRect(120, 16, 2, 16)',
      'restore()',
    ]);
  });

  it('should draw nothing when the level has no chest', () => {
    const state = createRenderTestState(['.@...', '#####']);

    const calls = drawRecorded((context) => drawChest(context, state));

    expect(calls).toEqual([]);
  });
});
