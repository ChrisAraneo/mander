import { filter, map, some } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { overlapsSpike, stepPlayer } from '../physics';
import type { Enemy, GameState, Player } from '../state';
import {
  capabilitiesFor,
  isAlive,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../state';
import { advanceEnemy } from './advance-enemy';
import { hasFaded } from './has-faded';
import { hasFallenIntoPit } from './has-fallen-into-pit';
import { isIntersecting } from './is-intersecting';
import { isTouchingEnemy } from './is-touching-enemy';
import { killPlayer } from './kill-player';
import { stepPlayerDeath } from './step-player-death';

const INTERACT_RANGE = 12;
const PICKUP_RANGE = 4;

interface Outcome {
  player: GameState['player'];
  deaths: number;
}

const advancePlayer = (state: GameState, deltaSeconds: number): Player =>
  match(state.player.dyingFor)
    .with(P.number, (dyingFor) =>
      stepPlayerDeath(state.level, state.player, dyingFor, deltaSeconds),
    )
    .otherwise(() =>
      stepPlayer(
        state.level,
        state.player,
        state.input,
        capabilitiesFor(state.inventory),
        deltaSeconds,
      ),
    );

const advanceEnemies = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): Enemy[] =>
  filter(
    map(state.enemies, (enemy) =>
      advanceEnemy(state.level, enemy, player, deltaSeconds),
    ),
    (enemy) => !hasFaded(enemy),
  );

const isLethal = (
  state: GameState,
  player: Player,
  enemies: Enemy[],
): boolean =>
  hasFallenIntoPit(state.level, player) ||
  overlapsSpike(state.level, player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT) ||
  some(enemies, (enemy) => isAlive(enemy) && isTouchingEnemy(player, enemy));

const resolveDeath = (
  state: GameState,
  player: Player,
  enemies: Enemy[],
): Outcome =>
  match(isAlive(player) && isLethal(state, player, enemies))
    .with(
      true,
      (): Outcome => ({
        player: killPlayer(player),
        deaths: state.deaths + 1,
      }),
    )
    .otherwise((): Outcome => ({ player, deaths: state.deaths }));

export const tick = (state: GameState, deltaSeconds: number): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState => {
      const moved = advancePlayer(state, deltaSeconds);
      const enemies = advanceEnemies(state, moved, deltaSeconds);
      const { player, deaths } = resolveDeath(state, moved, enemies);
      const canReach = isAlive(player);

      return {
        ...state,
        player,
        enemies,
        deaths,
        time: state.time + deltaSeconds,
        hasKey:
          state.hasKey ||
          (canReach && isIntersecting(player, state.level.key, PICKUP_RANGE)),
        isNearChest:
          !state.isChestOpened &&
          canReach &&
          isIntersecting(player, state.level.chest, INTERACT_RANGE),
        isNearPortal:
          canReach &&
          isIntersecting(player, state.level.portal, INTERACT_RANGE),
      };
    })
    .otherwise((): GameState => state);
