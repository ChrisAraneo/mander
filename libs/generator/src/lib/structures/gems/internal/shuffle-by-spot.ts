import type { createRandom } from '@mander/utils';
import { map, sortBy } from 'lodash-es';
import type { Spot } from '../../find-standing-spots';

export const shuffleBySpot = (
  slots: Spot[][],
  random: ReturnType<typeof createRandom>,
) => map(slots, (slot) => sortBy(slot, () => random.rollFloat()));
