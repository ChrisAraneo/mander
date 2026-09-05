import { type GameLevel, HORNED_ENEMY_CHANCE } from '@mander/engine';
import type { Tile } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import type { Structure } from '@mander/structures';
import { filter, floor, map, range, size, slice, take } from 'lodash-es';
import { match } from 'ts-pattern';
import { addPadding } from './structures/add-padding';
import { addStones } from './structures/add-stones';
import { computeLevelSeeds } from './seed/compute-level-seeds';
import { clearBeartraps } from './structures/clear-beartraps';
import { clearCannons } from './structures/clear-cannons';
import { clearFireballs } from './structures/clear-fireballs';
import { clearSpikes } from './structures/clear-spikes';
import { generateChestItems } from './items/generate-chest-items';
import { generatePalette } from './palette/generate-palette';
import { isMirrored } from './structures/is-mirrored';
import { isVertical } from './structures/is-vertical';
import { layoutFor } from './structures/layout';
import { mirrorTiles } from './structures/mirror-tiles';
import { pickStructures, type Pool } from './structures/pick-structures';
import { computeWorldName } from './seed/compute-world-name';
import {
  FIRST_HORNED_ENEMY_LEVEL,
  ONLY_HORNED_ENEMIES,
  FIRST_MIXED_ENEMY_LEVEL,
  NO_HORNED_ENEMIES,
  STRUCTURES_PER_LEVEL,
  FIRST_HARD_LEVEL,
} from './consts';

type Deal = Record<Pool, Structure[]>;

const hornedEnemyChanceFor = (levelNumber: number): number =>
  match(levelNumber)
    .when(
      (number) => number >= FIRST_HORNED_ENEMY_LEVEL,
      () => ONLY_HORNED_ENEMIES,
    )
    .when(
      (number) => number >= FIRST_MIXED_ENEMY_LEVEL,
      () => HORNED_ENEMY_CHANCE,
    )
    .otherwise(() => NO_HORNED_ENEMIES);

const poolFor = (levelNumber: number): Pool =>
  match(levelNumber)
    .when(isVertical, (): Pool => 'vertical')
    .when(
      (number) => number >= FIRST_HARD_LEVEL,
      (): Pool => 'hard',
    )
    .otherwise((): Pool => 'normal');

const levelPools = (levels: number): Pool[] =>
  map(range(1, levels + 1), poolFor);

const countIn = (pools: Pool[], pool: Pool): number =>
  size(filter(pools, (drawn) => drawn === pool));

const rankIn = (pools: Pool[], index: number): number =>
  countIn(take(pools, index), pools[index]);

const dealFor = (worldName: string, pools: Pool[]): Deal => ({
  normal: pickStructures(
    worldName,
    countIn(pools, 'normal') * STRUCTURES_PER_LEVEL,
    'normal',
  ),
  hard: pickStructures(
    worldName,
    countIn(pools, 'hard') * STRUCTURES_PER_LEVEL,
    'hard',
  ),
  vertical: pickStructures(
    worldName,
    countIn(pools, 'vertical') * STRUCTURES_PER_LEVEL,
    'vertical',
  ),
});

const sliceForLevel = (
  dealt: Structure[],
  levels: number,
  index: number,
): Structure[] => {
  const perLevel = floor(size(dealt) / levels);

  return slice(dealt, index * perLevel, (index + 1) * perLevel);
};

const buildTiles = (structures: Structure[], levelNumber: number): Tile[][] => {
  const layout = layoutFor(levelNumber);
  const tiles = clearFireballs(
    clearCannons(layout.join(structures), levelNumber),
    levelNumber,
  );
  const withPlayer = layout.addSpawn(tiles);
  const withPortal = layout.addPortal(withPlayer);
  const withPadding = addPadding(withPortal);
  const withSpikes = clearSpikes(withPadding, levelNumber);
  const withBeartraps = clearBeartraps(withSpikes, levelNumber);
  const withKey = layout.addKey(withBeartraps);
  const withChest = layout.addChest(withKey);
  const withGems = layout.addGems(withChest);
  const withStones = addStones(withGems);

  return isMirrored(levelNumber) ? mirrorTiles(withStones) : withStones;
};

export const generate = (date: Date): RenderedWorld => {
  const worldName = computeWorldName(date);
  const seeds = computeLevelSeeds(date);
  const palette = generatePalette(worldName);
  const pools = levelPools(size(seeds));
  const deal = dealFor(worldName, pools);

  const levels: GameLevel[] = map(seeds, (seed, index) => {
    const levelNumber = index + 1;
    const pool = pools[index];
    const tiles = buildTiles(
      sliceForLevel(deal[pool], countIn(pools, pool), rankIn(pools, index)),
      levelNumber,
    );

    const level: GameLevel = {
      seed,
      width: size(tiles[0]),
      height: size(tiles),
      tiles,
      chestItems: generateChestItems(seed),
      hornedEnemyChance: hornedEnemyChanceFor(levelNumber),
      isOpenSided: isVertical(levelNumber),
    };

    return level;
  });

  return {
    name: worldName,
    levels,
    palette,
    score: 0,
  };
};
