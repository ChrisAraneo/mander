import { type GameLevel, HORNED_ENEMY_CHANCE } from '@mander/engine';
import type { RenderedWorld } from '@mander/render';
import type { Structure } from '@mander/structures';
import { floor, size, slice } from 'lodash-es';
import { match } from 'ts-pattern';
import { addChest } from './structures/add-chest';
import { addDiamonds } from './structures/add-diamonds';
import { computeLevelSeeds } from './seed/compute-level-seeds';
import { addPadding } from './structures/add-padding';
import { addPlayerSpawn } from './structures/add-player-spawn';
import { addPortal } from './structures/add-portal';
import { addSpikes } from './structures/add-spikes';
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

const FIRST_HARD_LEVEL = 7;

const NORMAL_LEVELS = FIRST_HARD_LEVEL - 1;

const STRUCTURES_PER_LEVEL = 7;

const FIRST_MIXED_ENEMY_LEVEL = 3;

const FIRST_HORNED_ENEMY_LEVEL = 6;

const NO_HORNED_ENEMIES = 0;

const ONLY_HORNED_ENEMIES = 1;

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
  const hardLevels = seeds.length - NORMAL_LEVELS;
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

  const levels: GameLevel[] = seeds.map((seed, index) => {
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
    const withSpikes = addSpikes(withPadding, levelNumber);
    const withKey = addKey(withSpikes);
    const withChest = addChest(withKey);
    const withDiamonds = addDiamonds(withChest);
    const withStones = addStones(withDiamonds);
    const withMirror = isMirrored(seed) ? mirrorTiles(withStones) : withStones;

    const level: GameLevel = {
      seed,
      width: withMirror[0].length,
      height: withMirror.length,
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
