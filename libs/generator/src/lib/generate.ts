import { type GameLevel, HORNED_ENEMY_CHANCE } from '@mander/engine';
import type { Layers, LevelMeta } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { getStructureName, type Sector } from '@mander/structures';
import { map, size } from 'lodash-es';
import { match } from 'ts-pattern';
import { addPadding } from './structures/padding/add-padding';
import { placeStones } from './structures/stones/place-stones';
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
import { placePlayerSpawn } from './structures/player-spawn/place-player-spawn';
import { placePortal } from './structures/portal/place-portal';
import { placeKey } from './structures/key/place-key';
import { placeChest } from './structures/chest/place-chest';
import { placeGems } from './structures/gems/place-gems';
import { getLevelCategories } from './structures/world/get-level-categories';
import { pickWorldStructures } from './structures/world/pick-world-structures';
import { sliceForLevel } from './structures/world/slice-for-level';
import { computeWorldName } from './seed/compute-world-name';
import {
  FIRST_HORNED_ENEMY_LEVEL,
  ONLY_HORNED_ENEMIES,
  FIRST_MIXED_ENEMY_LEVEL,
  NO_HORNED_ENEMIES,
} from './consts';

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

const getMeta = (structures: Sector[]): LevelMeta => ({
  structures: map(structures, getStructureName),
});

export const generate = (date: Date): RenderedWorld => {
  const worldName = computeWorldName(date);
  const seeds = computeLevelSeeds(date);
  const palette = generatePalette(worldName);
  const levelCategories = getLevelCategories(size(seeds));
  const worldStructures = pickWorldStructures(worldName, levelCategories);

  const levels: GameLevel[] = map(seeds, (seed, index) => {
    const levelNumber = index + 1;
    const levelType = getLevelType(levelNumber);
    const structures = sliceForLevel(worldStructures, levelCategories, index);
    const joined = getLayout(levelNumber).join(structures);
    const cleared = clearFireballs(
      clearCannons(joined.tiles, levelNumber),
      levelNumber,
    );
    const withPlayer = placePlayerSpawn(cleared, levelType);
    const withPortal = placePortal(withPlayer, levelType);
    const withPadding = addPadding(withPortal);
    const withSpikes = clearSpikes(withPadding, levelNumber);
    const withBeartraps = clearBeartraps(withSpikes, levelNumber);
    const withKey = placeKey(withBeartraps, levelType);
    const withChest = placeChest(withKey, levelType);
    const withGems = placeGems(withChest, levelType);
    const withStones = placeStones(withGems);
    const paddedBack = addPadding(joined.backTiles, withPortal);
    const { tiles, backTiles } = match(isMirrored(levelNumber))
      .with(true, (): Layers => ({
        tiles: mirrorTiles(withStones),
        backTiles: mirrorTiles(paddedBack),
      }))
      .otherwise((): Layers => ({ tiles: withStones, backTiles: paddedBack }));

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
