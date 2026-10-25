import { FIREBALL_ORBIT_RADIUS } from '@mander/engine';
import type { Fireball } from '@mander/model';
import { assign, tap } from 'lodash-es';
import { pipe } from 'remeda';

const ORBIT_COLOUR = '#ff7a2f';

const DASH = [6, 6];

const FULL_TURN = Math.PI * 2;

export const drawOrbit = (
  context: CanvasRenderingContext2D,
  fireball: Fireball,
): void =>
  pipe(
    context,
    (target) => tap(target, () => target.save()),
    (target) =>
      assign(target, {
        globalAlpha: 0.35,
        strokeStyle: ORBIT_COLOUR,
        lineWidth: 1,
      }),
    (target) => tap(target, () => target.setLineDash(DASH)),
    (target) => tap(target, () => target.beginPath()),
    (target) =>
      tap(target, () =>
        target.arc(
          fireball.origin.x,
          fireball.origin.y,
          FIREBALL_ORBIT_RADIUS,
          0,
          FULL_TURN,
        ),
      ),
    (target) => tap(target, () => target.stroke()),
    (target) => target.restore(),
  );
