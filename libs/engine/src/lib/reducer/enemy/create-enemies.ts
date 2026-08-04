import {
  type Enemy,
  type EnemyKind,
  findEnemyTiles,
  isSolid,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

import {
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_CHANCE,
  HORNED_ENEMY_JUMP_VELOCITY,
} from './consts';

// The meaning of this cap is kind-dependent: a jump velocity for a ground
// enemy's defensive hop, or a flying enemy's (much slower) vertical patrol
// speed — flying never jumps, so there is no conflict reusing the field.
const maxYVelocityFor = (kind: EnemyKind): number =>
  match(kind)
    .with('HORNED', () => HORNED_ENEMY_JUMP_VELOCITY)
    .with('FLYING', () => FLYING_ENEMY_MOVE_SPEED)
    .otherwise(() => ENEMY_JUMP_VELOCITY);

// A flying enemy never patrols sideways, so it has no horizontal speed.
const moveSpeedFor = (kind: EnemyKind): number =>
  match(kind)
    .with('FLYING', () => 0)
    .otherwise(() => ENEMY_MOVE_SPEED);

const groundKindFor = (isHorned: boolean): EnemyKind =>
  match(isHorned)
    .with(true, (): EnemyKind => 'HORNED')
    .otherwise((): EnemyKind => 'STANDARD');

// A tile with nothing solid directly beneath it has no ground to patrol on,
// so it always spawns a flying enemy; a grounded tile keeps the existing
// standard/horned coin flip.
const kindFor = (isAirborne: boolean, isHorned: boolean): EnemyKind =>
  match(isAirborne)
    .with(true, (): EnemyKind => 'FLYING')
    .otherwise(() => groundKindFor(isHorned));

export const createEnemies = (level: Level): Enemy[] => {
  const random = createRandom(`${level.seed}#enemies`);

  return map(findEnemyTiles(level), (spawn) => {
    const x = spawn.x * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;
    const y = (spawn.y + 1) * TILE_SIZE - ENEMY_HEIGHT;
    const kind = kindFor(
      !isSolid(level, spawn.x, spawn.y + 1),
      random.chance(HORNED_ENEMY_CHANCE),
    );

    return {
      kind,
      position: { x, y },
      velocity: {
        x: { current: 0, max: moveSpeedFor(kind) },
        y: { current: 0, max: maxYVelocityFor(kind) },
      },
      timers: { death: null },
      spawn: { x, y },
      statuses: { isFacingRight: true, isGrounded: false },
    };
  });
};
