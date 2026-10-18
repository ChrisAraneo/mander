import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../../test/create-render-test-level';
import { drawRecorded } from '../../../test/draw-recorded';
import { createMaterialPalette } from '../../material/create-material-palette';
import { createBackLayerTileStep } from './create-back-layer-tile-step';

const MATERIALS = createMaterialPalette({
  sky: ['#101010', '#202020', '#303030'],
  hills: ['#404040', '#505050'],
  block: 'HSL(30, 25%, 27%)',
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
});

const LEVEL = createRenderTestLevel(['..', '..'], ['W.', '..']);

describe('createBackLayerTileStep', () => {
  it('should draw the back tile shaded when the back layer holds a block there', () => {
    const calls = drawRecorded(createBackLayerTileStep(LEVEL, 0, 0, MATERIALS));

    expect(calls).toEqual([
      'save()',
      'set fillStyle(HSL(26, 21%, 43%))',
      'fillRect(0, 0, 32, 32)',
      'set fillStyle(HSL(26, 21%, 43%))',
      'fillRect(0, 0, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(0, 1, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(0, 13, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(0, 3, 26, 1)',
      'fillRect(6, 11, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(2, 5, 18, 1)',
      'set fillStyle(RGBA(0, 0, 0, 0.55))',
      'fillRect(0, 15, 32, 1)',
      'fillRect(3, 0, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(4, 0, 1, 15)',
      'set fillStyle(HSL(26, 21%, 37%))',
      'fillRect(0, 16, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(0, 17, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(0, 29, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(3, 19, 26, 1)',
      'fillRect(12, 27, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(2, 21, 18, 1)',
      'set fillStyle(RGBA(0, 0, 0, 0.55))',
      'fillRect(0, 31, 32, 1)',
      'fillRect(6, 16, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(7, 16, 1, 15)',
      'set fillStyle(HSL(26, 21%, 50%))',
      'fillRect(0, 0, 32, 7)',
      'set fillStyle(HSL(26, 21%, 57%))',
      'fillRect(0, 0, 32, 3)',
      'restore()',
      'set fillStyle(RGBA(15, 13, 22, 0.46))',
      'fillRect(0, 0, 32, 32)',
    ]);
  });

  it('should draw nothing when the back layer is empty there', () => {
    const calls = drawRecorded(createBackLayerTileStep(LEVEL, 1, 0, MATERIALS));

    expect(calls).toEqual([]);
  });
});
