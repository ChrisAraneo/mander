import type { createRandom } from '@mander/engine';
import { type Tile, chain } from '@mander/model';
import { map, size, sortBy, times } from 'lodash-es';
import type { Spot } from '../../types/spot';

export const sortByColumnRandomly = (
  tiles: Tile[][],
  slots: Spot[][],
  random: ReturnType<typeof createRandom>,
): Spot[][] =>
  chain(times(size(tiles[0] ?? []), () => random.rollFloat()))
    .thru((rolls) =>
      map(slots, (slot) => sortBy(slot, ({ column }) => rolls[column])),
    )
    .value();
