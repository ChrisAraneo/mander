import { type EnemyKind, type Tile, toTileEnemyKind } from '@mander/model';
import { match, P } from 'ts-pattern';
import { toRolledEnemyKind } from './to-rolled-enemy-kind';

const { nullish } = P;

export const toEnemyKind = (
  tile: Tile,
  isAirborne: boolean,
  isHorned: boolean,
  isFast: boolean,
  isShooter: boolean,
  isFreezing: boolean,
): EnemyKind =>
  match(toTileEnemyKind(tile))
    .with(nullish, () =>
      toRolledEnemyKind(isAirborne, isHorned, isFast, isShooter, isFreezing),
    )
    .otherwise((kind) => kind);
