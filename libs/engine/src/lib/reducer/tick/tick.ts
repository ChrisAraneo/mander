import {
  type Cannonball,
  CHEST_ENTITY_BOX,
  GEM_ENTITY_BOX,
  type Enemy,
  type EnemyKind,
  type FallingSpike,
  findChestTile,
  findKeyTile,
  findPortalTile,
  KEY_ENTITY_BOX,
  type Player,
  PORTAL_ENTITY_BOX,
} from '@mander/model';
import type { Point } from '@mander/utils';
import { filter, includes, isNull, map, size, some } from 'lodash-es';
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
import { crushEnemies } from '../enemy/crush-enemies';
import { hasFaded } from '../enemy/has-faded';
import { isStompingEnemy } from '../enemy/is-stomping-enemy';
import { isTouchingEnemy } from '../enemy/is-touching-enemy';
import { killEnemy } from '../enemy/kill-enemy';
import { advanceFallingSpikes } from '../falling-spike/advance-falling-spikes';
import { createFallingSpikes } from '../falling-spike/create-falling-spikes';
import { isTouchingFallingSpike } from '../falling-spike/is-touching-falling-spike';
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
import { GEM_SCORE } from '../score/consts';
import { isOverlappingSpikeFacing } from '../spike/is-overlapping-spike';
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

const STOMP_PROOF_KINDS: readonly EnemyKind[] = Object.freeze([
  'HORNED',
  'BEARTRAP',
]);

const stompVictims = (
  previousPlayer: Player,
  player: Player,
  enemies: Enemy[],
  deltaSeconds: number,
): Enemy[] =>
  filter(
    enemies,
    (enemy) =>
      !includes(STOMP_PROOF_KINDS, enemy.kind) &&
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

const isTouchingAnyFallingSpike = (
  state: GameState,
  player: Player,
  fallingSpikes: FallingSpike[],
): boolean =>
  includes(bitingSpikes(state.inventory), 'CEILING') &&
  some(fallingSpikes, (spike) => isTouchingFallingSpike(player, spike));

const isTouchingHazard = (
  state: GameState,
  player: Player,
  enemies: Enemy[],
  fallingSpikes: FallingSpike[],
  hits: Cannonball[],
  isBurned: boolean,
): boolean =>
  isOverlappingSpikeFacing(
    state.level,
    player.position.x,
    player.position.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    bitingSpikes(state.inventory),
  ) ||
  isTouchingAnyFallingSpike(state, player, fallingSpikes) ||
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

const leftBehind = (player: Player, gems: Point[]): Point[] =>
  filter(gems, (gem) => !isNearTile(player, gem, GEM_ENTITY_BOX, PICKUP_RANGE));

const resolveHarm = (
  state: GameState,
  player: Player,
  enemies: Enemy[],
  fallingSpikes: FallingSpike[],
  hits: Cannonball[],
  isBurned: boolean,
): Outcome =>
  match({
    hasFallenIntoPit: hasFallenIntoPit(state.level, player),
    isStruck:
      player.timers.invincibility <= 0 &&
      isTouchingHazard(state, player, enemies, fallingSpikes, hits, isBurned),
    canSurvive: player.hearts.value > 1,
  })
    .with({ hasFallenIntoPit: true, canSurvive: true }, () =>
      fell(state, player),
    )
    .with({ hasFallenIntoPit: true }, () => gameOver(state, player))
    .with({ isStruck: true, canSurvive: true }, (): Outcome => ({
      player: hurt(player),
      deaths: state.deaths,
      status: 'PLAYING',
    }))
    .with({ isStruck: true }, () => gameOver(state, player))
    .otherwise((): Outcome => ({
      player,
      deaths: state.deaths,
      status: 'PLAYING',
    }));

export const tick = (state: GameState, deltaSeconds: number): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState => {
      const moved = advancePlayer(state, deltaSeconds);
      const hasRespawned =
        !isNull(state.player.timers.death) && isNull(moved.timers.death);
      const steppedEnemies = hasRespawned
        ? createEnemies(state.level)
        : advanceEnemies(state, moved, deltaSeconds);
      const { cannons, cannonballs: flying } = hasRespawned
        ? reloadBarrage(state.level)
        : advanceBarrage(state, moved, deltaSeconds);
      const fallingSpikes = hasRespawned
        ? createFallingSpikes(state.level)
        : advanceFallingSpikes(
            state.level,
            state.fallingSpikes,
            moved,
            deltaSeconds,
          );
      const fireballs = hasRespawned
        ? createFireballs(state.level)
        : advanceFireballs(state.fireballs, deltaSeconds);
      const playerFireballs = hasRespawned
        ? createPlayerFireballs(state.inventory, moved, state.isMoonMagnetOn)
        : advancePlayerFireballs(state.playerFireballs, moved, deltaSeconds);
      const flyingBullets = hasRespawned
        ? []
        : advanceBullets(state.level, state.bullets, deltaSeconds);
      const isPlayerAlive = isAlive(moved);
      const { player: bounced, enemies: afterStomps } = match(isPlayerAlive)
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
      const gored = match(isPlayerAlive)
        .with(true, () => hornedVictims(bounced, afterStomps))
        .otherwise((): Enemy[] => []);
      const hits = match(isPlayerAlive)
        .with(true, () => strikingCannonballs(bounced, flying))
        .otherwise((): Cannonball[] => []);
      const isBurned = isPlayerAlive && isBurning(bounced, fireballs);
      const { player, deaths, status } = match(isPlayerAlive)
        .with(true, () =>
          resolveHarm(
            state,
            bounced,
            afterStomps,
            fallingSpikes,
            hits,
            isBurned,
          ),
        )
        .otherwise((): Outcome => ({
          player: bounced,
          deaths: state.deaths,
          status: 'PLAYING',
        }));
      const {
        bullets,
        enemies: shot,
        fallingSpikes: unshot,
        level,
      } = resolveVolley(
        flyingBullets,
        map(afterStomps, (enemy) =>
          includes(gored, enemy) ? killEnemy(enemy) : enemy,
        ),
        fallingSpikes,
        state.level,
      );
      const enemies = crushEnemies(
        match(isPlayerAlive)
          .with(true, () => burnEnemies(playerFireballs, shot, deltaSeconds))
          .otherwise(() => shot),
      );
      const cannonballs = filter(
        flying,
        (cannonball) => !includes(hits, cannonball),
      );
      const canReach = isAlive(player);
      const gems = match(canReach)
        .with(true, () => leftBehind(player, state.gems))
        .otherwise((): Point[] => state.gems);

      return {
        ...state,
        level,
        player,
        enemies,
        cannons,
        cannonballs,
        fallingSpikes: unshot,
        fireballs,
        playerFireballs,
        bullets,
        gems,
        deaths,
        status,
        time: state.time + deltaSeconds,
        score: state.score + (size(state.gems) - size(gems)) * GEM_SCORE,
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
