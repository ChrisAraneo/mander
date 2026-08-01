import { computeSeeds } from './seed/compute-seeds';

export const generate = (date: Date) => {
  const seeds = computeSeeds(date);
  const levels = seeds.map((seed, index) => {
    const difficulty = index >= 4 ? 'hard' : 'normal';
    const structures = pickStructures(seed, difficulty);
    const level = joinStructures(structures);

    return level;
  });
};
