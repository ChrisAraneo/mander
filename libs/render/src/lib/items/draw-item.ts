import type { ItemArt } from '@mander/engine';
import { match } from 'ts-pattern';

import { drawGem, RED_GEM } from '../gem/gem';
import { strokeOutline } from '../stroke/stroke';

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
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  lobe: number,
): void => {
  const shoulder = centerY - lobe * HEART_LIFT;

  context.beginPath();
  context.arc(centerX - lobe, shoulder, lobe, Math.PI, 0);
  context.arc(centerX + lobe, shoulder, lobe, Math.PI, 0);
  context.lineTo(centerX, shoulder + lobe * HEART_TIP);
  context.closePath();
};

const heartFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasGradient => {
  const gradient = context.createLinearGradient(
    centerX - lobe,
    centerY - lobe * 1.3,
    centerX + lobe,
    centerY + lobe * HEART_TIP,
  );
  gradient.addColorStop(0, HEART_LIGHT);
  gradient.addColorStop(0.4, HEART_BASE);
  gradient.addColorStop(1, HEART_DEEP);

  return gradient;
};

const drawHeart = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  lobe: number,
): void => {
  context.save();
  context.shadowColor = HEART_GLOW;
  context.shadowBlur = 16;
  traceHeart(context, centerX, centerY, lobe);
  strokeOutline(context);
  context.fillStyle = heartFill(context, centerX, centerY, lobe);
  context.fill();
  context.restore();

  context.save();
  context.globalAlpha = SHEEN_ALPHA;
  context.beginPath();
  context.ellipse(
    centerX - lobe * 0.85,
    centerY - lobe * 0.75,
    lobe * 0.34,
    lobe * 0.22,
    -Math.PI / 5,
    0,
    Math.PI * 2,
  );
  context.fillStyle = HEART_LIGHT;
  context.fill();
  context.restore();
};

const drawSingleHeart = (
  context: CanvasRenderingContext2D,
  size: number,
): void => drawHeart(context, size / 2, size * 0.46, size * HEART_LOBE);

const drawDoubleHeart = (
  context: CanvasRenderingContext2D,
  size: number,
): void => {
  const lobe = size * HEART_LOBE * 0.66;

  drawHeart(context, size * 0.34, size * 0.32, lobe);
  drawHeart(context, size * 0.65, size * 0.6, lobe);
};

const drawGemArt = (context: CanvasRenderingContext2D, size: number): void =>
  drawGem(
    context,
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
  match(art)
    .with('HEART', () => drawSingleHeart(context, size))
    .with('DOUBLE_HEART', () => drawDoubleHeart(context, size))
    .with('GEM', () => drawGemArt(context, size))
    .exhaustive();
