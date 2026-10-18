import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { CYAN_GEM_COLORS } from '../consts';
import { createGemShapeFill } from './create-gem-shape-fill';

describe('createGemShapeFill', () => {
  it('should make a top-to-bottom gradient in the three gem colours when it is given a centre and a height', () => {
    const calls = drawRecorded((context) =>
      createGemShapeFill(context, 16, 20, 10, CYAN_GEM_COLORS),
    );

    expect(calls).toEqual([
      'createLinearGradient(16, 10, 16, 30)',
      'addColorStop(0, #DFFBFF)',
      'addColorStop(0.45, #35C7E0)',
      'addColorStop(1, #12718F)',
    ]);
  });
});
