import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { nextFreezers } from '../../enemy/next-freezers';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { computeMovedBlizzard } from './compute-moved-blizzard';
import { patchMovedSalvo } from './patch-moved-salvo';
import type { MovedSalvo } from './types/moved-salvo';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  s: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['........', '........', 's...e...', '########']);

const DELTA_SECONDS = 0.02;

const PLAYER_X = 120;

const PLAYER_Y = 32;

const createState = (): GameState =>
  createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

const createMovedPlayer = (): Player => ({
  ...createState().player,
  position: { x: PLAYER_X, y: PLAYER_Y },
});

const createMovedSalvo = (): MovedSalvo => ({
  state: createState(),
  player: createMovedPlayer(),
  deltaSeconds: DELTA_SECONDS,
  salvo: patchMovedSalvo(createState(), createMovedPlayer(), DELTA_SECONDS),
});

describe('computeMovedBlizzard', () => {
  it('should let the freezing enemies throw their snowballs when the tick runs', () => {
    const moved = createMovedSalvo();

    const blizzard = computeMovedBlizzard(moved);

    expect(blizzard.blizzard).toEqual(
      nextFreezers(moved.salvo.enemies, moved.player, DELTA_SECONDS),
    );
  });

  it('should give no enemies and no snowballs when there are no enemies left', () => {
    const blizzard = computeMovedBlizzard({
      ...createMovedSalvo(),
      salvo: { enemies: [], cannonballs: [] },
    });

    expect(blizzard.blizzard).toEqual({ enemies: [], snowballs: [] });
  });

  it('should pass the game, the player, the frame length and the salvo on', () => {
    const moved = createMovedSalvo();

    const blizzard = computeMovedBlizzard(moved);

    expect(blizzard.state).toBe(moved.state);
    expect(blizzard.player).toBe(moved.player);
    expect(blizzard.deltaSeconds).toBe(DELTA_SECONDS);
    expect(blizzard.salvo).toBe(moved.salvo);
  });

  it('should leave the salvo it was handed untouched when the snowballs fly', () => {
    const moved = createMovedSalvo();

    computeMovedBlizzard(moved);

    expect(moved).toEqual(createMovedSalvo());
  });
});
