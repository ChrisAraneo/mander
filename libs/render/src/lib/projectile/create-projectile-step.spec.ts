import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createStyleStep } from '../canvas/create-style-step';
import { drawFill } from '../canvas/draw-fill';
import { createProjectileStep } from './create-projectile-step';

describe('createProjectileStep', () => {
  it('should draw the parts around the centre of the projectile when it flies to the right', () => {
    const calls = drawRecorded(
      createProjectileStep(
        { x: 100, y: 50 },
        5,
        300,
        createStyleStep({ fillStyle: '#FFFFFF' }),
        drawFill,
      ),
    );

    expect(calls).toEqual([
      'save()',
      'translate(105, 55)',
      'scale(1, 1)',
      'set fillStyle(#FFFFFF)',
      'fill()',
      'restore()',
    ]);
  });

  it('should mirror the parts when the projectile flies to the left', () => {
    const calls = drawRecorded(
      createProjectileStep({ x: 40, y: 70 }, 6, -300, drawFill),
    );

    expect(calls).toEqual([
      'save()',
      'translate(46, 76)',
      'scale(-1, 1)',
      'fill()',
      'restore()',
    ]);
  });
});
