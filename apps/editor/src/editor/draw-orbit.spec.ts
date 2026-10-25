import { FIREBALL_ORBIT_RADIUS } from '@mander/engine';
import type { Fireball } from '@mander/model';
import { map, tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawOrbit } from './draw-orbit';

interface CanvasCall {
  name: string;
  args: unknown[];
}

const createRecordingContext = (
  calls: CanvasCall[],
): CanvasRenderingContext2D =>
  new Proxy(
    {},
    {
      get:
        (_, name, receiver) =>
        (...args: unknown[]): unknown =>
          tap(receiver, () => calls.push({ name: String(name), args })),
      set: (_, name, value) =>
        tap(true, () =>
          calls.push({ name: `set ${String(name)}`, args: [value] }),
        ),
    },
  ) as unknown as CanvasRenderingContext2D;

const FIREBALL = { origin: { x: 40, y: 72 } } as unknown as Fireball;

describe('drawOrbit', () => {
  it('should stroke a faint dashed circle around the origin inside a saved state when it draws', () => {
    const calls: CanvasCall[] = [];

    drawOrbit(createRecordingContext(calls), FIREBALL);

    expect(map(calls, (call) => call.name)).toEqual([
      'save',
      'set globalAlpha',
      'set strokeStyle',
      'set lineWidth',
      'setLineDash',
      'beginPath',
      'arc',
      'stroke',
      'restore',
    ]);
    expect(calls[6].args).toEqual([
      40,
      72,
      FIREBALL_ORBIT_RADIUS,
      0,
      Math.PI * 2,
    ]);
  });
});
