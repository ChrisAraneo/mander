import type { Bullet, Cannonball, FallingSpike } from '@mander/model';
import { last, map, size, takeRight } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { createRecordingLightingPass } from '../../test/create-recording-lighting-pass';
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
  {
    position: { x: 200, y: 40 },
    velocity: { x: { current: -220, max: 220 }, y: { current: 0, max: 220 } },
  },
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

    expect(fingerprint).toBe('495:0KDR4LM169CETJ');
  });

  it('should draw the ghosts and look at the given focus when both are given', () => {
    const state = createRenderTestState(SCENE_ROWS, { time: 1.25 });

    const fingerprint = hashRecorded((context) =>
      drawGame(context, state, PALETTE, VIEWPORT, { x: 200, y: 40 }, [
        { player: state.player, time: 0.5 },
      ]),
    );

    expect(fingerprint).toBe('542:1S18T6P03X9GNF');
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

    expect(fingerprint).toBe('559:11YKRVV1Y2JQFR');
  });

  it('should lay the light over everything else when it is given a lighting pass', () => {
    const state = createRenderTestState(SCENE_ROWS, { time: 1.25 });
    const { pass, calls: glCalls } = createRecordingLightingPass();
    const { context, calls } = createRecordingContext();

    drawGame(context, state, PALETTE, VIEWPORT, undefined, [], pass);

    expect(map(takeRight(calls, 5), 'name')).toEqual([
      'save',
      'set globalCompositeOperation',
      'set imageSmoothingEnabled',
      'drawImage',
      'restore',
    ]);
    expect(last(glCalls)?.name).toBe('drawArrays');
  });

  it('should draw the same scene without the light when no lighting pass is given', () => {
    const state = createRenderTestState(SCENE_ROWS, { time: 1.25 });
    const lit = createRecordingContext();
    const unlit = createRecordingContext();

    drawGame(
      lit.context,
      state,
      PALETTE,
      VIEWPORT,
      undefined,
      [],
      createRecordingLightingPass().pass,
    );
    drawGame(unlit.context, state, PALETTE, VIEWPORT);

    expect(size(lit.calls) - size(unlit.calls)).toBe(5);
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
