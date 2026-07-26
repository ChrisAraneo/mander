import {
  PLAYER_WIDTH_TILES,
  PLAYER_HEIGHT_TILES,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { CELL, COLORS } from '../../constants';

export const drawPlayerGhost = (context: CanvasRenderingContext2D): void => {
  const width = PLAYER_WIDTH_TILES * CELL;
  const height = PLAYER_HEIGHT_TILES * CELL;
  const pixelX = (CELL - width) / 2;
  const pixelY = (STRUCTURE_HEIGHT - 1) * CELL - height;

  context.fillStyle = COLORS.player;
  context.fillRect(pixelX, pixelY, width, height);
  context.strokeStyle = COLORS.playerOutline;
  context.lineWidth = 1;
  context.strokeRect(pixelX + 0.5, pixelY + 0.5, width - 1, height - 1);
};
