import { match } from 'ts-pattern';
import type { findGemCandidates } from './find-gem-candidates';
import { groupIntoColumnSlots } from './group-into-column-slots';
import { groupIntoRowSlots } from './group-into-row-slots';

export const groupGemCandidates = ({
  tiles,
  levelType,
  random,
  candidates,
}: ReturnType<typeof findGemCandidates>) => ({
  tiles,
  levelType,
  random,
  slots: match(levelType)
    .with('HORIZONTAL', () => groupIntoColumnSlots(tiles, candidates))
    .with('VERTICAL', () => groupIntoRowSlots(tiles, candidates))
    .exhaustive(),
});
