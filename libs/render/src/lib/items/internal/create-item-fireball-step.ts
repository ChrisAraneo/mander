import { chain } from '@mander/model';
import { WHITE_FIREBALL } from '../../fireball/consts';
import { createFlameStep } from '../../fireball/create-flame-step';
import type { CanvasStep } from '../../types/canvas-step';

const ORBIT_RADIUS = 0.27;

const FIREBALL_RADIUS = 0.15;

const FIREBALL_TAIL = 0.34;

const FIRST_ORBIT = -Math.PI / 2;

export const createItemFireballStep = (
  index: number,
  orbiting: number,
  size: number,
): CanvasStep =>
  chain({
    angle: FIRST_ORBIT + (index * Math.PI * 2) / orbiting,
    center: size / 2,
  })
    .thru(({ angle, center }) =>
      createFlameStep(
        {
          x: center + Math.cos(angle) * size * ORBIT_RADIUS,
          y: center + Math.sin(angle) * size * ORBIT_RADIUS,
        },
        angle + Math.PI / 2,
        size * FIREBALL_RADIUS,
        WHITE_FIREBALL,
        size * FIREBALL_TAIL,
      ),
    )
    .value();
