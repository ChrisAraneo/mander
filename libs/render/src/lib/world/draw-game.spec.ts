import type { Bullet, Cannonball, FallingSpike } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { hashRecorded } from '../../test/hash-recorded';
import type { Palette } from '../types/palette';
import type { Viewport } from '../types/viewport';
import { drawGame } from './draw-game';

const PALETTE: Palette = {
  sky: ['#101010', '#202020', '#303030'],
  hills: ['#404040', '#505050'],
  block: 'HSL(30, 25%, 27%)',
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
};

const VIEWPORT: Viewport = { width: 320, height: 160, scale: 1 };

const SCENE_ROWS = [
  '..........',
  '.K..C..P..',
  '.@..E..P.G',
  '##^#N#BSWR',
  '##########',
];

const BULLETS: Bullet[] = [
  { position: { x: 100, y: 50 }, velocity: { x: { current: 300, max: 300 } } },
];

const CANNONBALLS: Cannonball[] = [
  { position: { x: 200, y: 40 }, velocity: { x: { current: -220, max: 220 } } },
];

const FALLING_SPIKES: FallingSpike[] = [
  {
    position: { x: 64, y: 0 },
    velocity: { y: { current: 0, max: 400 } },
    statuses: { isFalling: false },
  },
];

describe('drawGame', () => {
  it('should draw the whole scene around the player when no focus and no ghosts are given', () => {
    const state = createRenderTestState(SCENE_ROWS, { time: 1.25 });

    const fingerprint = hashRecorded((context) =>
      drawGame(context, state, PALETTE, VIEWPORT),
    );

    expect(fingerprint).toBe('494:1AKY1201T4LXIT');
  });

  it('should draw the ghosts and look at the given focus when both are given', () => {
    const state = createRenderTestState(SCENE_ROWS, { time: 1.25 });

    const fingerprint = hashRecorded((context) =>
      drawGame(context, state, PALETTE, VIEWPORT, { x: 200, y: 40 }, [
        { player: state.player, time: 0.5 },
      ]),
    );

    expect(fingerprint).toBe('541:1R6YTUP1F3VYM9');
  });

  it('should draw the moving objects on top when bullets, cannonballs and falling spikes are about', () => {
    const state = createRenderTestState(SCENE_ROWS, {
      time: 2,
      bullets: BULLETS,
      cannonballs: CANNONBALLS,
      fallingSpikes: FALLING_SPIKES,
    });

    const fingerprint = hashRecorded((context) =>
      drawGame(context, state, PALETTE, VIEWPORT),
    );

    expect(fingerprint).toBe('558:1R8PU2M0V2M0H8');
  });

  it('should centre a small level in the view when the level is narrower than the view', () => {
    const state = createRenderTestState(['.@.', '###']);

    const fingerprint = hashRecorded((context) =>
      drawGame(context, state, PALETTE, {
        width: 320,
        height: 160,
        scale: 2,
      }),
    );

    expect(fingerprint).toBe('140:1XMVVSU1N6N77K');
  });
});
