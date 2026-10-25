import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createMoveToStep } from './create-move-to-step';
import { createOptionalStep } from './create-optional-step';

describe('createOptionalStep', () => {
  it('should draw the step for the value when the value is present', () => {
    const calls = drawRecorded(
      createOptionalStep({ x: 4, y: 5 }, (point) =>
        createMoveToStep(point.x, point.y),
      ),
    );

    expect(calls).toEqual(['moveTo(4, 5)']);
  });

  it('should draw nothing when the value is missing', () => {
    const calls = drawRecorded(
      createOptionalStep(undefined, (point: { x: number; y: number }) =>
        createMoveToStep(point.x, point.y),
      ),
    );

    expect(calls).toEqual([]);
  });

  it('should draw nothing when the value is null', () => {
    const calls = drawRecorded(
      createOptionalStep(null, (point: { x: number; y: number }) =>
        createMoveToStep(point.x, point.y),
      ),
    );

    expect(calls).toEqual([]);
  });

  it('should draw the step when the value is zero', () => {
    const calls = drawRecorded(
      createOptionalStep(0, (offset) => createMoveToStep(offset, offset)),
    );

    expect(calls).toEqual(['moveTo(0, 0)']);
  });
});
