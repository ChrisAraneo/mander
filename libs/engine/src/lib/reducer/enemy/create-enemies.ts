import {
  type Enemy,
  type EnemyKind,
  findEnemyTiles,
  isSolid,
  TILE_SIZE,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

import type { GameLevel } from '../../game-level';
import {
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_JUMP_VELOCITY,
} from './consts';

const maxYVelocityFor = (kind: EnemyKind): number =>
  match(kind)
    .with('HORNED', () => HORNED_ENEMY_JUMP_VELOCITY)
    .with('FLYING', () => FLYING_ENEMY_MOVE_SPEED)
    .otherwise(() => ENEMY_JUMP_VELOCITY);

const moveSpeedFor = (kind: EnemyKind): number =>
  match(kind)
    .with('FLYING', () => 0)
    .otherwise(() => ENEMY_MOVE_SPEED);

const groundKindFor = (isHorned: boolean): EnemyKind =>
  match(isHorned)
    .with(true, (): EnemyKind => 'HORNED')
    .otherwise((): EnemyKind => 'HOPPING');

const kindFor = (isAirborne: boolean, isHorned: boolean): EnemyKind =>
  match(isAirborne)
    .with(true, (): EnemyKind => 'FLYING')
    .otherwise(() => groundKindFor(isHorned));

export const createEnemies = (level: GameLevel): Enemy[] => {
  const random = createRandom(`${level.seed}#enemies`);

  return map(findEnemyTiles(level), (spawn) => {
    const x = spawn.x * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;
    const y = (spawn.y + 1) * TILE_SIZE - ENEMY_HEIGHT;
    const kind = kindFor(
      !isSolid(level, spawn.x, spawn.y + 1),
      random.chance(level.hornedEnemyChance),
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
