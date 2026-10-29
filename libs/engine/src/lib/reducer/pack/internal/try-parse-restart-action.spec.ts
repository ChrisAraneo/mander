import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { tryParseRestartAction } from './try-parse-restart-action';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
};

const createLevel = (seed: string, rows: string[]): GameLevel => ({
  seed,
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVELS: GameLevel[] = [
  createLevel('ONE', ['...', '###']),
  createLevel('TWO', ['....', '####']),
];

describe('tryParseRestartAction', () => {
  it('should restart on the first level when there is at least one level', () => {
    const action = tryParseRestartAction(LEVELS);

    expect(action).toEqual({ type: 'RESTART', level: LEVELS[0] });
  });

  it('should restart on the only level when there is just one level', () => {
    const action = tryParseRestartAction([LEVELS[1]]);

    expect(action).toEqual({ type: 'RESTART', level: LEVELS[1] });
  });

  it('should give nothing when there are no levels', () => {
    const action = tryParseRestartAction([]);

    expect(action).toBeUndefined();
  });
});
