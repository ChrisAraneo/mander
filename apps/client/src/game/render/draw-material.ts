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

const PLANK_TONES = ['#96694f', '#8b6350', '#9d725c', '#7f5c4a', '#8e6753'];
const PLANK_TOP = 'RGBA(214, 164, 134, 0.22)';
const PLANK_BOTTOM = 'RGBA(46, 30, 22, 0.20)';
const PLANK_SEAM = 'RGBA(52, 38, 30, 0.85)';
const GRAIN_DARK = 'RGBA(74, 52, 38, 0.22)';
const GRAIN_LIGHT = 'RGBA(220, 174, 142, 0.16)';

const PLANK_HEIGHT = TILE_SIZE / 2;

const tileNoise = (a: number, b: number): number =>
  (((a * 73856093) ^ (b * 19349663)) >>> 0) % 9973;

const drawPlank = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  top: number,
  seed: number,
): void => {
  context.fillStyle = PLANK_TONES[seed % PLANK_TONES.length];
  context.fillRect(pixelX, top, TILE_SIZE, PLANK_HEIGHT);

  context.fillStyle = PLANK_TOP;
  context.fillRect(pixelX, top + 1, TILE_SIZE, 2);
  context.fillStyle = PLANK_BOTTOM;
  context.fillRect(pixelX, top + PLANK_HEIGHT - 3, TILE_SIZE, 2);

  context.fillStyle = GRAIN_DARK;
  context.fillRect(pixelX + (seed % 5), top + 3 + (seed % 3), TILE_SIZE - 6, 1);
  context.fillRect(
    pixelX + 6 + (seed % 7),
    top + PLANK_HEIGHT - 5,
    TILE_SIZE - 10,
    1,
  );
  context.fillStyle = GRAIN_LIGHT;
  context.fillRect(pixelX + 2 + (seed % 9), top + 5, TILE_SIZE - 14, 1);

  context.fillStyle = PLANK_SEAM;
  context.fillRect(pixelX, top + PLANK_HEIGHT - 1, TILE_SIZE, 1);

  const buttX = 3 + (seed % 24);
  context.fillRect(pixelX + buttX, top, 1, PLANK_HEIGHT - 1);
  context.fillStyle = GRAIN_LIGHT;
  context.fillRect(pixelX + buttX + 1, top, 1, PLANK_HEIGHT - 1);
};

const drawWood = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
): void => {
  const column = pixelX / TILE_SIZE;
  const row = pixelY / TILE_SIZE;

  forEach(range(2), (course) =>
    drawPlank(
      context,
      pixelX,
      pixelY + course * PLANK_HEIGHT,
      tileNoise(column, row * 2 + course),
    ),
  );
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
