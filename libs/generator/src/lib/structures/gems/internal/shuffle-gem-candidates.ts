import { chain, createRandom } from '@mander/utils';
import { match } from 'ts-pattern';
import { formatTilesSeed } from '../../format-tiles-seed';
import type { groupGemCandidates } from './group-gem-candidates';
import { shuffleByColumn } from './shuffle-by-column';
import { shuffleBySpot } from './shuffle-by-spot';

export const shuffleGemCandidates = ({
  tiles,
  levelType,
  slots,
}: ReturnType<typeof groupGemCandidates>) => ({
  tiles,
  levelType,
  slots: chain(createRandom(formatTilesSeed(tiles)))
    .thru((random) =>
      match(levelType)
        .with('HORIZONTAL', () => shuffleByColumn(tiles, slots, random))
        .with('VERTICAL', () => shuffleBySpot(slots, random))
        .exhaustive(),
    )
    .value(),
});
