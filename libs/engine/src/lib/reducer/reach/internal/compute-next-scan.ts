import { type Player } from '@mander/model';
import { createNextScan } from './create-next-scan';
import { filterLandings } from './filter-landings';
import type { Scan } from './types/scan';
import type { Walk } from './types/walk';

export const computeNextScan = (
  walk: Walk,
  scan: Scan,
  states: Player[],
): Scan =>
  createNextScan(walk, scan, states, filterLandings(scan.visited, states));
