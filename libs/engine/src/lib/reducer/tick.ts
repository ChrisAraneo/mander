import { filter, map, some } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { overlapsSpike, stepPlayer } from '../physics';
import type { Enemy, GameState, Player } from '../state';
import {
  INVINCIBLE_SECONDS,
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
  player: Player;
  deaths: number;
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
});

const hurt = (player: Player): Player => ({
  ...player,
  hearts: loseHeart(player.hearts),
  timers: { ...player.timers, invincibility: INVINCIBLE_SECONDS },
});

const struckDown = (state: GameState, player: Player): Outcome => ({
  player: killPlayer(player),
  deaths: state.deaths + 1,
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
    hasHeartsLeft: player.hearts.value > 0,
  })
    .with({ fellIntoPit: true }, () => fell(state, player))
    .with(
      { struck: true, hasHeartsLeft: true },
      (): Outcome => ({
        player: hurt(player),
        deaths: state.deaths,
      }),
    )
    .with({ struck: true }, (): Outcome => struckDown(state, player))
    .otherwise((): Outcome => ({ player, deaths: state.deaths }));

export const tick = (state: GameState, deltaSeconds: number): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState => {
      const moved = advancePlayer(state, deltaSeconds);
      const enemies = advanceEnemies(state, moved, deltaSeconds);
      const { player, deaths } = match(isAlive(moved))
        .with(true, () => resolveHarm(state, moved, enemies))
        .otherwise((): Outcome => ({ player: moved, deaths: state.deaths }));
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
