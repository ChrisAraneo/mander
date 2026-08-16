import {
  type Cannonball,
  CHEST_ENTITY_BOX,
  DIAMOND_ENTITY_BOX,
  type Enemy,
  findChestTile,
  findKeyTile,
  findPortalTile,
  KEY_ENTITY_BOX,
  type Player,
  PORTAL_ENTITY_BOX,
} from '@mander/model';
import type { Point } from '@mander/utils';
import { filter, includes, map, size, some } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { advanceBullets } from '../bullet/advance-bullets';
import { resolveVolley } from '../bullet/resolve-volley';
import { advanceCannonballs } from '../cannon/advance-cannonballs';
import { advanceCannons } from '../cannon/advance-cannons';
import { createCannons } from '../cannon/create-cannons';
import { strikingCannonballs } from '../cannon/striking-cannonballs';
import type { Barrage } from '../cannon/types/barrage';
import { advanceEnemy } from '../enemy/advance-enemy';
import { createEnemies } from '../enemy/create-enemies';
import { hasFaded } from '../enemy/has-faded';
import { isStompingEnemy } from '../enemy/is-stomping-enemy';
import { isTouchingEnemy } from '../enemy/is-touching-enemy';
import { killEnemy } from '../enemy/kill-enemy';
import { advanceFireballs } from '../fireball/advance-fireballs';
import { advancePlayerFireballs } from '../fireball/advance-player-fireballs';
import { burnEnemies } from '../fireball/burn-enemies';
import { createFireballs } from '../fireball/create-fireballs';
import { createPlayerFireballs } from '../fireball/create-player-fireballs';
import { isBurning } from '../fireball/is-burning';
import {
  HURT_FLASH_SECONDS,
  HURT_INVINCIBLE_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  STOMP_BOUNCE_VELOCITY,
} from '../player/consts';
import { isAlive } from '../player/is-alive';
import { killPlayer } from '../player/kill-player';
import { stepPlayer } from '../player/step-player';
import { stepPlayerDeath } from '../player/step-player-death';
import { DIAMOND_SCORE } from '../score/consts';
import { overlapsSpikeFacing } from '../spike/overlaps-spike';
import { bitingSpikes } from '../ward/biting-spikes';
import type { GameState } from '../../state/types/game-state';
import { hasFallenIntoPit } from './has-fallen-into-pit';
import { isNearTile } from './is-near-tile';
import type { Bounced } from './types/bounced';
import type { Outcome } from './types/outcome';

const { number } = P;

const INTERACT_RANGE = 12;
const PICKUP_RANGE = 4;

const coolTimers = (player: Player, deltaSeconds: number): Player => ({
  ...player,
  timers: {
    ...player.timers,
    invincibility: Math.max(0, player.timers.invincibility - deltaSeconds),
    star: Math.max(0, player.timers.star - deltaSeconds),
    hurt: Math.max(0, player.timers.hurt - deltaSeconds),
  },
});

const advancePlayer = (state: GameState, deltaSeconds: number): Player =>
  match(state.player.timers.death)
    .with(number, (death) =>
      stepPlayerDeath(state.level, state.player, death, deltaSeconds),
    )
    .otherwise(() =>
      coolTimers(
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

const advanceBarrage = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): Barrage => {
  const fired = advanceCannons(state.cannons, player, deltaSeconds);

  return {
    cannons: fired.cannons,
    cannonballs: [
      ...advanceCannonballs(state.level, state.cannonballs, deltaSeconds),
      ...fired.cannonballs,
    ],
  };
};

const reloadBarrage = (level: GameState['level']): Barrage => ({
  cannons: createCannons(level),
  cannonballs: [],
});

const stompVictims = (
  previousPlayer: Player,
  player: Player,
  enemies: Enemy[],
  deltaSeconds: number,
): Enemy[] =>
  filter(
    enemies,
    (enemy) =>
      enemy.kind !== 'HORNED' &&
      isAlive(enemy) &&
      isStompingEnemy(previousPlayer, player, enemy, deltaSeconds),
  );

const bounceVelocityFor = (isJumpHeld: boolean, player: Player): number =>
  match(isJumpHeld)
    .with(true, () => -player.velocity.y.max)
    .otherwise(() => -STOMP_BOUNCE_VELOCITY);

const applyStomps = (
  previousPlayer: Player,
  player: Player,
  enemies: Enemy[],
  isJumpHeld: boolean,
  deltaSeconds: number,
): Bounced => {
  const victims = stompVictims(previousPlayer, player, enemies, deltaSeconds);
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
  hits: Cannonball[],
  isBurned: boolean,
): boolean =>
  overlapsSpikeFacing(
    state.level,
    player.position.x,
    player.position.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    bitingSpikes(state.inventory),
  ) ||
  some(enemies, (enemy) => isAlive(enemy) && isTouchingEnemy(player, enemy)) ||
  size(hits) > 0 ||
  isBurned;

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
  timers: {
    ...player.timers,
    invincibility: HURT_INVINCIBLE_SECONDS,
    hurt: HURT_FLASH_SECONDS,
  },
});

