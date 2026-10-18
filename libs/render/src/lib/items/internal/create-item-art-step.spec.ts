import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { RED_GEM_COLORS } from '../../gem-shape/consts';
import { GOLD_STAR } from '../../star/consts';
import { createItemArtStep } from './create-item-art-step';

describe('createItemArtStep', () => {
  it('should draw hearts when the art is hearts', () => {
    const calls = drawRecorded(
      createItemArtStep({ kind: 'HEARTS', count: 1 }, 64),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(15.36, 24.448, 16.64, 3.1416, 0)',
      'arc(48.64, 24.448, 16.64, 3.1416, 0)',
      'lineTo(32, 52.736)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(15.36, 7.808, 48.64, 57.728)',
      'addColorStop(0, #FFC2CE)',
      'addColorStop(0.4, #FF5470)',
      'addColorStop(1, #8E1B33)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw a gem in the middle when the art is a gem', () => {
    const calls = drawRecorded(
      createItemArtStep({ kind: 'GEM', colors: RED_GEM_COLORS }, 64),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(32, 5.12)',
      'lineTo(53.76, 25.28)',
      'lineTo(32, 58.88)',
      'lineTo(10.24, 25.28)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(32, 5.12, 32, 58.88)',
      'addColorStop(0, #FFE1E7)',
      'addColorStop(0.45, #F0455F)',
      'addColorStop(1, #8E1B33)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set strokeStyle(#8E1B33)',
      'set lineWidth(1)',
      'beginPath()',
      'moveTo(10.24, 25.28)',
      'lineTo(53.76, 25.28)',
      'stroke()',
    ]);
  });

  it('should draw stars when the art is stars', () => {
    const calls = drawRecorded(
      createItemArtStep({ kind: 'STARS', count: 1, colors: GOLD_STAR }, 64),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(32, 6.4)',
      'lineTo(38.9519, 23.7116)',
      'lineTo(57.5644, 24.9736)',
      'lineTo(43.2483, 36.9348)',
      'lineTo(47.7997, 55.0264)',
      'lineTo(32, 45.1072)',
      'lineTo(16.2003, 55.0264)',
      'lineTo(20.7517, 36.9348)',
      'lineTo(6.4356, 24.9736)',
      'lineTo(25.0481, 23.7116)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(32, 6.4, 32, 60.16)',
      'addColorStop(0, #FFF8DC)',
      'addColorStop(0.45, #FFC93C)',
      'addColorStop(1, #A66A00)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw bullets when the art is bullets', () => {
    const calls = drawRecorded(
      createItemArtStep({ kind: 'BULLETS', count: 1 }, 64),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(32, 32, 14.08, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(27.3067, 27.3067, 1, 32, 32, 14.08)',
      'addColorStop(0, #BFEDFF)',
      'addColorStop(1, #12303F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.75))',
      'beginPath()',
      'arc(27.3067, 27.3067, 3.52, 0, 6.2832)',
      'fill()',
    ]);
  });
});
