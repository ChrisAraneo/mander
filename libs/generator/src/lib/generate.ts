import type { Level } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import type { Structure } from '@mander/structures';
import { floor, size, slice } from 'lodash-es';
import { addChest } from './structures/add-chest';
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

/**
 * A day is eight levels, and only the last three are dealt from the hard pool.
 * Everything up to it is built from the normal structures, so the run has a
 * long enough runway before the difficulty turns.
 */
const FIRST_HARD_LEVEL = 6;

/** Levels before the difficulty turns, which is every level up to that one. */
const NORMAL_LEVELS = FIRST_HARD_LEVEL - 1;

/** How long a level runs, in structures, when the library can afford it. */
const STRUCTURES_PER_LEVEL = 7;

/**
 * A difficulty's structures are dealt once for the whole day and then cut into
 * levels, so no two levels of a run are built out of the same piece.
 *
 * The cut is even. A pool with too little in it to give every level its full
 * length takes the shortfall out of all of them alike, rather than running the
 * last level of the day out of pieces to keep the first ones long.
 */
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

  const levels: Level[] = seeds.map((seed, index) => {
    const levelNumber = index + 1;
    const difficulty = levelNumber >= FIRST_HARD_LEVEL ? 'hard' : 'normal';
    const chestItems = generateChestItems(seed);

    const structures =
      difficulty === 'hard'
        ? sliceForLevel(hardStructures, hardLevels, index - NORMAL_LEVELS)
        : sliceForLevel(normalStructures, NORMAL_LEVELS, index);
    const tiles = joinStructures(structures);
    const withPlayer = addPlayerSpawn(tiles);
    const withPortal = addPortal(withPlayer);
    const withPadding = addPadding(withPortal);
    const withSpikes = addSpikes(withPadding, levelNumber);
    const withKey = addKey(withSpikes);
    const withChest = addChest(withKey);

    const level: Level = {
      seed,
      width: withChest[0].length,
      height: withChest.length,
      tiles: withChest,
      chestItems,
    };

    return level;
  });

  return {
    name: computeWorldName(date),
    levels,
    palette,
  };
};
