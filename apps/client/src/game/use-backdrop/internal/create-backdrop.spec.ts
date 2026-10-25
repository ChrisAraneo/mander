import type { GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import {
  computeMidLevelFocus,
  type Palette,
  type RenderedWorld,
} from '@mander/render';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { BACKDROP_LEVEL } from '../consts';
import { createBackdrop } from './create-backdrop';

const PALETTE = { kind: 'PALETTE' } as unknown as Palette;

const createLevel = (seed: string): GameLevel => ({
  seed,
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
});

const createWorldFixture = (count: number): RenderedWorld =>
  ({
    name: 'ABC',
    levels: times(count, (index) => createLevel(`L${index}`)),
    score: 0,
    palette: PALETTE,
  }) as unknown as RenderedWorld;

describe('createBackdrop', () => {
  it('should show the backdrop level when the world is long enough', () => {
    const world = createWorldFixture(6);

    const backdrop = createBackdrop(world, ref(null));

    expect(backdrop.idle.level).toBe(world.levels[BACKDROP_LEVEL - 1]);
    expect(backdrop.idle.levelIndex).toBe(BACKDROP_LEVEL - 1);
  });

  it('should show the last level when the world is shorter than that', () => {
    const world = createWorldFixture(2);

    expect(createBackdrop(world, ref(null)).idle.level).toBe(world.levels[1]);
  });

  it('should look at the middle of the level it shows', () => {
    const world = createWorldFixture(6);

    expect(createBackdrop(world, ref(null)).focus).toEqual(
      computeMidLevelFocus(world.levels[BACKDROP_LEVEL - 1]),
    );
  });

  it('should start on the idle scene with nothing running', () => {
    const backdrop = createBackdrop(createWorldFixture(1), ref(null));

    expect(backdrop.frame.value.previous).toBe(backdrop.idle);
    expect(backdrop.frame.value.current).toBe(backdrop.idle);
    expect(backdrop.subscription.value).toBeNull();
    expect(backdrop.cell.context.value).toBeNull();
  });

  it('should keep the canvas and the palette it is given', () => {
    const canvas = ref(null);

    const backdrop = createBackdrop(createWorldFixture(1), canvas);

    expect(backdrop.cell.canvas).toBe(canvas);
    expect(backdrop.palette).toBe(PALETTE);
  });
});
