import {
  applyStyle,
  applyStyleWith,
  beginPath,
  type CanvasStep,
  closePath,
  createLinearGradient,
  fill,
  moveTo,
  restore,
  save,
  sequence,
  traceArc,
  traceEllipse,
  traceRoundRect,
} from '../canvas';
import { outline } from '../stroke';
import { GEAR_GLOW, TITANIUM, VISOR_DARK } from './consts';

const DOME_CENTER_Y = 0.52;
const DOME_RADIUS = 0.31;

export const createHelmetStep = (
  left: number,
  top: number,
  size: number,
): CanvasStep => {
  const projectX = (value: number): number => left + size * value;
  const projectY = (value: number): number => top + size * value;

  return sequence([
    save,
    applyStyle({ shadowColor: TITANIUM.glow, shadowBlur: GEAR_GLOW }),

    applyStyle({ fillStyle: TITANIUM.base }),
    beginPath,
    traceRoundRect(
      projectX(0.28),
      projectY(0.5),
      size * 0.44,
      size * 0.16,
      size * 0.06,
    ),
    outline(),
    fill,

    beginPath,
    moveTo(projectX(0.5 - DOME_RADIUS), projectY(DOME_CENTER_Y)),
    traceArc(
      projectX(0.5),
      projectY(DOME_CENTER_Y),
      size * DOME_RADIUS,
      Math.PI,
      Math.PI * 2,
    ),
    closePath,
    outline(),
    applyStyleWith((context) => ({
      fillStyle: createLinearGradient(
        context,
        projectX(0.5),
        projectY(DOME_CENTER_Y - DOME_RADIUS),
        projectX(0.5),
        projectY(DOME_CENTER_Y),
        [
          [0, TITANIUM.light],
          [0.5, TITANIUM.base],
          [1, TITANIUM.deep],
        ],
      ),
    })),
    fill,
    restore,

    applyStyle({ fillStyle: TITANIUM.light }),
    beginPath,
    traceRoundRect(
      projectX(0.16),
      projectY(0.47),
      size * 0.68,
      size * 0.08,
      size * 0.04,
    ),
    outline(),
    fill,

    applyStyle({ fillStyle: VISOR_DARK }),
    beginPath,
    traceRoundRect(
      projectX(0.29),
      projectY(0.36),
      size * 0.42,
      size * 0.08,
      size * 0.03,
    ),
    fill,

    applyStyle({ fillStyle: TITANIUM.deep }),
    beginPath,
    traceRoundRect(
      projectX(0.47),
      projectY(0.16),
      size * 0.06,
      size * 0.12,
      size * 0.03,
    ),
    outline(),
    fill,

    save,
    applyStyle({ globalAlpha: 0.55, fillStyle: TITANIUM.light }),
    beginPath,
    traceEllipse(
      projectX(0.38),
      projectY(0.31),
      size * 0.08,
      size * 0.04,
      -Math.PI / 6,
      0,
      Math.PI * 2,
    ),
    fill,
    restore,
  ]);
};
