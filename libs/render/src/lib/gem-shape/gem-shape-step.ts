import {
  beginPath,
  type CanvasStep,
  closePath,
  fill,
  lineTo,
  linearGradient,
  moveTo,
  restore,
  save,
  sequence,
  stroke,
  styled,
  styledWith,
} from '../canvas';
import { outline } from '../stroke';
import type { GemColors } from './gem-colors';

const CROWN = 0.25;

const FACET_ALPHA = 0.45;

const traceGemShape = (
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
): CanvasStep =>
  sequence([
    beginPath,
    moveTo(centerX, centerY - halfHeight),
    lineTo(centerX + halfWidth, centerY - halfHeight * CROWN),
    lineTo(centerX, centerY + halfHeight),
    lineTo(centerX - halfWidth, centerY - halfHeight * CROWN),
    closePath,
  ]);

const traceFacet = (
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
): CanvasStep =>
  sequence([
    beginPath,
    moveTo(centerX, centerY - halfHeight),
    lineTo(centerX, centerY + halfHeight),
    lineTo(centerX - halfWidth, centerY - halfHeight * CROWN),
    closePath,
  ]);

const gemShapeFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfHeight: number,
  colors: GemColors,
): CanvasGradient =>
  linearGradient(
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

export const gemShapeStep = (
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  colors: GemColors,
  glowBlur: number,
): CanvasStep =>
  sequence([
    save,
    styled({ shadowColor: colors.glow, shadowBlur: glowBlur }),
    traceGemShape(centerX, centerY, halfWidth, halfHeight),
    outline(),
    styledWith((context) => ({
      fillStyle: gemShapeFill(context, centerX, centerY, halfHeight, colors),
    })),
    fill,
    restore,
    save,
    styled({ globalAlpha: FACET_ALPHA }),
    traceFacet(centerX, centerY, halfWidth, halfHeight),
    styled({ fillStyle: colors.light }),
    fill,
    restore,
    styled({ strokeStyle: colors.deep, lineWidth: 1 }),
    beginPath,
    moveTo(centerX - halfWidth, centerY - halfHeight * CROWN),
    lineTo(centerX + halfWidth, centerY - halfHeight * CROWN),
    stroke,
  ]);
