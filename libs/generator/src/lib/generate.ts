import { type GameLevel, HORNED_ENEMY_CHANCE } from '@mander/engine';
import type { RenderedWorld } from '@mander/render';
import type { Structure } from '@mander/structures';
import { floor, map, size, slice } from 'lodash-es';
import { match } from 'ts-pattern';
import { addChest } from './structures/add-chest';
import { addGems } from './structures/add-gems';
import { computeLevelSeeds } from './seed/compute-level-seeds';
import { addPadding } from './structures/add-padding';
import { addPlayerSpawn } from './structures/add-player-spawn';
import { addPortal } from './structures/add-portal';
import { clearSpikes } from './structures/clear-spikes';
import { generatePalette } from './palette/generate-palette';
import { joinStructures } from './structures/join-structures';
import { pickStructures } from './structures/pick-structures';
import { addKey } from './structures/add-key';
import { generateChestItems } from './items/generate-chest-items';
import { computeWorldName } from './seed/compute-world-name';
import { addStones } from './structures/add-stones';
import { clearCannons } from './structures/clear-cannons';
import { clearFireballs } from './structures/clear-fireballs';
import { isMirrored } from './structures/is-mirrored';
import { mirrorTiles } from './structures/mirror-tiles';
import { FIRST_HORNED_ENEMY_LEVEL, ONLY_HORNED_ENEMIES, FIRST_MIXED_ENEMY_LEVEL, NO_HORNED_ENEMIES, NORMAL_LEVELS, STRUCTURES_PER_LEVEL, FIRST_HARD_LEVEL } from './consts';

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

const sliceForLevel = (
  dealt: Structure[],
  levels: number,
  index: number,
): Structure[] => {
  const perLevel = floor(size(dealt) / levels);

  return slice(dealt, index * perLevel, (index + 1) * perLevel);
};

export const generate = (date: Date): RenderedWorld => {
  const worldName = computeWorldName(date);
  const seeds = computeLevelSeeds(date);
  const palette = generatePalette(worldName);
  const hardLevels = size(seeds) - NORMAL_LEVELS;
  const normalStructures = pickStructures(
    worldName,
    NORMAL_LEVELS * STRUCTURES_PER_LEVEL,
    'normal',
  );
  const hardStructures = pickStructures(
    worldName,
    hardLevels * STRUCTURES_PER_LEVEL,
    'hard',
  );

  const levels: GameLevel[] = map(seeds, (seed, index) => {
    const levelNumber = index + 1;
    const difficulty = levelNumber >= FIRST_HARD_LEVEL ? 'hard' : 'normal';
    const chestItems = generateChestItems(seed);

    const structures =
      difficulty === 'hard'
        ? sliceForLevel(hardStructures, hardLevels, index - NORMAL_LEVELS)
        : sliceForLevel(normalStructures, NORMAL_LEVELS, index);
    const tiles = clearFireballs(
      clearCannons(joinStructures(structures), levelNumber),
      levelNumber,
    );
    const withPlayer = addPlayerSpawn(tiles);
    const withPortal = addPortal(withPlayer);
    const withPadding = addPadding(withPortal);
    const withSpikes = clearSpikes(withPadding, levelNumber);
    const withKey = addKey(withSpikes);
    const withChest = addChest(withKey);
    const withGems = addGems(withChest);
    const withStones = addStones(withGems);
    const withMirror = isMirrored(levelNumber)
      ? mirrorTiles(withStones)
      : withStones;

    const level: GameLevel = {
      seed,
      width: size(withMirror[0]),
      height: size(withMirror),
      tiles: withMirror,
      chestItems,
      hornedEnemyChance: hornedEnemyChanceFor(levelNumber),
    };

    return level;
  });

  return {
    name: computeWorldName(date),
    levels,
    palette,
    score: 0,
  };
};
