import { match } from 'ts-pattern';
import { sortByColumnRandomly } from './sort-by-column-randomly';
import { sortBySpotRandomly } from './sort-by-spot-randomly';
import type { splitGemCandidates } from './split-gem-candidates';

export const sortGemCandidatesRandomly = ({
  tiles,
  levelType,
  slots,
  random,
}: ReturnType<typeof splitGemCandidates>) => ({
  tiles,
  levelType,
  slots: match(levelType)
    .with('HORIZONTAL', () => sortByColumnRandomly(tiles, slots, random))
    .with('VERTICAL', () => sortBySpotRandomly(slots, random))
    .exhaustive(),
});
