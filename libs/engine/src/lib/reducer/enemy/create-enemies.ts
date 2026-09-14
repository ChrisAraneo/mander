import {
  type Enemy,
  type EnemyKind,
  findBeartrapTiles,
  findEnemyTiles,
  isSolid,
  TILE_SIZE,
} from '@mander/model';
import { createRandom, type Point } from '@mander/utils';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

import type { GameLevel } from '../../types/game-level';
import {
  BEARTRAP_JUMP_VELOCITY,
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_JUMP_VELOCITY,
} from './consts';

const getMaxYVelocity = (kind: EnemyKind): number =>
  match(kind)
    .with('HORNED', () => HORNED_ENEMY_JUMP_VELOCITY)
    .with('FLYING', () => FLYING_ENEMY_MOVE_SPEED)
    .otherwise(() => ENEMY_JUMP_VELOCITY);

const getMoveSpeed = (kind: EnemyKind): number =>
  match(kind)
    .with('FLYING', () => 0)
    .otherwise(() => ENEMY_MOVE_SPEED);

const getGroundKind = (isHorned: boolean): EnemyKind =>
  match(isHorned)
    .with(true, (): EnemyKind => 'HORNED')
    .otherwise((): EnemyKind => 'HOPPING');

const getKind = (isAirborne: boolean, isHorned: boolean): EnemyKind =>
  match(isAirborne)
    .with(true, (): EnemyKind => 'FLYING')
    .otherwise(() => getGroundKind(isHorned));

const getSpawnX = (spawn: Point): number =>
  spawn.x * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;

const getSpawnY = (spawn: Point): number =>
  (spawn.y + 1) * TILE_SIZE - ENEMY_HEIGHT;

const createBeartraps = (level: GameLevel): Enemy[] =>
  map(findBeartrapTiles(level), (spawn): Enemy => {
    const x = getSpawnX(spawn);
    const y = getSpawnY(spawn);

    return {
      kind: 'BEARTRAP',
      position: { x, y },
      velocity: {
        x: { current: 0, max: 0 },
        y: { current: 0, max: BEARTRAP_JUMP_VELOCITY },
      },
      timers: { death: null },
      spawn: { x, y },
      statuses: { isFacingRight: true, isGrounded: false },
    };
  });

const createPatrols = (level: GameLevel): Enemy[] => {
  const random = createRandom(`${level.seed}#enemies`);

  return map(findEnemyTiles(level), (spawn): Enemy => {
    const x = getSpawnX(spawn);
    const y = getSpawnY(spawn);
    const kind = getKind(
      !isSolid(level, spawn.x, spawn.y + 1),
      random.isRollUnder(level.hornedEnemyChance),
    );

    return {
      kind,
      position: { x, y },
      velocity: {
        x: { current: 0, max: getMoveSpeed(kind) },
        y: { current: 0, max: getMaxYVelocity(kind) },
      },
      timers: { death: null },
      spawn: { x, y },
      statuses: { isFacingRight: true, isGrounded: false },
    };
  });
};

export const createEnemies = (level: GameLevel): Enemy[] => [
  ...createPatrols(level),
  ...createBeartraps(level),
];
