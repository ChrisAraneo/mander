import type { GameLevel } from '../../state/types/game-level';

export const getLevelAt = (
  levels: GameLevel[],
  index: number,
): GameLevel | undefined => levels[index];
