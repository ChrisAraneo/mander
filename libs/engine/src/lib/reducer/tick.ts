import { filter, map, some } from 'lodash-es';
import { match } from 'ts-pattern';

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

interface Outcome {
  player: GameState['player'];
  deaths: number;
}

export const tick = (state: GameState, deltaSeconds: number): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState => {
      const steppedPlayer = stepPlayer(
        state.level,
        state.player,
        state.input,
        capabilitiesFor(state.inventory),
        deltaSeconds,
      );

      const enemies = filter(
        map(state.enemies, (enemy) =>
          stepEnemy(state.level, enemy, steppedPlayer, deltaSeconds),
        ),
        (enemy) =>
          !overlapsSpike(
            state.level,
            enemy.x,
            enemy.y,
            ENEMY_WIDTH,
            ENEMY_HEIGHT,
          ),
      );

      const hasDied =
        hasFallenIntoPit(state.level, steppedPlayer) ||
        overlapsSpike(
          state.level,
          steppedPlayer.x,
          steppedPlayer.y,
          PLAYER_WIDTH,
          PLAYER_HEIGHT,
        ) ||
        some(enemies, (enemy) => isTouchingEnemy(steppedPlayer, enemy));

      const { player, deaths } = match(hasDied)
        .with(
          true,
          (): Outcome => ({
            player: createPlayer(state.level),
            deaths: state.deaths + 1,
          }),
        )
        .otherwise(
          (): Outcome => ({ player: steppedPlayer, deaths: state.deaths }),
        );

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
        isNearPortal: isIntersecting(
          player,
          state.level.portal,
          INTERACT_RANGE,
        ),
      };
    })
    .otherwise((): GameState => state);
