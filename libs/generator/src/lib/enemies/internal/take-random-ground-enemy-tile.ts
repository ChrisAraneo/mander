import { isRollUnder, type Random } from '@mander/engine';
import {
  type Tile,
  TILE_ENEMY_FAST,
  TILE_ENEMY_FREEZING,
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_HORNED,
  TILE_ENEMY_SHOOTER,
} from '@mander/model';
import { match } from 'ts-pattern';
import type { EnemyChances } from '../../types/enemy-chances';

export const takeRandomGroundEnemyTile = (
  chances: EnemyChances,
  random: Random,
): Tile =>
  match({
    isShooter: isRollUnder(chances.shooter, random),
    isFreezing: isRollUnder(chances.freezing, random),
    isFast: isRollUnder(chances.fast, random),
    isHorned: isRollUnder(chances.horned, random),
  })
    .with({ isShooter: true }, () => TILE_ENEMY_SHOOTER)
    .with({ isFreezing: true }, () => TILE_ENEMY_FREEZING)
    .with({ isFast: true }, () => TILE_ENEMY_FAST)
    .with({ isHorned: true }, () => TILE_ENEMY_HORNED)
    .otherwise(() => TILE_ENEMY_HOPPING);
