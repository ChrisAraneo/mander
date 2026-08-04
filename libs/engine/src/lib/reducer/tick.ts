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
import { filter, includes, map, some } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { overlapsSpike } from './collision/overlaps-spike';
import { advanceEnemy } from './enemy/advance-enemy';
import { createEnemies } from './enemy/create-enemies';
import { hasFaded } from './enemy/has-faded';
import { isStompingEnemy } from './enemy/is-stomping-enemy';
import { isTouchingEnemy } from './enemy/is-touching-enemy';
import { killEnemy } from './enemy/kill-enemy';
import {
  INVINCIBLE_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  STOMP_BOUNCE_VELOCITY,
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

const stompVictims = (
  previousPlayer: Player,
  player: Player,
  enemies: Enemy[],
): Enemy[] =>
  filter(
    enemies,
    (enemy) =>
      enemy.kind !== 'HORNED' &&
      isAlive(enemy) &&
      isTouchingEnemy(player, enemy) &&
      isStompingEnemy(previousPlayer, player, enemy),
  );

interface Bounced {
  player: Player;
  enemies: Enemy[];
}

// Holding the jump button through a stomp turns the little bounce into a
// full jump, exactly as if it had been thrown from the ground — the same
// velocity afterJump uses when launching a grounded jump in step-player.ts.
const bounceVelocityFor = (isJumpHeld: boolean, player: Player): number =>
  match(isJumpHeld)
    .with(true, () => -player.velocity.y.max)
    .otherwise(() => -STOMP_BOUNCE_VELOCITY);

const applyStomps = (
  previousPlayer: Player,
  player: Player,
  enemies: Enemy[],
  isJumpHeld: boolean,
): Bounced => {
  const victims = stompVictims(previousPlayer, player, enemies);
  return match(victims.length > 0)
    .with(true, (): Bounced => ({
      player: {
        ...player,
        velocity: {
          ...player.velocity,
          y: {
            ...player.velocity.y,
            current: bounceVelocityFor(isJumpHeld, player),
          },
        },
      },
      enemies: map(enemies, (enemy) =>
        includes(victims, enemy) ? killEnemy(enemy) : enemy,
      ),
    }))
    .otherwise((): Bounced => ({ player, enemies }));
};

// A horned enemy dies from any touch, in any direction — unlike a standard
// enemy it is never "cleanly" stompable, so this is checked independently of
// applyStomps. Gated on invincibility the same way resolveHarm gates being
// struck, so it only dies when the touch would actually count as a hit.
const hornedVictims = (player: Player, enemies: Enemy[]): Enemy[] =>
  match(player.timers.invincibility <= 0)
    .with(true, () =>
      filter(
        enemies,
        (enemy) =>
          enemy.kind === 'HORNED' &&
          isAlive(enemy) &&
          isTouchingEnemy(player, enemy),
      ),
    )
    .otherwise((): Enemy[] => []);

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
      // A pit-fall respawn resets the player to their spawn in one tick (see
      // stepPlayerDeath); catching that same transition here resets the
      // enemies alongside them instead of leaving that tick's physics step
      // run on their old, still-in-progress positions.
      const respawned =
        state.player.timers.death !== null && moved.timers.death === null;
      const steppedEnemies = respawned
        ? createEnemies(state.level)
        : advanceEnemies(state, moved, deltaSeconds);
      const alive = isAlive(moved);
      const { player: bounced, enemies: afterStomps } = match(alive)
        .with(true, () =>
          applyStomps(state.player, moved, steppedEnemies, state.input.isJump),
        )
        .otherwise((): Bounced => ({ player: moved, enemies: steppedEnemies }));
      const gored = match(alive)
        .with(true, () => hornedVictims(bounced, afterStomps))
        .otherwise((): Enemy[] => []);
      const { player, deaths, status } = match(alive)
        .with(true, () => resolveHarm(state, bounced, afterStomps))
        .otherwise((): Outcome => ({
          player: bounced,
          deaths: state.deaths,
          status: 'PLAYING',
        }));
      const enemies = map(afterStomps, (enemy) =>
        includes(gored, enemy) ? killEnemy(enemy) : enemy,
      );
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
