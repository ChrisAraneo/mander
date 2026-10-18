import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createArcStep } from '../../canvas/create-arc-step';
import { createItemClusterStep } from './create-item-cluster-step';

describe('createItemClusterStep', () => {
  it('should draw one part per spot scaled to the item size when given a cluster', () => {
    const calls = drawRecorded(
      createItemClusterStep(
        {
          scale: 0.25,
          spots: [
            { x: 0.25, y: 0.5 },
            { x: 0.75, y: 0.5 },
          ],
        },
        40,
        (centerX, centerY, scale) =>
          createArcStep(centerX, centerY, scale, 0, Math.PI),
      ),
    );

    expect(calls).toEqual([
      'arc(10, 20, 10, 0, 3.1416)',
      'arc(30, 20, 10, 0, 3.1416)',
    ]);
  });
});
