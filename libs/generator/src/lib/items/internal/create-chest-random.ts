import { createRandom } from '@mander/utils';
import { formatChestSeed } from './format-chest-seed';

export const createChestRandom = ({ seed }: { seed: string }) => ({
  random: createRandom(formatChestSeed(seed)),
});
