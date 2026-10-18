import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { flatMap, head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createStandingPlayer } from './create-standing-player';
import { MOVE_PLANS } from './move-plans';
import { runMovePlan } from './run-move-plan';
import { runMovePlans } from './run-move-plans';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel([
  '..........',
  '..........',
  '..........',
  '..........',
  '##########',
]);

const LEFT_PLAYER = createStandingPlayer(40, 80);

const RIGHT_PLAYER = createStandingPlayer(200, 80);

describe('runMovePlans', () => {
  it('should give the states of every move plan from every player in order when the frontier has two players', () => {
    const states = runMovePlans({ level: LEVEL }, [LEFT_PLAYER, RIGHT_PLAYER]);

    expect(states).toEqual([
      ...flatMap(MOVE_PLANS, (plan) => runMovePlan(LEVEL, plan, LEFT_PLAYER)),
      ...flatMap(MOVE_PLANS, (plan) => runMovePlan(LEVEL, plan, RIGHT_PLAYER)),
    ]);
  });

  it('should give no states when the frontier is empty', () => {
    const states = runMovePlans({ level: LEVEL }, []);

    expect(states).toEqual([]);
  });
});
