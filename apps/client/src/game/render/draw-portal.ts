import type { GameState } from '@mander/engine';

export function drawPortal(
  context: CanvasRenderingContext2D,
  state: GameState,
): void {
  const portal = state.level.portal;
  const centerX = portal.x + portal.width / 2;
  const centerY = portal.y + portal.height / 2;
  const pulse = 1 + Math.sin(state.time * 3) * 0.05;

  context.save();
  context.shadowColor = '#a678ff';
  context.shadowBlur = state.nearPortal ? 30 : 14;

  const swirl = context.createRadialGradient(
    centerX,
    centerY,
    2,
    centerX,
    centerY,
    portal.width / 2 + 8,
  );
  swirl.addColorStop(0, '#e9dcff');
  swirl.addColorStop(0.45, '#8d55e0');
  swirl.addColorStop(1, '#3c2470');
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

  context.strokeStyle = '#b98cff';
  context.lineWidth = 3;
  for (let ringIndex = 0; ringIndex < 3; ringIndex++) {
    const angle = state.time * 2 + (ringIndex * Math.PI * 2) / 3;
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
  context.restore();
}
