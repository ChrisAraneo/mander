import type { Player } from '@mander/model';
import { chain } from '@mander/utils';
import { filter, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

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
  context: CanvasRenderingContext2D;
}

const recorder = (): Recording =>
  chain({ calls: [] as Call[] })
    .thru((taken) => ({
      ...taken,
      context: Object.fromEntries(
        map(METHODS, (name) => [
          name,
          (...args: number[]) => taken.calls.push({ name, args }),
        ]),
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
  it('should draw the same figure the player is drawn with when it draws a ghost', () => {
    expect(map(ghostOf().calls, 'name')).toEqual(map(playerOf().calls, 'name'));
  });

  it('should draw the ghost the same way as any other when it is starlit', () => {
    expect(map(ghostOf({ star: 5 }).calls, 'name')).toEqual(
      map(ghostOf().calls, 'name'),
    );
  });

  it('should hand the canvas back as it found it when it draws a ghost', () => {
    const { calls } = ghostOf({ star: 5 });

    expect(size(calls)).toBeGreaterThan(0);
    expect(size(named(calls, 'save'))).toBe(size(named(calls, 'restore')));
  });
});
