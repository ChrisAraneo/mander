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

  it('should draw fireballs when the art is fireballs', () => {
    const calls = drawRecorded(
      createItemArtStep({ kind: 'FIREBALLS', count: 1 }, 64),
    );

    expect(calls).toEqual([
      'save()',
      'translate(32, 14.72)',
      'rotate(0)',
      'set fillStyle(RGBA(230, 238, 255, 0.5))',
      'beginPath()',
      'ellipse(-10.88, 0, 21.76, 4.4509, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 9.6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 9.6)',
      'addColorStop(0, #FFFFFF)',
      'addColorStop(0.45, #F2F6FF)',
      'addColorStop(1, #B9C6E8)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFFFFF)',
      'beginPath()',
      'arc(0, 0, 3.6923, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw the boots when the art is boots', () => {
    const calls = drawRecorded(createItemArtStep({ kind: 'BOOTS' }, 64));

    expect(calls).toEqual([
      'save()',
      'set fillStyle(#F2FAFF)',
      'beginPath()',
      'moveTo(26.88, 51.84)',
      'ellipse(17.28, 51.84, 9.6, 5.76, 0, 0, 6.2832)',
      'moveTo(44.16, 54.4)',
      'ellipse(32, 54.4, 12.16, 7.04, 0, 0, 6.2832)',
      'moveTo(55.68, 51.2)',
      'ellipse(46.72, 51.2, 8.96, 5.12, 0, 0, 6.2832)',
      'fill()',
      'restore()',
      'save()',
      'beginPath()',
      'moveTo(25.6, 8.96)',
      'lineTo(40.96, 8.96)',
      'lineTo(40.96, 32)',
      'lineTo(44.16, 37.76)',
      'lineTo(44.16, 44.8)',
      'lineTo(15.36, 44.8)',
      'lineTo(13.44, 39.68)',
      'lineTo(23.04, 32.64)',
      'lineTo(25.6, 27.52)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(32, 8.96, 32, 44.8)',
      'addColorStop(0, #F4FBFF)',
      'addColorStop(0.55, #9FD2F0)',
      'addColorStop(1, #2F5C7E)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(#5C7EA0)',
      'beginPath()',
      'roundRect(12.8, 43.52, 32.64, 4.48, 1.92)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'fill()',
      'set fillStyle(#F4FBFF)',
      'beginPath()',
      'roundRect(23.68, 7.04, 19.2, 5.76, 2.56)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'fill()',
      'set fillStyle(#2F5C7E)',
      'beginPath()',
      'roundRect(21.76, 32, 21.12, 3.84, 1.28)',
      'fill()',
    ]);
  });

  it('should draw the helmet when the art is a helmet', () => {
    const calls = drawRecorded(createItemArtStep({ kind: 'HELMET' }, 64));

    expect(calls).toEqual([
      'save()',
      'set fillStyle(#9AA7B8)',
      'beginPath()',
      'roundRect(17.92, 32, 28.16, 10.24, 3.84)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'fill()',
      'beginPath()',
      'moveTo(12.16, 33.28)',
      'arc(32, 33.28, 19.84, 3.1416, 6.2832)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(32, 13.44, 32, 33.28)',
      'addColorStop(0, #F0F5FA)',
      'addColorStop(0.5, #9AA7B8)',
      'addColorStop(1, #2E3743)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(#F0F5FA)',
      'beginPath()',
      'roundRect(10.24, 30.08, 43.52, 5.12, 2.56)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'fill()',
      'set fillStyle(#141A24)',
      'beginPath()',
      'roundRect(18.56, 23.04, 26.88, 5.12, 1.92)',
      'fill()',
      'set fillStyle(#2E3743)',
      'beginPath()',
      'roundRect(30.08, 10.24, 3.84, 7.68, 1.92)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'fill()',
    ]);
  });
});
