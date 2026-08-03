import {
  CHEST_ENTITY_BOX,
  type Enemy,
  findChestTile,
  findKeyTile,
  findPortalTile,
  KEY_ENTITY_BOX,
  type Player,
  PORTAL_ENTITY_BOX,
} from '@mander/model';
import { filter, map, some } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { overlapsSpike } from './collision/overlaps-spike';
import { advanceEnemy } from './enemy/advance-enemy';
import { hasFaded } from './enemy/has-faded';
import { isTouchingEnemy } from './enemy/is-touching-enemy';
import {
  INVINCIBLE_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from './player/consts';
import { isAlive } from './player/is-alive';
import { killPlayer } from './player/kill-player';
import { stepPlayer } from './player/step-player';
import { stepPlayerDeath } from './player/step-player-death';
import type { GameState } from '../state/game-state';
import type { GameStatus } from '../state/game-status';
import { hasFallenIntoPit } from './has-fallen-into-pit';
import { isNearTile } from './is-near-tile';

const INTERACT_RANGE = 12;
const PICKUP_RANGE = 4;

interface Outcome {
  player: Player;
  deaths: number;
  status: GameStatus;
}

const coolInvincibility = (player: Player, deltaSeconds: number): Player => ({
  ...player,
  timers: {
    ...player.timers,
    invincibility: Math.max(0, player.timers.invincibility - deltaSeconds),
  },
});

const advancePlayer = (state: GameState, deltaSeconds: number): Player =>
  match(state.player.timers.death)
    .with(P.number, (death) =>
      stepPlayerDeath(state.level, state.player, death, deltaSeconds),
    )
    .otherwise(() =>
      coolInvincibility(
        stepPlayer(state.level, state.player, state.input, deltaSeconds),
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

const touchesHazard = (
  state: GameState,
  player: Player,
  enemies: Enemy[],
): boolean =>
  overlapsSpike(
    state.level,
    player.position.x,
    player.position.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
  ) ||
  some(enemies, (enemy) => isAlive(enemy) && isTouchingEnemy(player, enemy));

const loseHeart = (hearts: Player['hearts']): Player['hearts'] => ({
  ...hearts,
  value: Math.max(0, hearts.value - 1),
});

const fell = (state: GameState, player: Player): Outcome => ({
  player: { ...killPlayer(player), hearts: loseHeart(player.hearts) },
  deaths: state.deaths + 1,
  status: 'PLAYING',
});

const hurt = (player: Player): Player => ({
  ...player,
  hearts: loseHeart(player.hearts),
  timers: { ...player.timers, invincibility: INVINCIBLE_SECONDS },
});

const gameOver = (state: GameState, player: Player): Outcome => ({
  player: { ...killPlayer(player), hearts: loseHeart(player.hearts) },
  deaths: state.deaths + 1,
  status: 'GAME_OVER',
});

const resolveHarm = (
  state: GameState,
  player: Player,
  enemies: Enemy[],
): Outcome =>
  match({
    fellIntoPit: hasFallenIntoPit(state.level, player),
    struck:
      player.timers.invincibility <= 0 && touchesHazard(state, player, enemies),
    survives: player.hearts.value > 1,
  })
    .with({ fellIntoPit: true, survives: true }, () => fell(state, player))
    .with({ fellIntoPit: true }, () => gameOver(state, player))
    .with({ struck: true, survives: true }, (): Outcome => ({
      player: hurt(player),
      deaths: state.deaths,
      status: 'PLAYING',
    }))
    .with({ struck: true }, () => gameOver(state, player))
    .otherwise((): Outcome => ({
      player,
      deaths: state.deaths,
      status: 'PLAYING',
    }));

export const tick = (state: GameState, deltaSeconds: number): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState => {
      const moved = advancePlayer(state, deltaSeconds);
      const enemies = advanceEnemies(state, moved, deltaSeconds);
      const { player, deaths, status } = match(isAlive(moved))
        .with(true, () => resolveHarm(state, moved, enemies))
        .otherwise((): Outcome => ({
          player: moved,
          deaths: state.deaths,
          status: 'PLAYING',
        }));
      const canReach = isAlive(player);

      return {
        ...state,
        player,
        enemies,
        deaths,
        status,
        time: state.time + deltaSeconds,
        hasKey:
          state.hasKey ||
          (canReach &&
            isNearTile(
              player,
              findKeyTile(state.level),
              KEY_ENTITY_BOX,
              PICKUP_RANGE,
            )),
        isNearChest:
          !state.isChestOpened &&
          canReach &&
          isNearTile(
            player,
            findChestTile(state.level),
            CHEST_ENTITY_BOX,
            INTERACT_RANGE,
          ),
        isNearPortal:
          canReach &&
          isNearTile(
            player,
            findPortalTile(state.level),
            PORTAL_ENTITY_BOX,
            INTERACT_RANGE,
          ),
      };
    })
    .otherwise((): GameState => state);
