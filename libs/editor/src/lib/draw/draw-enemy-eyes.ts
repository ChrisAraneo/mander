export const drawEnemyEyes = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
): void => {
  context.fillStyle = '#FDF3EA';
  context.beginPath();
  context.arc(centerX - 4, centerY - 2, 2.6, 0, Math.PI * 2);
  context.arc(centerX + 4, centerY - 2, 2.6, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#1C1C28';
  context.beginPath();
  context.arc(centerX - 4, centerY - 2, 1.1, 0, Math.PI * 2);
  context.arc(centerX + 4, centerY - 2, 1.1, 0, Math.PI * 2);
  context.fill();
};
