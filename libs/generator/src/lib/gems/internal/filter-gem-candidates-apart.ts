import { find, reduce } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Spot } from '../../types/spot';
import { isGemApart } from './is-gem-apart';
import type { GemApartCandidates } from './types/gem-apart-candidates';
import type { GemShuffledSlots } from './types/gem-shuffled-slots';

const { nullish } = P;

export const filterGemCandidatesApart = ({
  tiles,
  levelType,
  slots,
}: GemShuffledSlots): GemApartCandidates => ({
  tiles,
  candidates: reduce(
    slots,
    (picked: Spot[], slot) =>
      match(find(slot, (candidate) => isGemApart(levelType, picked, candidate)))
        .with(nullish, () => picked)
        .otherwise((candidate) => [...picked, candidate]),
    [],
  ),
});
