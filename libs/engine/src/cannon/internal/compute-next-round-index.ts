import type { Cannon } from '@mander/model';
import { size } from 'lodash-es';
import { getCannonRounds } from './get-cannon-rounds';

export const computeNextRoundIndex = (cannon: Cannon): number =>
  (cannon.roundIndex + 1) % size(getCannonRounds(cannon.kind));
