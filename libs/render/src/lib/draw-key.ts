import {
  findKeyTile,
  type GameState,
  KEY_ENTITY_BOX,
  toEntityRectangle,
} from '@mander/engine';

import { strokeOutline } from './stroke';

const KEY_COLOR = '#FFD166';
const KEY_LINE = 3;

const traceKeyBow = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
): void => {
  context.beginPath();
  context.arc(centerX, centerY - 5, 4.5, 0, Math.PI * 2);
  context.moveTo(centerX, centerY - 0.5);
  context.lineTo(centerX, centerY + 9);
};

const traceKeyTeeth = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
): void => {
  context.beginPath();
  context.rect(centerX, centerY + 3, 5, 2.5);
  context.rect(centerX, centerY + 7, 6, 2.5);
};

/**
 * Both outlines go down before either piece of gold, so the teeth do not cut a
 * black bar across the shaft they grow out of — the key reads as one shape
 * with a line round it rather than three parts stacked up.
 */
const drawKeyGlyph = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
): void => {
  traceKeyBow(context, centerX, centerY);
  strokeOutline(context, KEY_LINE);
  traceKeyTeeth(context, centerX, centerY);
  strokeOutline(context);

  context.strokeStyle = KEY_COLOR;
  context.lineWidth = KEY_LINE;
  traceKeyBow(context, centerX, centerY);
  context.stroke();

  context.fillStyle = KEY_COLOR;
  traceKeyTeeth(context, centerX, centerY);
  context.fill();
};

export const drawKey = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void => {
  const tile = findKeyTile(state.level);
  if (state.hasKey || tile === null) return;

  const key = toEntityRectangle(tile, KEY_ENTITY_BOX);
  const bob = Math.sin(state.time * 3) * 3;
  const centerX = key.x + key.width / 2;
  const centerY = key.y + key.height / 2 + bob;

  context.save();
  context.shadowColor = KEY_COLOR;
  context.shadowBlur = 14;

  drawKeyGlyph(context, centerX, centerY);
  context.restore();
};
