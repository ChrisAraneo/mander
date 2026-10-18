import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import type { Palette } from '../types/palette';
import type { Viewport } from '../types/viewport';
import { drawSky } from './draw-sky';

const PALETTE: Palette = {
  sky: ['#101010', '#202020', '#303030'],
  hills: ['#404040', '#505050'],
  block: '#606060',
  blockCap: '#707070',
  blockCapHighlight: '#808080',
};

const VIEWPORT: Viewport = { width: 320, height: 160, scale: 2 };

describe('drawSky', () => {
  it('should fill the whole view with the three sky colours when it is given a palette', () => {
    const calls = drawRecorded((context) =>
      drawSky(context, PALETTE, VIEWPORT),
    );

    expect(calls).toEqual([
      'createLinearGradient(0, 0, 0, 160)',
      'addColorStop(0, #101010)',
      'addColorStop(0.6, #202020)',
      'addColorStop(1, #303030)',
      'set fillStyle(gradient)',
      'fillRect(0, 0, 320, 160)',
    ]);
  });
});
