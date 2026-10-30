import type { Random } from '@mander/engine';
import type { Season } from '@mander/model';
import { createPalette } from '../palette/create-palette';
import type { WorldPalette } from './types/world-palette';

export const createWorldPalette = ({
  name,
  season,
  random,
}: {
  name: string;
  season: Season;
  random: Random;
}): WorldPalette => ({
  name,
  season,
  palette: createPalette(season, random),
  random,
});
