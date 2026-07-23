import { filter, map, some } from 'lodash-es';

import { overlapsSpike, stepEnemy, stepPlayer } from '../physics';
import type { GameState } from '../state';
import {
  capabilitiesFor,
  createPlayer,
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../state';
import { hasFallenIntoPit } from './has-fallen-into-pit';
import { isIntersecting } from './is-intersecting';
import { isTouchingEnemy } from './is-touching-enemy';

const INTERACT_RANGE = 12;
const PICKUP_RANGE = 4;

export const tick = (state: GameState, deltaSeconds: number): GameState => {
  if (state.status !== 'playing') return state;

  let player = stepPlayer(
    state.level,
    state.player,
    state.input,
    capabilitiesFor(state.inventory),
    deltaSeconds,
  );

  const enemies = filter(
    map(state.enemies, (enemy) =>
      stepEnemy(state.level, enemy, player, deltaSeconds),
    ),
    (enemy) =>
      !overlapsSpike(state.level, enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT),
  );

  let deaths = state.deaths;
  if (
    hasFallenIntoPit(state.level, player) ||
    overlapsSpike(
      state.level,
      player.x,
      player.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
    ) ||
    some(enemies, (enemy) => isTouchingEnemy(player, enemy))
  ) {
    player = createPlayer(state.level);
    deaths += 1;
  }

  return {
    ...state,
    player,
    enemies,
    deaths,
    time: state.time + deltaSeconds,
    hasKey:
      state.hasKey || isIntersecting(player, state.level.key, PICKUP_RANGE),
    isNearChest:
      !state.isChestOpened &&
      isIntersecting(player, state.level.chest, INTERACT_RANGE),
    isNearPortal: isIntersecting(player, state.level.portal, INTERACT_RANGE),
  };
};
