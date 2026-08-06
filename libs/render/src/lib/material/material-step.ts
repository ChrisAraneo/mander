import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_SIZE,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/engine';
import { hslCss, parseHsl, shiftHsl } from '@mander/utils';
import { chain, map, memoize, range, size } from 'lodash-es';
import { match } from 'ts-pattern';

import { type CanvasStep, fillRect, sequence, skip, styled } from '../canvas';
import type { MaterialStyle } from './material-style';

const COURSE_HEIGHT = TILE_SIZE / 4;
const HALF_TILE = TILE_SIZE / 2;
const QUARTER_TILE = TILE_SIZE / 4;

const brickStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  sequence([
    styled({ fillStyle: style.joint }),
    sequence(
      map(range(1, 4), (course) =>
        fillRect(pixelX, pixelY + course * COURSE_HEIGHT, TILE_SIZE, 1),
      ),
    ),
    sequence(
      map(range(0, 4), (course) =>
        fillRect(
          pixelX +
            match(course % 2)
              .with(0, () => HALF_TILE)
              .otherwise(() => QUARTER_TILE),
          pixelY + course * COURSE_HEIGHT,
          1,
          COURSE_HEIGHT,
        ),
      ),
    ),
  ]);

const stoneStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  sequence([
    styled({ fillStyle: style.joint }),
    fillRect(pixelX + 6, pixelY + 7, 7, 5),
    fillRect(pixelX + 19, pixelY + 16, 8, 6),
    styled({ fillStyle: style.highlight }),
    fillRect(pixelX + 8, pixelY + 20, 6, 4),
    fillRect(pixelX + 20, pixelY + 6, 5, 4),
  ]);

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

const plankStep = (
  pixelX: number,
  top: number,
  seed: number,
  style: MaterialStyle,
): CanvasStep =>
  chain(plankTones(style.base))
    .thru((tones) => ({
      tone: tones[seed % size(tones)],
      buttX: 3 + (seed % 24),
    }))
    .thru(({ tone, buttX }) =>
      sequence([
        styled({ fillStyle: tone }),
        fillRect(pixelX, top, TILE_SIZE, PLANK_HEIGHT),
        styled({ fillStyle: PLANK_TOP }),
        fillRect(pixelX, top + 1, TILE_SIZE, 2),
        styled({ fillStyle: PLANK_BOTTOM }),
        fillRect(pixelX, top + PLANK_HEIGHT - 3, TILE_SIZE, 2),
        styled({ fillStyle: GRAIN_DARK }),
        fillRect(pixelX + (seed % 5), top + 3 + (seed % 3), TILE_SIZE - 6, 1),
        fillRect(
          pixelX + 6 + (seed % 7),
          top + PLANK_HEIGHT - 5,
          TILE_SIZE - 10,
          1,
        ),
        styled({ fillStyle: GRAIN_LIGHT }),
        fillRect(pixelX + 2 + (seed % 9), top + 5, TILE_SIZE - 14, 1),
        styled({ fillStyle: style.joint }),
        fillRect(pixelX, top + PLANK_HEIGHT - 1, TILE_SIZE, 1),
        fillRect(pixelX + buttX, top, 1, PLANK_HEIGHT - 1),
        styled({ fillStyle: GRAIN_LIGHT }),
        fillRect(pixelX + buttX + 1, top, 1, PLANK_HEIGHT - 1),
      ]),
    )
    .value();

const woodStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  chain({ column: pixelX / TILE_SIZE, row: pixelY / TILE_SIZE })
    .thru(({ column, row }) =>
      map(range(2), (course) =>
        plankStep(
          pixelX,
          pixelY + course * PLANK_HEIGHT,
          tileNoise(column, row * 2 + course),
          style,
        ),
      ),
    )
    .thru(sequence)
    .value();

const ceramicStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  sequence([
    styled({ fillStyle: style.joint }),
    fillRect(pixelX + HALF_TILE, pixelY, 1, TILE_SIZE),
    fillRect(pixelX, pixelY + HALF_TILE, TILE_SIZE, 1),
    styled({ fillStyle: style.highlight }),
    fillRect(pixelX + 3, pixelY + 3, HALF_TILE - 7, 1),
    fillRect(pixelX + HALF_TILE + 3, pixelY + HALF_TILE + 3, HALF_TILE - 7, 1),
  ]);

export const materialStep = (
  tile: Tile,
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  match(tile)
    .with(TILE_BRICK, () => brickStep(pixelX, pixelY, style))
    .with(TILE_STONE, () => stoneStep(pixelX, pixelY, style))
    .with(TILE_WOOD, () => woodStep(pixelX, pixelY, style))
    .with(TILE_CERAMIC, () => ceramicStep(pixelX, pixelY, style))
    .otherwise(() => skip);
