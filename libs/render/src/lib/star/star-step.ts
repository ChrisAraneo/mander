import type { Point } from '@mander/utils';
import { map, range } from 'lodash-es';
import { match } from 'ts-pattern';

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
  save,
  sequence,
  styled,
  styledWith,
} from '../canvas';
import { outline } from '../stroke';
import type { StarColors } from './star-colors';

const ARMS = 5;
const WAIST = 0.44;
const FIRST_ARM = -Math.PI / 2;

const SHEEN_ALPHA = 0.5;

const armPoints = (centerX: number, centerY: number, radius: number): Point[] =>
  map(range(ARMS * 2), (index) => {
    const angle = FIRST_ARM + (index * Math.PI) / ARMS;
    const reach = index % 2 === 0 ? radius : radius * WAIST;

    return {
      x: centerX + Math.cos(angle) * reach,
      y: centerY + Math.sin(angle) * reach,
    };
  });

const traceStar = (
  centerX: number,
  centerY: number,
  radius: number,
): CanvasStep =>
  sequence([
    beginPath,
    ...map(armPoints(centerX, centerY, radius), (point, index) =>
      match(index === 0)
        .with(true, () => moveTo(point.x, point.y))
        .otherwise(() => lineTo(point.x, point.y)),
    ),
    closePath,
  ]);

const starFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  colors: StarColors,
): CanvasGradient =>
  linearGradient(
    context,
    centerX,
    centerY - radius,
    centerX,
    centerY + radius,
    [
      [0, colors.light],
      [0.45, colors.base],
      [1, colors.deep],
    ],
  );

export const starStep = (
  centerX: number,
  centerY: number,
  radius: number,
  colors: StarColors,
  glowBlur: number,
): CanvasStep =>
  sequence([
    save,
    styled({ shadowColor: colors.glow, shadowBlur: glowBlur }),
    traceStar(centerX, centerY, radius),
    outline(),
    styledWith((context) => ({
      fillStyle: starFill(context, centerX, centerY, radius, colors),
    })),
    fill,
    restore,
    save,
    styled({ globalAlpha: SHEEN_ALPHA }),
    beginPath,
    ellipse(
      centerX - radius * 0.16,
      centerY - radius * 0.28,
      radius * 0.22,
      radius * 0.12,
      -Math.PI / 5,
      0,
      Math.PI * 2,
    ),
    styled({ fillStyle: colors.light }),
    fill,
    restore,
  ]);
