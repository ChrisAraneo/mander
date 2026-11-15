import type { Cannon } from '@mander/model';
import { getCannonRounds } from './get-cannon-rounds';
import type { CannonRound } from './types/cannon-round';

export const getCannonRound = (cannon: Cannon): CannonRound =>
  getCannonRounds(cannon.kind)[cannon.roundIndex];
