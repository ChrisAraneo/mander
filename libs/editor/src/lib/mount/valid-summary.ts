import type { ReachMap } from '@mander/engine';
import { type Structure, structureExitLift } from '@mander/generator';

import { plural } from '../utils/plural';
import { strandedNote } from './stranded-note';

export const validSummary = (grid: Structure, reach: ReachMap): string => {
  const lift = structureExitLift(grid);

  return `Crossable both ways. Exit raises the rest of the level by ${lift} ${plural(lift, 'tile')}.${strandedNote(grid, reach)}`;
};
