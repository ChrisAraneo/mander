import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { match } from 'ts-pattern';
import { DEEP_DIRT_DEPTH, DIRT_DEPTH } from '../../consts';

const DEEP_DIRT_CHANCE = 0.5;

export const pickRandomDirtDepth = ({
  tiles,
  random,
}: {
  tiles: Tile[][];
  random: ReturnType<typeof createRandom>;
}) => ({
  tiles,
  depth: match(random.isRollUnder(DEEP_DIRT_CHANCE))
    .with(true, () => DEEP_DIRT_DEPTH)
    .otherwise(() => DIRT_DEPTH),
});
