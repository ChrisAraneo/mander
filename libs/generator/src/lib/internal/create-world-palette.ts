import type { Random } from '@mander/engine';
import { createPalette } from '../palette/create-palette';
import type { WorldPalette } from './types/world-palette';

export const createWorldPalette = ({
  name,
  random,
}: {
  name: string;
  random: Random;
}): WorldPalette => ({
  name,
  palette: createPalette(random),
  random,
});
