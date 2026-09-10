import {
  type Level,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { chain } from '@mander/utils';
import { every, filter, first, last, map, some } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { paint } from '../canvas';
import { BACK_SHADE, materialStyle } from '../material';
import { STROKE_COLOR } from '../stroke';
import { backTileStep } from './back-tile-step';
import { solidAt } from './solid-at';

interface Fill {
  style: string;
  alpha: number;
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
  globalAlpha: number;
}

interface Stub extends Saved {
  fillRect(x: number, y: number, width: number, height: number): void;
  save(): void;
  restore(): void;
}

// styled() writes straight onto the context, so the recorder reads the colour
// and the alpha off itself as each rectangle lands
const stub = (fills: Fill[], stack: Saved[]): Stub => ({
  fillStyle: '',
  globalAlpha: 1,
  fillRect(x: number, y: number, width: number, height: number): void {
    fills.push({
      style: this.fillStyle,
      alpha: this.globalAlpha,
      x,
      y,
      width,
      height,
    });
  },
  save(): void {
    stack.push({ fillStyle: this.fillStyle, globalAlpha: this.globalAlpha });
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
        backTileStep(level(backTile), 0, 0, materialStyle(backTile)),
      ),
    )
    .thru(({ fills }) => fills)
    .value();

const covers = (fill: Fill): boolean =>
  fill.x === 0 &&
  fill.y === 0 &&
  fill.width === TILE_SIZE &&
  fill.height === TILE_SIZE;

describe('backTileStep', () => {
  it('should lay the material down solid, so the sky is not seen through the level', () => {
    const base = first(painted(TILE_BRICK));

    expect(base?.style).toBe(materialStyle(TILE_BRICK).base);
    expect(base?.alpha).toBe(1);
    expect(covers(base as Fill)).toBe(true);
  });

  it('should shade the whole tile down last, which is what sends it to the back', () => {
    const shade = last(painted(TILE_BRICK));

    expect(shade?.style).toBe(BACK_SHADE);
    expect(shade?.alpha).toBe(1);
    expect(covers(shade as Fill)).toBe(true);
  });

  it('should draw the detail faintly, so the material keeps its look at lower contrast', () => {
    const detail = filter(painted(TILE_BRICK), (fill) => !covers(fill));

    expect(detail).not.toEqual([]);
    expect(every(detail, (fill) => fill.alpha < 1)).toBe(true);
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
        (fill) => fill.style === materialStyle(TILE_DIRT).cap,
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

    expect(solidAt(covered, 0, 0)).toBe(true);
    expect(
      some(
        chain(recorder())
          .tap(({ context }) =>
            paint(
              context,
              backTileStep(covered, 0, 1, materialStyle(TILE_DIRT)),
            ),
          )
          .thru(({ fills }) => fills)
          .value(),
        (fill) => fill.style === materialStyle(TILE_DIRT).cap,
      ),
    ).toBe(false);
  });
});
