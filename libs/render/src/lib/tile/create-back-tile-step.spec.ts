import {
  type Level,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { chain } from '@mander/utils';
import { first, last, map, some } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { paint } from '../canvas';
import { BACK_SHADE, getMaterialStyle } from '../material';
import { STROKE_COLOR } from '../stroke';
import { createBackTileStep } from './create-back-tile-step';
import { isSolidAt } from './is-solid-at';

interface Fill {
  style: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Recorder {
  fills: Fill[];
  context: CanvasRenderingContext2D;
}

interface Saved {
  fillStyle: string;
}

interface Stub extends Saved {
  fillRect(x: number, y: number, width: number, height: number): void;
  save(): void;
  restore(): void;
}

// styled() writes straight onto the context, so the recorder reads the colour
// off itself as each rectangle lands
const stub = (fills: Fill[], stack: Saved[]): Stub => ({
  fillStyle: '',
  fillRect(x: number, y: number, width: number, height: number): void {
    fills.push({ style: this.fillStyle, x, y, width, height });
  },
  save(): void {
    stack.push({ fillStyle: this.fillStyle });
  },
  restore(): void {
    Object.assign(this, stack.pop());
  },
});

const recorder = (): Recorder =>
  chain({ fills: [] as Fill[], stack: [] as Saved[] })
    .thru(({ fills, stack }) => ({
      fills,
      context: stub(fills, stack) as unknown as CanvasRenderingContext2D,
    }))
    .value();

const level = (backTile: number): Level => ({
  seed: '',
  width: 1,
  height: 1,
  tiles: [[TILE_AIR]],
  backTiles: [[backTile]],
  chestItems: [],
});

const painted = (backTile: number): Fill[] =>
  chain(recorder())
    .tap(({ context }) =>
      paint(
        context,
        createBackTileStep(level(backTile), 0, 0, getMaterialStyle(backTile)),
      ),
    )
    .thru(({ fills }) => fills)
    .value();

const isCovering = (fill: Fill): boolean =>
  fill.x === 0 &&
  fill.y === 0 &&
  fill.width === TILE_SIZE &&
  fill.height === TILE_SIZE;

describe('createBackTileStep', () => {
  it('should lay the material down solid, so the sky is not seen through the level', () => {
    const base = first(painted(TILE_BRICK));

    expect(base?.style).toBe(getMaterialStyle(TILE_BRICK).base);
    expect(isCovering(base as Fill)).toBe(true);
  });

  it('should shade the whole tile down last, which is what sends it to the back', () => {
    const shade = last(painted(TILE_BRICK));

    expect(shade?.style).toBe(BACK_SHADE);
    expect(isCovering(shade as Fill)).toBe(true);
  });

  it('should draw no border, which belongs to the blocks the player can touch', () => {
    expect(
      some(
        map([TILE_BRICK, TILE_DIRT], painted).flat(),
        (fill) => fill.style === STROKE_COLOR,
      ),
    ).toBe(false);
  });

  it('should cap a background block that nothing stands over', () => {
    expect(
      some(
        painted(TILE_DIRT),
        (fill) => fill.style === getMaterialStyle(TILE_DIRT).cap,
      ),
    ).toBe(true);
  });

  it('should leave the cap off where the front layer stands over it', () => {
    const covered: Level = {
      seed: '',
      width: 1,
      height: 2,
      tiles: [[TILE_BRICK], [TILE_AIR]],
      backTiles: [[TILE_AIR], [TILE_DIRT]],
      chestItems: [],
    };

    expect(isSolidAt(covered, 0, 0)).toBe(true);
    expect(
      some(
        chain(recorder())
          .tap(({ context }) =>
            paint(
              context,
              createBackTileStep(covered, 0, 1, getMaterialStyle(TILE_DIRT)),
            ),
          )
          .thru(({ fills }) => fills)
          .value(),
        (fill) => fill.style === getMaterialStyle(TILE_DIRT).cap,
      ),
    ).toBe(false);
  });
});
