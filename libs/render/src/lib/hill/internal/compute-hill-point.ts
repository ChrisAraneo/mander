import { type Point, chain } from '@mander/utils';
import type { HillLayer } from '../types/hill-layer';

const HILL_WAVELENGTH = 210;

const HILL_RIPPLE_FREQUENCY = 2.3;

const HILL_RIPPLE_WEIGHT = 0.4;

export const computeHillPoint = (
  screenX: number,
  cameraX: number,
  layer: HillLayer,
  baseline: number,
): Point =>
  chain((screenX + cameraX * layer.parallax) / HILL_WAVELENGTH)
    .thru((worldPhase) => ({
      x: screenX,
      y:
        baseline -
        (Math.sin(worldPhase) +
          Math.sin(worldPhase * HILL_RIPPLE_FREQUENCY) * HILL_RIPPLE_WEIGHT) *
          layer.amplitude,
    }))
    .value();
