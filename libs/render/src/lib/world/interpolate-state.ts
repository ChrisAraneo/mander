import type { GameState } from '@mander/engine';
import { type Enemy, type Player, TILE_SIZE } from '@mander/model';
import type { Point } from '@mander/utils';
import { find, map } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { nonNullable } = P;

/**
 * Further than this in one step is a teleport - a respawn, or a portal - and
 * sliding across it would look worse than the cut.
 */
const SNAP_DISTANCE = TILE_SIZE * 2;

const lerp = (from: number, to: number, alpha: number): number =>
  from + (to - from) * alpha;

const lerpPoint = (from: Point, to: Point, alpha: number): Point =>
  match(Math.hypot(to.x - from.x, to.y - from.y) > SNAP_DISTANCE)
    .with(true, () => to)
    .otherwise((): Point => ({
      x: lerp(from.x, to.x, alpha),
      y: lerp(from.y, to.y, alpha),
    }));

const tweenPlayer = (
  previous: Player,
  current: Player,
  alpha: number,
): Player => ({
  ...current,
  position: lerpPoint(previous.position, current.position, alpha),
});

/** An enemy has no id, but where it spawned is fixed and unique to it. */
const sameEnemy = (one: Enemy, other: Enemy): boolean =>
  one.spawn.x === other.spawn.x && one.spawn.y === other.spawn.y;

const tweenEnemies = (
  previous: Enemy[],
  current: Enemy[],
  alpha: number,
): Enemy[] =>
  map(current, (enemy) =>
    match(find(previous, (before) => sameEnemy(before, enemy)))
      .with(nonNullable, (before): Enemy => ({
        ...enemy,
        position: lerpPoint(before.position, enemy.position, alpha),
      }))
      .otherwise(() => enemy),
  );

/**
 * The simulation moves in whole fixed steps, which the screen does not line up
 * with: a frame lands part-way through a step, and drawing the raw state makes
 * everything stutter on the frames where no step happened. `alpha` is how far
 * that frame has carried past `previous`, so the drawn state is the one the run
 * was passing through at the moment the frame is showing.
 *
 * Projectiles are left alone - they carry no identity to match them by, and
 * they are small, brief, and fast enough that nothing follows them.
 */
export const interpolateState = (
  previous: GameState,
  current: GameState,
  alpha: number,
): GameState =>
  match(previous === current || previous.levelIndex !== current.levelIndex)
    .with(true, () => current)
    .otherwise((): GameState => ({
      ...current,
      player: tweenPlayer(previous.player, current.player, alpha),
      enemies: tweenEnemies(previous.enemies, current.enemies, alpha),
      time: lerp(previous.time, current.time, alpha),
    }));
