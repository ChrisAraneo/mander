import { match } from 'ts-pattern';
import type { groupGemCandidates } from './group-gem-candidates';
import { shuffleByColumn } from './shuffle-by-column';
import { shuffleBySpot } from './shuffle-by-spot';

export const shuffleGemCandidates = ({
  tiles,
  levelType,
  random,
  slots,
}: ReturnType<typeof groupGemCandidates>) => ({
  tiles,
  levelType,
  slots: match(levelType)
    .with('HORIZONTAL', () => shuffleByColumn(tiles, slots, random))
    .with('VERTICAL', () => shuffleBySpot(slots, random))
    .exhaustive(),
});
