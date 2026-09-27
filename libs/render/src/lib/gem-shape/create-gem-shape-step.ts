import {
  beginPath,
  type CanvasStep,
  closePath,
  fill,
  traceLineTo,
  createLinearGradient,
  moveTo,
  restore,
  save,
  sequence,
  stroke,
  applyStyle,
  applyStyleWith,
} from '../canvas';
import { outline } from '../stroke';
import type { GemColors } from './gem-colors';

const CROWN = 0.25;

const traceGemShape = (
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
): CanvasStep =>
  sequence([
    beginPath,
    moveTo(centerX, centerY - halfHeight),
    traceLineTo(centerX + halfWidth, centerY - halfHeight * CROWN),
    traceLineTo(centerX, centerY + halfHeight),
    traceLineTo(centerX - halfWidth, centerY - halfHeight * CROWN),
    closePath,
  ]);

const createGemShapeFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfHeight: number,
  colors: GemColors,
): CanvasGradient =>
  createLinearGradient(
    context,
    centerX,
    centerY - halfHeight,
    centerX,
    centerY + halfHeight,
    [
      [0, colors.light],
      [0.45, colors.base],
      [1, colors.deep],
    ],
  );

export const createGemShapeStep = (
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  colors: GemColors,
): CanvasStep =>
  sequence([
    save,
    traceGemShape(centerX, centerY, halfWidth, halfHeight),
    outline(),
    applyStyleWith((context) => ({
      fillStyle: createGemShapeFill(
        context,
        centerX,
        centerY,
        halfHeight,
        colors,
      ),
    })),
    fill,
    restore,
    applyStyle({ strokeStyle: colors.deep, lineWidth: 1 }),
    beginPath,
    moveTo(centerX - halfWidth, centerY - halfHeight * CROWN),
    traceLineTo(centerX + halfWidth, centerY - halfHeight * CROWN),
    stroke,
  ]);
