import type { Tile } from '@mander/model';
import { createRandom } from '@mander/utils';
import { match } from 'ts-pattern';
import { DEEP_DIRT_DEPTH, DIRT_DEPTH } from '../../../consts';
import { formatTilesSeed } from '../../format-tiles-seed';

const DEEP_DIRT_CHANCE = 0.5;

export const pickDirtDepth = ({ tiles }: { tiles: Tile[][] }) => ({
  tiles,
  depth: match(
    createRandom(formatTilesSeed(tiles)).isRollUnder(DEEP_DIRT_CHANCE),
  )
    .with(true, () => DEEP_DIRT_DEPTH)
    .otherwise(() => DIRT_DEPTH),
});
