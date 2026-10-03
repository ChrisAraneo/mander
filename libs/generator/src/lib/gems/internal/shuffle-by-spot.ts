import type { createRandom } from '@mander/utils';
import { map, sortBy } from 'lodash-es';
import type { Spot } from '../../types/spot';

export const shuffleBySpot = (
  slots: Spot[][],
  random: ReturnType<typeof createRandom>,
): Spot[][] => map(slots, (slot) => sortBy(slot, () => random.rollFloat()));
