import { type Tile, TILE_GEM } from '@mander/model';
import { VERTICAL_BAND_HEIGHT } from '@mander/structures';
import { chain, createRandom } from '@mander/utils';
import {
  ceil,
  every,
  filter,
  floor,
  map,
  range,
  reduce,
  size,
  sortBy,
} from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';
import { findStandingSpots, type Spot } from './find-standing-spots';
import { formatTilesSeed } from './format-tiles-seed';

const { nullish } = P;

const GEMS_PER_STRUCTURE = 5;

const SLOT_HEIGHT = VERTICAL_BAND_HEIGHT / GEMS_PER_STRUCTURE;

const REST_HEIGHT = 2;

const AIR_ABOVE = 1;

const CLEARANCE = REST_HEIGHT + AIR_ABOVE;

const MIN_GAP = 2;

interface Sowing {
  taken: Spot[];
  patches: TilePatch[];
}

const isApart = (taken: Spot[], spot: Spot): boolean =>
  every(
    taken,
    (other) =>
      Math.abs(other.row - spot.row) >= MIN_GAP ||
      Math.abs(other.column - spot.column) >= MIN_GAP,
  );

const filterSlotSpots = (spots: Spot[], slot: number): Spot[] =>
  filter(spots, (spot) => floor(spot.row / SLOT_HEIGHT) === slot);

const groupSlots = (tiles: Tile[][], spots: Spot[]): Spot[][] =>
  map(range(ceil(size(tiles) / SLOT_HEIGHT)), (slot) =>
    filterSlotSpots(spots, slot),
  );

const sowSlot = (
  random: ReturnType<typeof createRandom>,
  sown: Sowing,
  spots: Spot[],
): Sowing =>
  chain(sortBy(spots, () => random.rollFloat()))
    .find((candidate) => isApart(sown.taken, candidate))
    .thru((spot) =>
      match(spot)
        .with(nullish, () => sown)
        .otherwise((found): Sowing => ({
          taken: [...sown.taken, found],
          patches: [
            ...sown.patches,
            {
              row: found.row - REST_HEIGHT,
              column: found.column,
              tile: TILE_GEM,
            },
          ],
        })),
    )
    .value();

export const addVerticalGems = (tiles: Tile[][]): Tile[][] =>
  chain(createRandom(formatTilesSeed(tiles)))
    .thru((random) =>
      reduce(
        groupSlots(tiles, findStandingSpots(tiles, CLEARANCE)),
        (sown: Sowing, spots): Sowing => sowSlot(random, sown, spots),
        { taken: [], patches: [] },
      ),
    )
    .thru(({ patches }) => patchTiles(tiles, patches))
    .value();
