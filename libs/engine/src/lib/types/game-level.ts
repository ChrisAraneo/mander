import type { Level } from '@mander/model';

export interface GameLevel extends Level {
  hornedEnemyChance: number;
  fastEnemyChance: number;
  shooterEnemyChance: number;
}
