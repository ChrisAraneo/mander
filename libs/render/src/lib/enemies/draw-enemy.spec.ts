import type { Enemy, EnemyKind } from '@mander/model';
import { chain } from '@mander/utils';
import { every, filter, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawEnemy } from './draw-enemy';

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
  'closePath',
  'moveTo',
  'lineTo',
  'rect',
  'roundRect',
  'arc',
  'ellipse',
  'fill',
  'stroke',
];

const recorder = (): { calls: Call[]; context: CanvasRenderingContext2D } =>
  chain([] as Call[])
    .thru((calls) => ({
      calls,
      context: Object.fromEntries(
        map(METHODS, (name) => [
          name,
          (...args: number[]) => calls.push({ name, args }),
        ]),
      ) as unknown as CanvasRenderingContext2D,
    }))
    .value();

const enemy = (kind: EnemyKind, isGrounded: boolean): Enemy => ({
  kind,
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death: null },
  spawn: { x: 64, y: 96 },
  statuses: { isFacingRight: true, isGrounded },
});

const drawn = (kind: EnemyKind, isGrounded: boolean): Call[] =>
  chain(recorder())
    .tap(({ context }) => drawEnemy(context, enemy(kind, isGrounded), 0))
    .thru(({ calls }) => calls)
    .value();

const named = (calls: Call[], name: string): Call[] =>
  filter(calls, (call) => call.name === name);

const jawTilts = (calls: Call[]): number[] =>
  map(named(calls, 'rotate'), (call) => call.args[0]);

describe('drawEnemy', () => {
  it('draws a beartrap and hands the canvas back as it found it', () => {
    const calls = drawn('BEARTRAP', true);

    expect(size(calls)).toBeGreaterThan(0);
    expect(size(named(calls, 'save'))).toBe(size(named(calls, 'restore')));
  });

  it('gapes the jaws of a resting trap and shuts them once it leaps', () => {
    const resting = jawTilts(drawn('BEARTRAP', true));
    const leaping = jawTilts(drawn('BEARTRAP', false));

    expect(size(resting)).toBe(2);
    expect(size(leaping)).toBe(2);
    expect(every(resting, (tilt) => tilt < 0)).toBe(true);
    expect(every(leaping, (tilt) => tilt > 0)).toBe(true);
  });

  it('leaves the other enemies drawn as they always were', () => {
    expect(size(jawTilts(drawn('HOPPING', true)))).toBe(0);
    expect(size(named(drawn('HOPPING', true), 'save'))).toBe(
      size(named(drawn('HOPPING', true), 'restore')),
    );
  });
});
