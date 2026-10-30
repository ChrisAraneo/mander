import type { Random } from '@mander/engine';
import type { Season } from '@mander/model';
import { createPalette } from '../palette/create-palette';
import type { StructureChoice } from '../types/structure-choice';
import type { StructureWorldPalette } from './types/structure-world-palette';

export const createStructureWorldPalette = ({
  choice,
  season,
  random,
}: {
  choice: StructureChoice;
  season: Season;
  random: Random;
}): StructureWorldPalette => ({
  choice,
  season,
  palette: createPalette(season, random),
  random,
});
