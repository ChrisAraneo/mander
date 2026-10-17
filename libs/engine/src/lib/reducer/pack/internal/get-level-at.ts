import type { GameLevel } from '../../../types/game-level';

export const getLevelAt = (
  levels: GameLevel[],
  index: number,
): GameLevel | undefined => levels[index];
