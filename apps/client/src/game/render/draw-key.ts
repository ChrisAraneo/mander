import type { GameState } from '@mander/engine';

export function drawKey(
  context: CanvasRenderingContext2D,
  state: GameState,
): void {
  if (state.hasKey) return;
  const key = state.level.key;
  const bob = Math.sin(state.time * 3) * 3;
  const centerX = key.x + key.width / 2;
  const centerY = key.y + key.height / 2 + bob;

  context.save();
  context.shadowColor = '#ffd166';
  context.shadowBlur = 14;
  context.strokeStyle = '#ffd166';
  context.fillStyle = '#ffd166';
  context.lineWidth = 3;

  context.beginPath();
  context.arc(centerX, centerY - 5, 4.5, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.moveTo(centerX, centerY - 0.5);
  context.lineTo(centerX, centerY + 9);
  context.stroke();
  context.fillRect(centerX, centerY + 3, 5, 2.5);
  context.fillRect(centerX, centerY + 7, 6, 2.5);
  context.restore();
}
