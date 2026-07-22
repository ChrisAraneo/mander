import type { GameState } from '@mander/engine';

export function drawChest(
  context: CanvasRenderingContext2D,
  state: GameState,
): void {
  const chest = state.level.chest;

  context.save();
  if (state.nearChest) {
    context.shadowColor = '#ffd166';
    context.shadowBlur = 20;
  }

  context.fillStyle = state.chestOpened ? '#7a5a30' : '#a97b34';
  context.fillRect(chest.x, chest.y + 6, chest.width, chest.height - 6);

  context.fillStyle = state.chestOpened ? '#8a683a' : '#c3913f';
  if (state.chestOpened) {
    context.fillRect(chest.x - 2, chest.y - 6, chest.width + 4, 7);
    context.fillStyle = '#2c2418';
    context.fillRect(chest.x + 2, chest.y + 6, chest.width - 4, 5);
  } else {
    context.fillRect(chest.x - 1, chest.y, chest.width + 2, 9);
    context.fillStyle = '#e8c15c';
    context.fillRect(chest.x + chest.width / 2 - 2, chest.y + 6, 4, 7);
  }

  context.fillStyle = 'rgba(0, 0, 0, 0.25)';
  context.fillRect(chest.x + 3, chest.y + 6, 2, chest.height - 6);
  context.fillRect(chest.x + chest.width - 5, chest.y + 6, 2, chest.height - 6);

  context.restore();
}
