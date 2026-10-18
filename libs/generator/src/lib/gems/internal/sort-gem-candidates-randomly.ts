import { match } from 'ts-pattern';
import { sortByColumnRandomly } from './sort-by-column-randomly';
import { sortBySpotRandomly } from './sort-by-spot-randomly';
import type { GemSlots } from './types/gem-slots';
import type { ShuffledGemSlots } from './types/shuffled-gem-slots';

export const sortGemCandidatesRandomly = ({
  tiles,
  levelType,
  slots,
  random,
}: GemSlots): ShuffledGemSlots => ({
  tiles,
  levelType,
  slots: match(levelType)
    .with('HORIZONTAL', () => sortByColumnRandomly(tiles, slots, random))
    .with('VERTICAL', () => sortBySpotRandomly(slots, random))
    .exhaustive(),
});
