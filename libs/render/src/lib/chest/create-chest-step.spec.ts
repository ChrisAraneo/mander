import type { Rectangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { drawRecorded } from '../../test/draw-recorded';
import { createChestStep } from './create-chest-step';

const CHEST: Rectangle = { x: 96, y: 8, width: 24, height: 22 };

const ROWS = ['.@.C.', '#####'];

describe('createChestStep', () => {
  it('should draw the whole chest open when it has been opened', () => {
    const calls = drawRecorded(
      createChestStep(
        CHEST,
        createRenderTestState(ROWS, { isChestOpened: true }),
      ),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'rect(96, 14, 24, 16)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#7A5A30)',
      'fill()',
      'beginPath()',
      'rect(94, 2, 28, 7)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#8A683A)',
      'fill()',
      'set fillStyle(#2C2418)',
      'fillRect(98, 14, 20, 5)',
      'set fillStyle(RGBA(0, 0, 0, 0.25))',
      'fillRect(99, 14, 2, 16)',
      'fillRect(115, 14, 2, 16)',
      'restore()',
    ]);
  });

  it('should draw the whole chest shut when it has not been opened', () => {
    const calls = drawRecorded(
      createChestStep(CHEST, createRenderTestState(ROWS)),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'rect(96, 14, 24, 16)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#A97B34)',
      'fill()',
      'beginPath()',
      'rect(95, 8, 26, 9)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#C3913F)',
      'fill()',
      'set fillStyle(#E8C15C)',
      'fillRect(106, 14, 4, 7)',
      'set fillStyle(RGBA(0, 0, 0, 0.25))',
      'fillRect(99, 14, 2, 16)',
      'fillRect(115, 14, 2, 16)',
      'restore()',
    ]);
  });
});
