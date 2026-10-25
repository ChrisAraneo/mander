import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createCannonChargeStep } from './create-cannon-charge-step';

describe('createCannonChargeStep', () => {
  it('should draw a small glow at the muzzle when the charge is half full', () => {
    const calls = drawRecorded(createCannonChargeStep(0.5));

    expect(calls).toEqual([
      'save()',
      'set fillStyle(#FF9E3D)',
      'beginPath()',
      'arc(22, 0, 3, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw the full glow at the muzzle when the charge is full', () => {
    const calls = drawRecorded(createCannonChargeStep(1));

    expect(calls).toEqual([
      'save()',
      'set fillStyle(#FF9E3D)',
      'beginPath()',
      'arc(22, 0, 6, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw nothing when the cannon has no charge', () => {
    const calls = drawRecorded(createCannonChargeStep(0));

    expect(calls).toEqual([]);
  });
});
