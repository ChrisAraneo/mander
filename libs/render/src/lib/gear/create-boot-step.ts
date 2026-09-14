import { map } from 'lodash-es';

import {
  beginPath,
  type CanvasStep,
  closePath,
  traceEllipse,
  fill,
  traceLineTo,
  createLinearGradient,
  moveTo,
  restore,
  traceRoundRect,
  save,
  sequence,
  applyStyle,
  applyStyleWith,
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

export const createBootStep = (
  left: number,
  top: number,
  size: number,
): CanvasStep => {
  const projectX = (value: number): number => left + size * value;
  const projectY = (value: number): number => top + size * value;

  return sequence([
    save,
    applyStyle({ shadowColor: CLOUD_LEATHER.glow, shadowBlur: GEAR_GLOW }),
    applyStyle({ fillStyle: CLOUD_PUFF, globalAlpha: 0.85 }),
    beginPath,
    ...map(PUFFS, (puff) =>
      sequence([
        moveTo(projectX(puff.x + puff.wide), projectY(puff.y)),
        traceEllipse(
          projectX(puff.x),
          projectY(puff.y),
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
    applyStyle({ shadowColor: CLOUD_LEATHER.glow, shadowBlur: GEAR_GLOW }),
    beginPath,
    ...map(SILHOUETTE, (point, index) =>
      index === 0
        ? moveTo(projectX(point.x), projectY(point.y))
        : traceLineTo(projectX(point.x), projectY(point.y)),
    ),
    closePath,
    outline(),
    applyStyleWith((context) => ({
      fillStyle: createLinearGradient(
        context,
        projectX(0.5),
        projectY(0.14),
        projectX(0.5),
        projectY(0.7),
        [
          [0, CLOUD_LEATHER.light],
          [0.55, CLOUD_LEATHER.base],
          [1, CLOUD_LEATHER.deep],
        ],
      ),
    })),
    fill,
    restore,

    applyStyle({ fillStyle: CLOUD_SOLE }),
    beginPath,
    traceRoundRect(
      projectX(0.2),
      projectY(0.68),
      size * 0.51,
      size * 0.07,
      size * 0.03,
    ),
    outline(),
    fill,

    applyStyle({ fillStyle: CLOUD_LEATHER.light }),
    beginPath,
    traceRoundRect(
      projectX(0.37),
      projectY(0.11),
      size * 0.3,
      size * 0.09,
      size * 0.04,
    ),
    outline(),
    fill,

    applyStyle({ fillStyle: CLOUD_LEATHER.deep }),
    beginPath,
    traceRoundRect(
      projectX(0.34),
      projectY(0.5),
      size * 0.33,
      size * 0.06,
      size * 0.02,
    ),
    fill,
  ]);
};
