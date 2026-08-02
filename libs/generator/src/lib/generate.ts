import type { Level } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
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

export const generate = (date: Date): RenderedWorld => {
  const worldName = computeWorldName(date);
  const seeds = computeLevelSeeds(date);
  const palette = generatePalette(worldName);

  const levels: Level[] = seeds.map((seed, index) => {
    const levelNumber = index + 1;
    const difficulty = levelNumber >= FIRST_HARD_LEVEL ? 'hard' : 'normal';

    const chestItems = generateChestItems(seed);

    const structures = pickStructures(seed, difficulty);
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
