import {
  arc,
  beginPath,
  type CanvasStep,
  closePath,
  ellipse,
  fill,
  linearGradient,
  lineTo,
  restore,
  save,
  sequence,
  styled,
  styledWith,
} from '../canvas';
import { outline } from '../stroke';

const HEART_LIGHT = '#FFC2CE';
const HEART_BASE = '#FF5470';
const HEART_DEEP = '#8E1B33';
const HEART_GLOW = '#FF8FA3';

const HEART_LIFT = 0.3;
const HEART_TIP = 1.7;

const SHEEN_ALPHA = 0.55;

const traceHeart = (
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasStep => {
  const shoulder = centerY - lobe * HEART_LIFT;

  return sequence([
    beginPath,
    arc(centerX - lobe, shoulder, lobe, Math.PI, 0),
    arc(centerX + lobe, shoulder, lobe, Math.PI, 0),
    lineTo(centerX, shoulder + lobe * HEART_TIP),
    closePath,
  ]);
};

const heartFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasGradient =>
  linearGradient(
    context,
    centerX - lobe,
    centerY - lobe * 1.3,
    centerX + lobe,
    centerY + lobe * HEART_TIP,
    [
      [0, HEART_LIGHT],
      [0.4, HEART_BASE],
      [1, HEART_DEEP],
    ],
  );

export const heartStep = (
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasStep =>
  sequence([
    save,
    styled({ shadowColor: HEART_GLOW, shadowBlur: 16 }),
    traceHeart(centerX, centerY, lobe),
    outline(),
    styledWith((context) => ({
      fillStyle: heartFill(context, centerX, centerY, lobe),
    })),
    fill,
    restore,
    save,
    styled({ globalAlpha: SHEEN_ALPHA }),
    beginPath,
    ellipse(
      centerX - lobe * 0.85,
      centerY - lobe * 0.75,
      lobe * 0.34,
      lobe * 0.22,
      -Math.PI / 5,
      0,
      Math.PI * 2,
    ),
    styled({ fillStyle: HEART_LIGHT }),
    fill,
    restore,
  ]);
