import type { createRandom } from '@mander/utils';
import { createPalette } from '../palette/create-palette';

export const createWorldPalette = ({
  name,
  random,
}: {
  name: string;
  random: ReturnType<typeof createRandom>;
}) => ({
  name,
  palette: createPalette(random),
  random,
});
