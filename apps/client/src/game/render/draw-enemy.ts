import { ENEMY_HEIGHT, ENEMY_WIDTH, type Enemy } from '@mander/engine';

export function drawEnemy(context: CanvasRenderingContext2D, enemy: Enemy, time: number): void {
  const centerX = enemy.x + ENEMY_WIDTH / 2;
  const centerY = enemy.y + ENEMY_HEIGHT / 2;
  const wobble = enemy.grounded ? Math.sin(time * 9 + enemy.homeX * 0.2) * 1.2 : 0;
  const halfWidth = ENEMY_WIDTH / 2;
  const halfHeight = ENEMY_HEIGHT / 2;

  context.save();
  context.translate(centerX, centerY + wobble);
  context.scale(enemy.facing, 1);

  context.fillStyle = '#7d2f2a';
  context.fillRect(-halfWidth + 3, halfHeight - 4, 5, 3);
  context.fillRect(halfWidth - 8, halfHeight - 4, 5, 3);

  context.fillStyle = '#b5473f';
  context.beginPath();
  context.roundRect(-halfWidth + 2, -halfHeight + 2, ENEMY_WIDTH - 4, ENEMY_HEIGHT - 4, 6);
  context.fill();

  context.fillStyle = '#d5695f';
  context.beginPath();
  context.roundRect(-halfWidth + 5, -1, ENEMY_WIDTH - 10, halfHeight - 3, 4);
  context.fill();

  context.fillStyle = '#fdf3ea';
  context.beginPath();
  context.arc(-4, -4, 3.2, 0, Math.PI * 2);
  context.arc(3, -4, 3.2, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#1c1c28';
  context.beginPath();
  context.arc(-3, -4, 1.4, 0, Math.PI * 2);
  context.arc(4, -4, 1.4, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = '#3a1512';
  context.lineWidth = 1.4;
  context.beginPath();
  context.moveTo(-7, -8);
  context.lineTo(-1, -6);
  context.moveTo(7, -8);
  context.lineTo(1, -6);
  context.stroke();

  context.restore();
}
