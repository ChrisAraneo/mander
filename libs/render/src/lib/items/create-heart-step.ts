import {
  applyStyleWith,
  beginPath,
  type CanvasStep,
  closePath,
  createLinearGradient,
  fill,
  restore,
  save,
  sequence,
  traceArc,
  traceLineTo,
} from '../canvas';
import { outline } from '../stroke';

const HEART_LIGHT = '#FFC2CE';
const HEART_BASE = '#FF5470';
const HEART_DEEP = '#8E1B33';

const HEART_LIFT = 0.3;
const HEART_TIP = 1.7;

const traceHeart = (
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasStep => {
  const shoulder = centerY - lobe * HEART_LIFT;

  return sequence([
    beginPath,
    traceArc(centerX - lobe, shoulder, lobe, Math.PI, 0),
    traceArc(centerX + lobe, shoulder, lobe, Math.PI, 0),
    traceLineTo(centerX, shoulder + lobe * HEART_TIP),
    closePath,
  ]);
};

const createHeartFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasGradient =>
  createLinearGradient(
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

export const createHeartStep = (
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasStep =>
  sequence([
    save,
    traceHeart(centerX, centerY, lobe),
    outline(),
    applyStyleWith((context) => ({
      fillStyle: createHeartFill(context, centerX, centerY, lobe),
    })),
    fill,
    restore,
  ]);
