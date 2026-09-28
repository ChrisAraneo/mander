import type { Tile } from '@mander/model';
import { chain, type createRandom } from '@mander/utils';
import { map, size, sortBy, times } from 'lodash-es';
import type { Spot } from '../../find-standing-spots';

export const shuffleByColumn = (
  tiles: Tile[][],
  slots: Spot[][],
  random: ReturnType<typeof createRandom>,
) =>
  chain(times(size(tiles[0] ?? []), () => random.rollFloat()))
    .thru((rolls) =>
      map(slots, (slot) => sortBy(slot, ({ column }) => rolls[column])),
    )
    .value();
