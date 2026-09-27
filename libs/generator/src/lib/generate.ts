import { type GameLevel, HORNED_ENEMY_CHANCE } from '@mander/engine';
import type { Layers, LevelMeta } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { getStructureName, type Sector } from '@mander/structures';
import { filter, floor, map, range, size, slice, take } from 'lodash-es';
import { match } from 'ts-pattern';
import { addPadding } from './structures/padding/add-padding';
import { addStones } from './structures/add-stones';
import { computeLevelSeeds } from './seed/compute-level-seeds';
import { clearBeartraps } from './structures/beartraps/clear-beartraps';
import { clearCannons } from './structures/cannons/clear-cannons';
import { clearFireballs } from './structures/fireballs/clear-fireballs';
import { clearSpikes } from './structures/spikes/clear-spikes';
import { generateChestItems } from './items/generate-chest-items';
import { generatePalette } from './palette/generate-palette';
import { getLevelType } from './structures/get-level-type';
import { isMirrored } from './structures/is-mirrored';
import { isVertical } from './structures/is-vertical';
import { getLayout } from './structures/layout';
import { mirrorTiles } from './structures/mirror-tiles';
import { pickStructures, type Pool } from './structures/pick-structures';
import { placePlayerSpawn } from './structures/player-spawn/place-player-spawn';
import { placePortal } from './structures/portal/place-portal';
import { computeWorldName } from './seed/compute-world-name';
import {
  FIRST_HORNED_ENEMY_LEVEL,
  ONLY_HORNED_ENEMIES,
  FIRST_MIXED_ENEMY_LEVEL,
  NO_HORNED_ENEMIES,
  STRUCTURES_PER_LEVEL,
  FIRST_HARD_LEVEL,
} from './consts';

type Deal = Record<Pool, Sector[]>;

const getHornedEnemyChance = (levelNumber: number): number =>
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

const getPool = (levelNumber: number): Pool =>
  match(levelNumber)
    .when(isVertical, (): Pool => 'vertical')
    .when(
      (number) => number >= FIRST_HARD_LEVEL,
      (): Pool => 'hard',
    )
    .otherwise((): Pool => 'normal');

const listLevelPools = (levels: number): Pool[] =>
  map(range(1, levels + 1), getPool);

const countIn = (pools: Pool[], pool: Pool): number =>
  size(filter(pools, (drawn) => drawn === pool));

const getRank = (pools: Pool[], index: number): number =>
  countIn(take(pools, index), pools[index]);

const dealStructures = (worldName: string, pools: Pool[]): Deal => ({
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
  dealt: Sector[],
  levels: number,
  index: number,
): Sector[] => {
  const perLevel = floor(size(dealt) / levels);

  return slice(dealt, index * perLevel, (index + 1) * perLevel);
};

const getMeta = (structures: Sector[]): LevelMeta => ({
  structures: map(structures, getStructureName),
});

const buildLayers = (structures: Sector[], levelNumber: number): Layers => {
  const layout = getLayout(levelNumber);
  const levelType = getLevelType(levelNumber);
  const { tiles: joined, backTiles } = layout.join(structures);
  const tiles = clearFireballs(clearCannons(joined, levelNumber), levelNumber);
  const withPlayer = placePlayerSpawn(tiles, levelType);
  const withPortal = placePortal(withPlayer, levelType);
  const withPadding = addPadding(withPortal);
  const withSpikes = clearSpikes(withPadding, levelNumber);
  const withBeartraps = clearBeartraps(withSpikes, levelNumber);
  const withKey = layout.addKey(withBeartraps);
  const withChest = layout.addChest(withKey);
  const withGems = layout.addGems(withChest);
  const withStones = addStones(withGems);
  const paddedBack = addPadding(backTiles, withPortal);

  return match(isMirrored(levelNumber))
    .with(true, (): Layers => ({
      tiles: mirrorTiles(withStones),
      backTiles: mirrorTiles(paddedBack),
    }))
    .otherwise((): Layers => ({ tiles: withStones, backTiles: paddedBack }));
};

export const generate = (date: Date): RenderedWorld => {
  const worldName = computeWorldName(date);
  const seeds = computeLevelSeeds(date);
  const palette = generatePalette(worldName);
  const pools = listLevelPools(size(seeds));
  const deal = dealStructures(worldName, pools);

  const levels: GameLevel[] = map(seeds, (seed, index) => {
    const levelNumber = index + 1;
    const pool = pools[index];
    const structures = sliceForLevel(
      deal[pool],
      countIn(pools, pool),
      getRank(pools, index),
    );
    const { tiles, backTiles } = buildLayers(structures, levelNumber);

    const level: GameLevel = {
      seed,
      width: size(tiles[0]),
      height: size(tiles),
      tiles,
      backTiles,
      chestItems: generateChestItems(seed),
      hornedEnemyChance: getHornedEnemyChance(levelNumber),
      isOpenSided: isVertical(levelNumber),
      meta: getMeta(structures),
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
