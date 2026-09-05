import type { Player } from '@mander/model';
import { chain } from '@mander/utils';
import { filter, map, max, noop, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GHOST_ALPHA } from './consts';
import { drawGhost } from './draw-ghost';
import { drawPlayer } from './draw-player';

interface Call {
  name: string;
  args: number[];
}

const METHODS = [
  'save',
  'restore',
  'translate',
  'rotate',
  'scale',
  'beginPath',
  'clip',
  'moveTo',
  'lineTo',
  'rect',
  'roundRect',
  'arc',
  'fill',
  'stroke',
];

interface Recording {
  calls: Call[];
  alphas: number[];
  context: CanvasRenderingContext2D;
}

// The canvas keeps its own globalAlpha, and `styled` writes through lodash
// `assign`, which skips a write that matches what is already there. The stub
// holds the value the same way so the recorded writes are the real ones.
const recorder = (): Recording =>
  chain({ calls: [] as Call[], alphas: [] as number[], alpha: 1 })
    .thru((taken) => ({
      ...taken,
      context: Object.defineProperty(
        {
          ...Object.fromEntries(
            map(METHODS, (name) => [
              name,
              (...args: number[]) => taken.calls.push({ name, args }),
            ]),
          ),
          createRadialGradient: () => ({ addColorStop: noop }),
        },
        'globalAlpha',
        {
          set: (value: number) => {
            taken.alpha = value;
            taken.alphas.push(value);
          },
          get: () => taken.alpha,
        },
      ) as unknown as CanvasRenderingContext2D,
    }))
    .value();

const player = (patch: Partial<Player['timers']> = {}): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, ...patch },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const ghostOf = (patch: Partial<Player['timers']> = {}): Recording =>
  chain(recorder())
    .thru((taken) => {
      drawGhost(taken.context, { player: player(patch), time: 0 });
      return taken;
    })
    .value();

const playerOf = (patch: Partial<Player['timers']> = {}): Recording =>
  chain(recorder())
    .thru((taken) => {
      drawPlayer(taken.context, player(patch), 0);
      return taken;
    })
    .value();

const named = (calls: Call[], name: string): Call[] =>
  filter(calls, (call) => call.name === name);

describe('drawGhost', () => {
  it('draws the same figure the player is drawn with', () => {
    expect(map(ghostOf().calls, 'name')).toEqual(map(playerOf().calls, 'name'));
  });

  it('draws it see-through, where the player is drawn solid', () => {
    expect(max(ghostOf().alphas)).toBe(GHOST_ALPHA);
    expect(filter(playerOf().alphas, (alpha) => alpha < 1)).toEqual([]);
  });

  it('never draws any part of a ghost more solid than a ghost', () => {
    expect(
      filter(ghostOf({ star: 5 }).alphas, (alpha) => alpha > GHOST_ALPHA),
    ).toEqual([]);
  });

  it('keeps a fading ghost fainter still as its run ends', () => {
    expect(max(ghostOf({ death: 0.5 }).alphas)).toBeLessThan(GHOST_ALPHA);
  });

  it('hands the canvas back as it found it', () => {
    const { calls } = ghostOf({ star: 5 });

    expect(size(calls)).toBeGreaterThan(0);
    expect(size(named(calls, 'save'))).toBe(size(named(calls, 'restore')));
  });
});
