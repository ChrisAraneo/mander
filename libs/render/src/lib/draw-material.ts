import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_SIZE,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/engine';
import { hslCss, parseHsl, shiftHsl } from '@mander/utils';
import { forEach, map, memoize, range } from 'lodash-es';
import { match } from 'ts-pattern';

import type { MaterialStyle } from './material-style';

const drawBrick = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): void => {
  const courseHeight = TILE_SIZE / 4;
  context.fillStyle = style.joint;
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
  style: MaterialStyle,
): void => {
  context.fillStyle = style.joint;
  context.fillRect(pixelX + 6, pixelY + 7, 7, 5);
  context.fillRect(pixelX + 19, pixelY + 16, 8, 6);
  context.fillStyle = style.highlight;
  context.fillRect(pixelX + 8, pixelY + 20, 6, 4);
  context.fillRect(pixelX + 20, pixelY + 6, 5, 4);
};

// The planks are shades of the material's own body, so wood follows the level
// palette like every other block. Everything laid over them is colourless.
const PLANK_LIGHTNESS = [0, -2, 4, -6, -1];
const PLANK_TOP = 'RGBA(255, 255, 255, 0.18)';
const PLANK_BOTTOM = 'RGBA(0, 0, 0, 0.20)';
const GRAIN_DARK = 'RGBA(0, 0, 0, 0.18)';
const GRAIN_LIGHT = 'RGBA(255, 255, 255, 0.14)';

const PLANK_HEIGHT = TILE_SIZE / 2;

const plankTones = memoize((base: string): string[] =>
  match(parseHsl(base))
    .with(undefined, () => map(PLANK_LIGHTNESS, () => base))
    .otherwise((color) =>
      map(PLANK_LIGHTNESS, (lightness) =>
        hslCss(shiftHsl(color, { lightness })),
      ),
    ),
);

const tileNoise = (a: number, b: number): number =>
  (((a * 73856093) ^ (b * 19349663)) >>> 0) % 9973;

const drawPlank = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  top: number,
  seed: number,
  style: MaterialStyle,
): void => {
  const tones = plankTones(style.base);
  context.fillStyle = tones[seed % tones.length];
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

  context.fillStyle = style.joint;
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
  style: MaterialStyle,
): void => {
  const column = pixelX / TILE_SIZE;
  const row = pixelY / TILE_SIZE;

  forEach(range(2), (course) =>
    drawPlank(
      context,
      pixelX,
      pixelY + course * PLANK_HEIGHT,
      tileNoise(column, row * 2 + course),
      style,
    ),
  );
};

const drawCeramic = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): void => {
  const half = TILE_SIZE / 2;
  context.fillStyle = style.joint;
  context.fillRect(pixelX + half, pixelY, 1, TILE_SIZE);
  context.fillRect(pixelX, pixelY + half, TILE_SIZE, 1);
  context.fillStyle = style.highlight;
  context.fillRect(pixelX + 3, pixelY + 3, half - 7, 1);
  context.fillRect(pixelX + half + 3, pixelY + half + 3, half - 7, 1);
};

export const drawMaterial = (
  context: CanvasRenderingContext2D,
  tile: Tile,
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): void =>
  match(tile)
    .with(TILE_BRICK, () => drawBrick(context, pixelX, pixelY, style))
    .with(TILE_STONE, () => drawStone(context, pixelX, pixelY, style))
    .with(TILE_WOOD, () => drawWood(context, pixelX, pixelY, style))
    .with(TILE_CERAMIC, () => drawCeramic(context, pixelX, pixelY, style))
    .otherwise(() => undefined);
