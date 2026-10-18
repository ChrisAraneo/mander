const SQUASH_FLOOR = 0.15;

export const computeEnemySquash = (progress: number): number =>
  1 - progress * (1 - SQUASH_FLOOR);
