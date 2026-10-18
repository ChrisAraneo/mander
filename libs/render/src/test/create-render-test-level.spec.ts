import {
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_KEY,
  TILE_SPAWN,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from './create-render-test-level';

describe('createRenderTestLevel', () => {
  it('should read every symbol through the legend when it builds the level', () => {
    const level = createRenderTestLevel(['.#', 'K@']);

    expect(level.tiles).toEqual([
      [TILE_AIR, TILE_DIRT],
      [TILE_KEY, TILE_SPAWN],
    ]);
  });

  it('should measure the level from its rows when it builds the level', () => {
    const level = createRenderTestLevel(['...', '###']);

    expect(level.width).toBe(3);
    expect(level.height).toBe(2);
  });

  it('should leave the back layer empty when no back rows are given', () => {
    const level = createRenderTestLevel(['..']);

    expect(level.backTiles).toEqual([]);
  });

  it('should read the back layer through the same legend when back rows are given', () => {
    const level = createRenderTestLevel(['..'], ['B.']);

    expect(level.backTiles).toEqual([[TILE_BRICK, TILE_AIR]]);
  });
});
