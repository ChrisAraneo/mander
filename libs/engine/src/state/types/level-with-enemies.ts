import type { Level, Point } from '@mander/model';

export interface LevelWithEnemies extends Level {
  enemies: Point[];
}
