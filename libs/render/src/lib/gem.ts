import { strokeOutline } from './stroke';

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
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
): void => {
  context.beginPath();
  context.moveTo(centerX, centerY - halfHeight);
  context.lineTo(centerX + halfWidth, centerY - halfHeight * CROWN);
  context.lineTo(centerX, centerY + halfHeight);
  context.lineTo(centerX - halfWidth, centerY - halfHeight * CROWN);
  context.closePath();
};

const traceFacet = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
): void => {
  context.beginPath();
  context.moveTo(centerX, centerY - halfHeight);
  context.lineTo(centerX, centerY + halfHeight);
  context.lineTo(centerX - halfWidth, centerY - halfHeight * CROWN);
  context.closePath();
};

const gemFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfHeight: number,
  colors: GemColors,
): CanvasGradient => {
  const gradient = context.createLinearGradient(
    centerX,
    centerY - halfHeight,
    centerX,
    centerY + halfHeight,
  );
  gradient.addColorStop(0, colors.light);
  gradient.addColorStop(0.45, colors.base);
  gradient.addColorStop(1, colors.deep);

  return gradient;
};

export const drawGem = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  colors: GemColors,
  glowBlur: number,
): void => {
  context.save();
  context.shadowColor = colors.glow;
  context.shadowBlur = glowBlur;
  traceGem(context, centerX, centerY, halfWidth, halfHeight);
  strokeOutline(context);
  context.fillStyle = gemFill(context, centerX, centerY, halfHeight, colors);
  context.fill();
  context.restore();

  context.save();
  context.globalAlpha = FACET_ALPHA;
  traceFacet(context, centerX, centerY, halfWidth, halfHeight);
  context.fillStyle = colors.light;
  context.fill();
  context.restore();

  context.strokeStyle = colors.deep;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(centerX - halfWidth, centerY - halfHeight * CROWN);
  context.lineTo(centerX + halfWidth, centerY - halfHeight * CROWN);
  context.stroke();
};
