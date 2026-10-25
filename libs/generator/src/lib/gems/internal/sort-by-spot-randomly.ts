import type { Random } from '@mander/engine';
import { map, sortBy } from 'lodash-es';
import type { Spot } from '../../types/spot';

export const sortBySpotRandomly = (slots: Spot[][], random: Random): Spot[][] =>
  map(slots, (slot) => sortBy(slot, () => random()));
