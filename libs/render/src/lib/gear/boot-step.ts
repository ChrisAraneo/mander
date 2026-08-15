import { map } from 'lodash-es';

import {
  beginPath,
  type CanvasStep,
  closePath,
  ellipse,
  fill,
  lineTo,
  linearGradient,
  moveTo,
  restore,
  roundRect,
  save,
  sequence,
  styled,
  styledWith,
} from '../canvas';
import { outline } from '../stroke';
import { CLOUD_LEATHER, CLOUD_PUFF, CLOUD_SOLE, GEAR_GLOW } from './consts';

const SILHOUETTE: readonly { x: number; y: number }[] = [
  { x: 0.4, y: 0.14 },
  { x: 0.64, y: 0.14 },
  { x: 0.64, y: 0.5 },
  { x: 0.69, y: 0.59 },
  { x: 0.69, y: 0.7 },
  { x: 0.24, y: 0.7 },
  { x: 0.21, y: 0.62 },
  { x: 0.36, y: 0.51 },
  { x: 0.4, y: 0.43 },
];

const PUFFS: readonly { x: number; y: number; wide: number; tall: number }[] = [
  { x: 0.27, y: 0.81, wide: 0.15, tall: 0.09 },
  { x: 0.5, y: 0.85, wide: 0.19, tall: 0.11 },
  { x: 0.73, y: 0.8, wide: 0.14, tall: 0.08 },
];

export const bootStep = (
  left: number,
  top: number,
  size: number,
): CanvasStep => {
  const atX = (value: number): number => left + size * value;
  const atY = (value: number): number => top + size * value;

  return sequence([
    save,
    styled({ shadowColor: CLOUD_LEATHER.glow, shadowBlur: GEAR_GLOW }),
    styled({ fillStyle: CLOUD_PUFF, globalAlpha: 0.85 }),
    beginPath,
    ...map(PUFFS, (puff) =>
      sequence([
        moveTo(atX(puff.x + puff.wide), atY(puff.y)),
        ellipse(
          atX(puff.x),
          atY(puff.y),
          size * puff.wide,
          size * puff.tall,
          0,
          0,
          Math.PI * 2,
        ),
      ]),
    ),
    fill,
    restore,

    save,
    styled({ shadowColor: CLOUD_LEATHER.glow, shadowBlur: GEAR_GLOW }),
    beginPath,
    ...map(SILHOUETTE, (point, index) =>
      index === 0
        ? moveTo(atX(point.x), atY(point.y))
        : lineTo(atX(point.x), atY(point.y)),
    ),
    closePath,
    outline(),
    styledWith((context) => ({
      fillStyle: linearGradient(
        context,
        atX(0.5),
        atY(0.14),
        atX(0.5),
        atY(0.7),
        [
          [0, CLOUD_LEATHER.light],
          [0.55, CLOUD_LEATHER.base],
          [1, CLOUD_LEATHER.deep],
        ],
      ),
    })),
    fill,
    restore,

    styled({ fillStyle: CLOUD_SOLE }),
    beginPath,
    roundRect(atX(0.2), atY(0.68), size * 0.51, size * 0.07, size * 0.03),
    outline(),
    fill,

    styled({ fillStyle: CLOUD_LEATHER.light }),
    beginPath,
    roundRect(atX(0.37), atY(0.11), size * 0.3, size * 0.09, size * 0.04),
    outline(),
    fill,

    styled({ fillStyle: CLOUD_LEATHER.deep }),
    beginPath,
    roundRect(atX(0.34), atY(0.5), size * 0.33, size * 0.06, size * 0.02),
    fill,
  ]);
};
