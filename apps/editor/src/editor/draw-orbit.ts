import { FIREBALL_ORBIT_RADIUS } from '@mander/engine';
import type { Fireball } from '@mander/model';

const ORBIT_COLOUR = '#ff7a2f';
const DASH = [6, 6];

export const drawOrbit = (
  context: CanvasRenderingContext2D,
  fireball: Fireball,
): void => {
  context.save();
  context.globalAlpha = 0.35;
  context.strokeStyle = ORBIT_COLOUR;
  context.lineWidth = 1;
  context.setLineDash(DASH);
  context.beginPath();
  context.arc(
    fireball.origin.x,
    fireball.origin.y,
    FIREBALL_ORBIT_RADIUS,
    0,
    Math.PI * 2,
  );
  context.stroke();
  context.restore();
};
