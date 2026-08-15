import type { World } from '@mander/model';

import type { GameLevel } from './game-level';

export interface GameWorld extends World {
  levels: GameLevel[];
}
