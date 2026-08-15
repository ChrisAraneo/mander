import {
  arc,
  beginPath,
  type CanvasStep,
  closePath,
  ellipse,
  fill,
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
import { GEAR_GLOW, TITANIUM, VISOR_DARK } from './consts';

const DOME_CENTER_Y = 0.52;
const DOME_RADIUS = 0.31;

export const helmetStep = (
  left: number,
  top: number,
  size: number,
): CanvasStep => {
  const atX = (value: number): number => left + size * value;
  const atY = (value: number): number => top + size * value;

  return sequence([
    save,
    styled({ shadowColor: TITANIUM.glow, shadowBlur: GEAR_GLOW }),

    styled({ fillStyle: TITANIUM.base }),
    beginPath,
    roundRect(atX(0.28), atY(0.5), size * 0.44, size * 0.16, size * 0.06),
    outline(),
    fill,

    beginPath,
    moveTo(atX(0.5 - DOME_RADIUS), atY(DOME_CENTER_Y)),
    arc(atX(0.5), atY(DOME_CENTER_Y), size * DOME_RADIUS, Math.PI, Math.PI * 2),
    closePath,
    outline(),
    styledWith((context) => ({
      fillStyle: linearGradient(
        context,
        atX(0.5),
        atY(DOME_CENTER_Y - DOME_RADIUS),
        atX(0.5),
        atY(DOME_CENTER_Y),
        [
          [0, TITANIUM.light],
          [0.5, TITANIUM.base],
          [1, TITANIUM.deep],
        ],
      ),
    })),
    fill,
    restore,

    styled({ fillStyle: TITANIUM.light }),
    beginPath,
    roundRect(atX(0.16), atY(0.47), size * 0.68, size * 0.08, size * 0.04),
    outline(),
    fill,

    styled({ fillStyle: VISOR_DARK }),
    beginPath,
    roundRect(atX(0.29), atY(0.36), size * 0.42, size * 0.08, size * 0.03),
    fill,

    styled({ fillStyle: TITANIUM.deep }),
    beginPath,
    roundRect(atX(0.47), atY(0.16), size * 0.06, size * 0.12, size * 0.03),
    outline(),
    fill,

    save,
    styled({ globalAlpha: 0.55, fillStyle: TITANIUM.light }),
    beginPath,
    ellipse(
      atX(0.38),
      atY(0.31),
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
