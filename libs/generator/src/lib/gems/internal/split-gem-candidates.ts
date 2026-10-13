import { match } from 'ts-pattern';
import type { filterGemCandidates } from './filter-gem-candidates';
import { splitIntoColumnSlots } from './split-into-column-slots';
import { splitIntoRowSlots } from './split-into-row-slots';

export const splitGemCandidates = ({
  tiles,
  levelType,
  candidates,
  random,
}: ReturnType<typeof filterGemCandidates>) => ({
  tiles,
  levelType,
  slots: match(levelType)
    .with('HORIZONTAL', () => splitIntoColumnSlots(tiles, candidates))
    .with('VERTICAL', () => splitIntoRowSlots(tiles, candidates))
    .exhaustive(),
  random,
});
