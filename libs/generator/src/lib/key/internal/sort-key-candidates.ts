import { match } from 'ts-pattern';
import type { filterKeyCandidates } from './filter-key-candidates';
import { sortHorizontalKeyCandidates } from './sort-horizontal-key-candidates';
import { sortVerticalKeyCandidates } from './sort-vertical-key-candidates';

export const sortKeyCandidates = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof filterKeyCandidates>) => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () => sortHorizontalKeyCandidates(tiles, candidates))
    .with('VERTICAL', () => sortVerticalKeyCandidates(tiles, candidates))
    .exhaustive(),
});
