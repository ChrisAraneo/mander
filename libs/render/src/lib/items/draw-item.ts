import type { ItemArt } from '@mander/engine';
import { chain } from 'lodash-es';
import { match } from 'ts-pattern';

import type { CanvasStep } from '../canvas/canvas-step';
import {
  arc,
  beginPath,
  closePath,
  ellipse,
  fill,
  lineTo,
  restore,
  save,
  styled,
  styledWith,
} from '../canvas/commands';
import { linearGradient } from '../canvas/gradient';
import { paint, sequence } from '../canvas/paint';
import { gemStep, RED_GEM } from '../gem/gem';
import { outline } from '../stroke/stroke';

const HEART_LIGHT = '#FFC2CE';
const HEART_BASE = '#FF5470';
const HEART_DEEP = '#8E1B33';
const HEART_GLOW = '#FF8FA3';

const HEART_LOBE = 0.26;
const HEART_LIFT = 0.3;
const HEART_TIP = 1.7;

const GEM_WIDTH = 0.34;
const GEM_HEIGHT = 0.42;
const GEM_GLOW = 18;

const SHEEN_ALPHA = 0.55;

const traceHeart = (
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasStep =>
  chain(centerY - lobe * HEART_LIFT)
    .thru((shoulder) =>
      sequence([
        beginPath,
        arc(centerX - lobe, shoulder, lobe, Math.PI, 0),
        arc(centerX + lobe, shoulder, lobe, Math.PI, 0),
        lineTo(centerX, shoulder + lobe * HEART_TIP),
        closePath,
      ]),
    )
    .value();

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

const heartStep = (
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

const singleHeartStep = (size: number): CanvasStep =>
  heartStep(size / 2, size * 0.46, size * HEART_LOBE);

const doubleHeartStep = (size: number): CanvasStep =>
  chain(size * HEART_LOBE * 0.66)
    .thru((lobe) =>
      sequence([
        heartStep(size * 0.34, size * 0.32, lobe),
        heartStep(size * 0.65, size * 0.6, lobe),
      ]),
    )
    .value();

const gemArtStep = (size: number): CanvasStep =>
  gemStep(
    size / 2,
    size / 2,
    size * GEM_WIDTH,
    size * GEM_HEIGHT,
    RED_GEM,
    GEM_GLOW,
  );

export const drawItem = (
  context: CanvasRenderingContext2D,
  art: ItemArt,
  size: number,
): void =>
  paint(
    context,
    match(art)
      .with('HEART', () => singleHeartStep(size))
      .with('DOUBLE_HEART', () => doubleHeartStep(size))
      .with('GEM', () => gemArtStep(size))
      .exhaustive(),
  );
