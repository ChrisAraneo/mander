import { match } from 'ts-pattern';
import { sortHorizontalKeyCandidates } from './sort-horizontal-key-candidates';
import { sortVerticalKeyCandidates } from './sort-vertical-key-candidates';
import type { KeyCandidates } from './types/key-candidates';
import type { SortedKeyCandidates } from './types/sorted-key-candidates';

export const sortKeyCandidates = ({
  tiles,
  levelType,
  candidates,
}: KeyCandidates): SortedKeyCandidates => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () => sortHorizontalKeyCandidates(tiles, candidates))
    .with('VERTICAL', () => sortVerticalKeyCandidates(tiles, candidates))
    .exhaustive(),
});
