import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../test/create-render-test-level';
import { drawRecorded } from '../../test/draw-recorded';
import { hashRecorded } from '../../test/hash-recorded';
import type { Palette } from '../types/palette';
import type { Viewport } from '../types/viewport';
import { drawTiles } from './draw-tiles';

const ROLLED_PALETTE: Palette = {
  sky: ['#101010', '#202020', '#303030'],
  hills: ['#404040', '#505050'],
  block: 'HSL(30, 25%, 27%)',
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
};

const PLAIN_PALETTE: Palette = { ...ROLLED_PALETTE, block: '' };

const LEVEL = createRenderTestLevel(
  ['.....', '.^.N.', '#BSWR', '#FF##'],
  ['BBBBB', '.....', '.....', '.....'],
);

const WIDE_VIEW: Viewport = { width: 160, height: 128, scale: 1 };

const NARROW_VIEW: Viewport = { width: 64, height: 32, scale: 1 };

describe('drawTiles', () => {
  it('should draw the back layer and then every front tile in the rolled colours when the whole level is in view', () => {
    const fingerprint = hashRecorded((context) =>
      drawTiles(context, LEVEL, ROLLED_PALETTE, 0, 0, WIDE_VIEW),
    );

    expect(fingerprint).toBe('257:1JDN4431TYGJSB');
  });

  it('should use the hand-picked material colours when the palette has no ground colour', () => {
    const fingerprint = hashRecorded((context) =>
      drawTiles(context, LEVEL, PLAIN_PALETTE, 0, 0, WIDE_VIEW),
    );

    expect(fingerprint).toBe('257:1T7ZMFV02MQPZB');
  });

  it('should draw only the tiles around the view when the camera has moved and the view is small', () => {
    const fingerprint = hashRecorded((context) =>
      drawTiles(context, LEVEL, ROLLED_PALETTE, 64, 32, NARROW_VIEW),
    );

    expect(fingerprint).toBe('225:1H4Y4AH00YRP0U');
  });

  it('should draw nothing when the level is all air', () => {
    const calls = drawRecorded((context) =>
      drawTiles(
        context,
        createRenderTestLevel(['...', '...']),
        ROLLED_PALETTE,
        0,
        0,
        WIDE_VIEW,
      ),
    );

    expect(calls).toEqual([]);
  });
});
