import type { GameState } from '@mander/engine';
import type { Rect } from '@mander/generator';

const drawPortalCore = (
  context: CanvasRenderingContext2D,
  portal: Rect,
  centerX: number,
  centerY: number,
  pulse: number,
): void => {
  const swirl = context.createRadialGradient(
    centerX,
    centerY,
    2,
    centerX,
    centerY,
    portal.width / 2 + 8,
  );
  swirl.addColorStop(0, '#E9DCFF');
  swirl.addColorStop(0.45, '#8D55E0');
  swirl.addColorStop(1, '#3C2470');
  context.fillStyle = swirl;
  context.beginPath();
  context.ellipse(
    centerX,
    centerY,
    (portal.width / 2) * pulse,
    (portal.height / 2) * pulse,
    0,
    0,
    Math.PI * 2,
  );
  context.fill();
};

const drawPortalRings = (
  context: CanvasRenderingContext2D,
  portal: Rect,
  centerX: number,
  centerY: number,
  pulse: number,
  time: number,
): void => {
  context.strokeStyle = '#B98CFF';
  context.lineWidth = 3;
  for (let ringIndex = 0; ringIndex < 3; ringIndex++) {
    const angle = time * 2 + (ringIndex * Math.PI * 2) / 3;
    context.beginPath();
    context.ellipse(
      centerX,
      centerY,
      (portal.width / 2 - 4) * pulse,
      (portal.height / 2 - 6) * pulse,
      0,
      angle,
      angle + Math.PI * 0.6,
    );
    context.stroke();
  }
};

export const drawPortal = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void => {
  const portal = state.level.portal;
  const centerX = portal.x + portal.width / 2;
  const centerY = portal.y + portal.height / 2;
  const pulse = 1 + Math.sin(state.time * 3) * 0.05;

  context.save();
  context.shadowColor = '#A678FF';
  context.shadowBlur = state.isNearPortal ? 30 : 14;

  drawPortalCore(context, portal, centerX, centerY, pulse);
  drawPortalRings(context, portal, centerX, centerY, pulse, state.time);
  context.restore();
};
