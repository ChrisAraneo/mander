import { match } from 'ts-pattern';
import { splitIntoColumnSlots } from './split-into-column-slots';
import { splitIntoRowSlots } from './split-into-row-slots';
import type { GemCandidates } from './types/gem-candidates';
import type { GemSlots } from './types/gem-slots';

export const splitGemCandidates = ({
  tiles,
  levelType,
  candidates,
  random,
}: GemCandidates): GemSlots => ({
  tiles,
  levelType,
  slots: match(levelType)
    .with('HORIZONTAL', () => splitIntoColumnSlots(tiles, candidates))
    .with('VERTICAL', () => splitIntoRowSlots(tiles, candidates))
    .exhaustive(),
  random,
});
