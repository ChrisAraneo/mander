import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createPlayer } from '../../player/create-player';
import { filterLeftBehind } from './filter-left-behind';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel([
  '............',
  '............',
  's...........',
  '############',
]);

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: 3 } }),
  position: { x: left, y: top },
});

const NEAR_GEM = { x: 2, y: 2 };

const FAR_GEM = { x: 10, y: 2 };

describe('filterLeftBehind', () => {
  it('should keep only the gems the player is not near when the player stands on one of them', () => {
    const player = createPlayerAt(70, 60);

    const gems = filterLeftBehind(player, [NEAR_GEM, FAR_GEM]);

    expect(gems).toEqual([FAR_GEM]);
  });

  it('should keep the gem when the player is just beyond the pickup range', () => {
    const player = createPlayerAt(92, 60);

    const gems = filterLeftBehind(player, [NEAR_GEM]);

    expect(gems).toEqual([NEAR_GEM]);
  });

  it('should drop the gem when the player is just inside the pickup range', () => {
    const player = createPlayerAt(91, 60);

    const gems = filterLeftBehind(player, [NEAR_GEM]);

    expect(gems).toEqual([]);
  });

  it('should give no gems when there are no gems', () => {
    const player = createPlayerAt(70, 60);

    const gems = filterLeftBehind(player, []);

    expect(gems).toEqual([]);
  });
});
