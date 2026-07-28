import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_SIZE,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/engine';
import { forEach, range } from 'lodash-es';
import { match } from 'ts-pattern';

const JOINT = 'RGBA(0, 0, 0, 0.22)';
const HIGHLIGHT = 'RGBA(255, 255, 255, 0.12)';

const drawBrick = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
): void => {
  const courseHeight = TILE_SIZE / 4;
  context.fillStyle = JOINT;
  forEach(range(1, 4), (course) =>
    context.fillRect(pixelX, pixelY + course * courseHeight, TILE_SIZE, 1),
  );
  forEach(range(0, 4), (course) =>
    context.fillRect(
      pixelX + (course % 2 === 0 ? TILE_SIZE / 2 : TILE_SIZE / 4),
      pixelY + course * courseHeight,
      1,
      courseHeight,
    ),
  );
};

const drawStone = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
): void => {
  context.fillStyle = JOINT;
  context.fillRect(pixelX + 6, pixelY + 7, 7, 5);
  context.fillRect(pixelX + 19, pixelY + 16, 8, 6);
  context.fillStyle = HIGHLIGHT;
  context.fillRect(pixelX + 8, pixelY + 20, 6, 4);
  context.fillRect(pixelX + 20, pixelY + 6, 5, 4);
};

const drawWood = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
): void => {
  context.fillStyle = JOINT;
  forEach(range(1, 4), (plank) =>
    context.fillRect(pixelX, pixelY + plank * (TILE_SIZE / 4), TILE_SIZE, 1),
  );
  context.fillStyle = HIGHLIGHT;
  context.fillRect(pixelX + 4, pixelY + 3, TILE_SIZE - 12, 1);
  context.fillRect(pixelX + 9, pixelY + 19, TILE_SIZE - 16, 1);
};

const drawCeramic = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
): void => {
  const half = TILE_SIZE / 2;
  context.fillStyle = JOINT;
  context.fillRect(pixelX + half, pixelY, 1, TILE_SIZE);
  context.fillRect(pixelX, pixelY + half, TILE_SIZE, 1);
  context.fillStyle = HIGHLIGHT;
  context.fillRect(pixelX + 3, pixelY + 3, half - 7, 1);
  context.fillRect(pixelX + half + 3, pixelY + half + 3, half - 7, 1);
};

export const drawMaterial = (
  context: CanvasRenderingContext2D,
  tile: Tile,
  pixelX: number,
  pixelY: number,
): void =>
  match(tile)
    .with(TILE_BRICK, () => drawBrick(context, pixelX, pixelY))
    .with(TILE_STONE, () => drawStone(context, pixelX, pixelY))
    .with(TILE_WOOD, () => drawWood(context, pixelX, pixelY))
    .with(TILE_CERAMIC, () => drawCeramic(context, pixelX, pixelY))
    .otherwise(() => undefined);
