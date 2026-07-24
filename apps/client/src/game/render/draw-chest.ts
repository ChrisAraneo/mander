import type { GameState } from '@mander/engine';
import type { Rect } from '@mander/generator';

const drawChestLid = (
  context: CanvasRenderingContext2D,
  chest: Rect,
  isOpen: boolean,
): void => {
  context.fillStyle = isOpen ? '#8A683A' : '#C3913F';
  if (isOpen) {
    context.fillRect(chest.x - 2, chest.y - 6, chest.width + 4, 7);
    context.fillStyle = '#2C2418';
    context.fillRect(chest.x + 2, chest.y + 6, chest.width - 4, 5);
  } else {
    context.fillRect(chest.x - 1, chest.y, chest.width + 2, 9);
    context.fillStyle = '#E8C15C';
    context.fillRect(chest.x + chest.width / 2 - 2, chest.y + 6, 4, 7);
  }
};

export const drawChest = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void => {
  const chest = state.level.chest;

  context.save();
  if (state.isNearChest) {
    context.shadowColor = '#FFD166';
    context.shadowBlur = 20;
  }

  context.fillStyle = state.isChestOpened ? '#7A5A30' : '#A97B34';
  context.fillRect(chest.x, chest.y + 6, chest.width, chest.height - 6);

  drawChestLid(context, chest, state.isChestOpened);

  context.fillStyle = 'RGBA(0, 0, 0, 0.25)';
  context.fillRect(chest.x + 3, chest.y + 6, 2, chest.height - 6);
  context.fillRect(chest.x + chest.width - 5, chest.y + 6, 2, chest.height - 6);

  context.restore();
};
