import { type Point } from '@mander/model';
import { pipe } from 'remeda';
import type { HillLayer } from '../types/hill-layer';
import { computeHillWave } from './compute-hill-wave';

const HILL_WAVELENGTH = 210;

export const computeHillPoint = (
  screenX: number,
  cameraX: number,
  layer: HillLayer,
  baseline: number,
): Point =>
  pipe(
    (screenX + cameraX * layer.parallax) / HILL_WAVELENGTH,
    computeHillWave,
    (wave): Point => ({ x: screenX, y: baseline - wave * layer.amplitude }),
  );
