import type { Cannon } from '@mander/model';
import { createFiredCannonball } from '../create-fired-cannonball';
import { computeNextRoundIndex } from './compute-next-round-index';
import type { CannonRound } from './types/cannon-round';
import type { CannonShot } from './types/cannon-shot';

export const createFiredCannonShot = (
  cannon: Cannon,
  round: CannonRound,
): CannonShot => ({
  cannon: {
    ...cannon,
    roundIndex: computeNextRoundIndex(cannon),
    timers: { reload: cannon.timers.reload + round.reloadSeconds },
  },
  cannonball: createFiredCannonball(cannon, round.angle),
});
