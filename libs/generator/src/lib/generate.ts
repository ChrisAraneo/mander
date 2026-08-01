import type { Level } from '@mander/model';
import { computeSeeds } from './seed/compute-seeds';
import { addPadding } from './structures/add-padding';
import { addPlayerSpawn } from './structures/add-player-spawn';
import { addPortal } from './structures/add-portal';
import { addSpikes } from './structures/add-spikes';
import { generatePalette } from './structures/generate-palette';
import { joinStructures } from './structures/join-structures';
import { pickStructures } from './structures/pick-structures';
import { addKey } from './structures/add-key';
import { generateChestItems } from './structures/generate-chest-items';

export const generate = (date: Date): Level[] => {
  const seeds = computeSeeds(date);
  const levels: Level[] = seeds.map((seed, index) => {
    const levelNumber = index + 1;
    const difficulty = levelNumber + 1 >= 4 ? 'hard' : 'normal';
    const palette = generatePalette(seed);
    const chestItems = generateChestItems(seed);

    const structures = pickStructures(seed, difficulty);
    const tiles = joinStructures(structures);
    const withPlayer = addPlayerSpawn(tiles);
    const withPortal = addPortal(withPlayer);
    const withKey = addKey(withPortal);
    const withPadding = addPadding(withKey);
    const withSpikes = addSpikes(withPadding, levelNumber);
    
    const level: Level = {
      seed,
      width: withSpikes[0].length,
      height: withSpikes.length,
      tiles: withSpikes,
      palette,
      chestItems,
    };

    return level;
  });

  return levels;
};
