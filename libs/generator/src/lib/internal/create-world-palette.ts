import type { createRandom } from '@mander/engine';
import { createPalette } from '../palette/create-palette';
import type { WorldPalette } from './types/world-palette';

export const createWorldPalette = ({
  name,
  random,
}: {
  name: string;
  random: ReturnType<typeof createRandom>;
}): WorldPalette => ({
  name,
  palette: createPalette(random),
  random,
});
