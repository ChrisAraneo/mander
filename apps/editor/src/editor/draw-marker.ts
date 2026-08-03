import { TILE_SIZE } from '@mander/model';
import { STRUCTURE_END } from '@mander/structures';

const START_COLOUR = '#7ea653';
const END_COLOUR = '#e0b83a';

export const drawMarker = (
  context: CanvasRenderingContext2D,
  cell: number,
  row: number,
  column: number,
): void => {
  const colour = cell === STRUCTURE_END ? END_COLOUR : START_COLOUR;
  const pixelX = column * TILE_SIZE;
  const pixelY = row * TILE_SIZE;

  context.save();
  context.globalAlpha = 0.22;
  context.fillStyle = colour;
  context.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);

  context.globalAlpha = 1;
  context.strokeStyle = colour;
  context.lineWidth = 2;
  context.strokeRect(pixelX + 1, pixelY + 1, TILE_SIZE - 2, TILE_SIZE - 2);

  context.fillStyle = colour;
  context.font = `bold ${TILE_SIZE / 2}px 'Cascadia Mono', Consolas, monospace`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(
    cell === STRUCTURE_END ? 'E' : 'S',
    pixelX + TILE_SIZE / 2,
    pixelY + TILE_SIZE / 2 + 1,
  );
  context.restore();
};
