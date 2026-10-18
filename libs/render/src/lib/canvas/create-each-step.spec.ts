import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createEachStep } from './create-each-step';
import { createMoveToStep } from './create-move-to-step';

describe('createEachStep', () => {
  it('should draw a step for every item in order when given a list', () => {
    const calls = drawRecorded(
      createEachStep([3, 1, 2], (item) => createMoveToStep(item, item)),
    );

    expect(calls).toEqual(['moveTo(3, 3)', 'moveTo(1, 1)', 'moveTo(2, 2)']);
  });

  it('should draw nothing when the list is empty', () => {
    const calls = drawRecorded(
      createEachStep([], (item: number) => createMoveToStep(item, item)),
    );

    expect(calls).toEqual([]);
  });
});
