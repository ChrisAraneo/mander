import {
  CHEST_ENTITY_BOX,
  findChestTile,
  type GameState,
  toEntityRectangle,
} from '@mander/engine';
import type { Rectangle } from '@mander/utils';
import { match } from 'ts-pattern';

import { strokeOutline } from './stroke';

const drawChestLid = (
  context: CanvasRenderingContext2D,
  chest: Rectangle,
  isOpen: boolean,
): void => {
  context.beginPath();
  match(isOpen)
    .with(true, () =>
      context.rect(chest.x - 2, chest.y - 6, chest.width + 4, 7),
    )
    .otherwise(() => context.rect(chest.x - 1, chest.y, chest.width + 2, 9));
  strokeOutline(context);
  context.fillStyle = match(isOpen)
    .with(true, () => '#8A683A')
    .otherwise(() => '#C3913F');
  context.fill();

  match(isOpen)
    .with(true, () => {
      context.fillStyle = '#2C2418';
      context.fillRect(chest.x + 2, chest.y + 6, chest.width - 4, 5);
    })
    .otherwise(() => {
      context.fillStyle = '#E8C15C';
      context.fillRect(chest.x + chest.width / 2 - 2, chest.y + 6, 4, 7);
    });
};

export const drawChest = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void => {
  const tile = findChestTile(state.level);
  if (tile === null) return;

  const chest = toEntityRectangle(tile, CHEST_ENTITY_BOX);

  context.save();
  match(state.isNearChest)
    .with(true, () => {
      context.shadowColor = '#FFD166';
      context.shadowBlur = 20;
    })
    .otherwise(() => undefined);

  context.beginPath();
  context.rect(chest.x, chest.y + 6, chest.width, chest.height - 6);
  strokeOutline(context);
  context.fillStyle = match(state.isChestOpened)
    .with(true, () => '#7A5A30')
    .otherwise(() => '#A97B34');
  context.fill();

  drawChestLid(context, chest, state.isChestOpened);

  context.fillStyle = 'RGBA(0, 0, 0, 0.25)';
  context.fillRect(chest.x + 3, chest.y + 6, 2, chest.height - 6);
  context.fillRect(chest.x + chest.width - 5, chest.y + 6, 2, chest.height - 6);

  context.restore();
};
