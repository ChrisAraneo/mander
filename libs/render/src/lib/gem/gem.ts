import type { CanvasStep } from '../canvas/canvas-step';
import {
  beginPath,
  closePath,
  fill,
  lineTo,
  moveTo,
  restore,
  save,
  stroke,
  styled,
  styledWith,
} from '../canvas/commands';
import { linearGradient } from '../canvas/gradient';
import { paint, sequence } from '../canvas/paint';
import { outline } from '../stroke/stroke';

export interface GemColors {
  light: string;
  base: string;
  deep: string;
  glow: string;
}

export const CYAN_GEM: GemColors = {
  light: '#DFFBFF',
  base: '#35C7E0',
  deep: '#12718F',
  glow: '#7BE8FF',
};

export const RED_GEM: GemColors = {
  light: '#FFE1E7',
  base: '#F0455F',
  deep: '#8E1B33',
  glow: '#FF7C93',
};

const CROWN = 0.25;

const FACET_ALPHA = 0.45;

const traceGem = (
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

const gemFill = (
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

export const gemStep = (
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
    traceGem(centerX, centerY, halfWidth, halfHeight),
    outline(),
    styledWith((context) => ({
      fillStyle: gemFill(context, centerX, centerY, halfHeight, colors),
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

export const drawGem = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  colors: GemColors,
  glowBlur: number,
): void =>
  paint(
    context,
    gemStep(centerX, centerY, halfWidth, halfHeight, colors, glowBlur),
  );
