import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../../test/create-render-test-level';
import { drawRecorded } from '../../../test/draw-recorded';
import { createMaterialPalette } from '../../material/create-material-palette';
import { createFrontLayerTileStep } from './create-front-layer-tile-step';

const MATERIALS = createMaterialPalette({
  sky: ['#101010', '#202020', '#303030'],
  hills: ['#404040', '#505050'],
  block: 'HSL(30, 25%, 27%)',
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
});

const LEVEL = createRenderTestLevel(['.^N', 'S#.']);

describe('createFrontLayerTileStep', () => {
  it('should draw a spike when the tile is a spike', () => {
    const calls = drawRecorded(
      createFrontLayerTileStep(LEVEL, 1, 0, MATERIALS),
    );

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(45.1667, 32)',
      'lineTo(48, 10.24)',
      'lineTo(50.8333, 32)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(45.1667, 32, 45.1667, 10.24)',
      'addColorStop(0, #8B90A3)',
      'addColorStop(1, #DFE3EE)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });

  it('should draw nothing when the tile is a cannon', () => {
    const calls = drawRecorded(
      createFrontLayerTileStep(LEVEL, 2, 0, MATERIALS),
    );

    expect(calls).toEqual([]);
  });

  it('should draw a solid block when the tile is solid', () => {
    const calls = drawRecorded(
      createFrontLayerTileStep(LEVEL, 0, 1, MATERIALS),
    );

    expect(calls).toEqual([
      'set fillStyle(HSL(213, 3%, 46%))',
      'fillRect(0, 32, 32, 32)',
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(6, 39, 7, 5)',
      'fillRect(19, 48, 8, 6)',
      'set fillStyle(RGBA(255, 255, 255, 0.16))',
      'fillRect(8, 52, 6, 4)',
      'fillRect(20, 38, 5, 4)',
      'set fillStyle(HSL(213, 3%, 53%))',
      'fillRect(0, 32, 32, 7)',
      'set fillStyle(HSL(213, 3%, 60%))',
      'fillRect(0, 32, 32, 3)',
      'set fillStyle(#0f0d16)',
      'fillRect(0, 32, 32, 2)',
      'fillRect(0, 62, 32, 2)',
      'fillRect(0, 32, 2, 32)',
    ]);
  });

  it('should draw nothing when the tile is air', () => {
    const calls = drawRecorded(
      createFrontLayerTileStep(LEVEL, 0, 0, MATERIALS),
    );

    expect(calls).toEqual([]);
  });
});