const gameOver = (state: GameState, player: Player): Outcome => ({
  player: { ...killPlayer(player), hearts: loseHeart(player.hearts) },
  deaths: state.deaths + 1,
  status: 'GAME_OVER',
});

const leftBehind = (player: Player, diamonds: Point[]): Point[] =>
  filter(
    diamonds,
    (diamond) => !isNearTile(player, diamond, DIAMOND_ENTITY_BOX, PICKUP_RANGE),
  );

const resolveHarm = (
  state: GameState,
  player: Player,
  enemies: Enemy[],
  hits: Cannonball[],
  isBurned: boolean,
): Outcome =>
  match({
    fellIntoPit: hasFallenIntoPit(state.level, player),
    struck:
      player.timers.invincibility <= 0 &&
      touchesHazard(state, player, enemies, hits, isBurned),
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
      const respawned =
        state.player.timers.death !== null && moved.timers.death === null;
      const steppedEnemies = respawned
        ? createEnemies(state.level)
        : advanceEnemies(state, moved, deltaSeconds);
      const { cannons, cannonballs: flying } = respawned
        ? reloadBarrage(state.level)
        : advanceBarrage(state, moved, deltaSeconds);
      const fireballs = respawned
        ? createFireballs(state.level)
        : advanceFireballs(state.fireballs, deltaSeconds);
      const playerFireballs = respawned
        ? createPlayerFireballs(state.inventory, moved)
        : advancePlayerFireballs(state.playerFireballs, moved, deltaSeconds);
      const flyingBullets = respawned
        ? []
        : advanceBullets(state.level, state.bullets, deltaSeconds);
      const alive = isAlive(moved);
      const { player: bounced, enemies: afterStomps } = match(alive)
        .with(true, () =>
          applyStomps(
            state.player,
            moved,
            steppedEnemies,
            state.input.isJump,
            deltaSeconds,
          ),
        )
        .otherwise((): Bounced => ({ player: moved, enemies: steppedEnemies }));
      const gored = match(alive)
        .with(true, () => hornedVictims(bounced, afterStomps))
        .otherwise((): Enemy[] => []);
      const hits = match(alive)
        .with(true, () => strikingCannonballs(bounced, flying))
        .otherwise((): Cannonball[] => []);
      const isBurned = alive && isBurning(bounced, fireballs);
      const { player, deaths, status } = match(alive)
        .with(true, () =>
          resolveHarm(state, bounced, afterStomps, hits, isBurned),
        )
        .otherwise((): Outcome => ({
          player: bounced,
          deaths: state.deaths,
          status: 'PLAYING',
        }));
      const { bullets, enemies: shot } = resolveVolley(
        flyingBullets,
        map(afterStomps, (enemy) =>
          includes(gored, enemy) ? killEnemy(enemy) : enemy,
        ),
      );
      const enemies = match(alive)
        .with(true, () => burnEnemies(playerFireballs, shot))
        .otherwise(() => shot);
      const cannonballs = filter(
        flying,
        (cannonball) => !includes(hits, cannonball),
      );
      const canReach = isAlive(player);
      const diamonds = match(canReach)
        .with(true, () => leftBehind(player, state.diamonds))
        .otherwise((): Point[] => state.diamonds);

      return {
        ...state,
        player,
        enemies,
        cannons,
        cannonballs,
        fireballs,
        playerFireballs,
        bullets,
        diamonds,
        deaths,
        status,
        time: state.time + deltaSeconds,
        score:
          state.score + (size(state.diamonds) - size(diamonds)) * DIAMOND_SCORE,
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
