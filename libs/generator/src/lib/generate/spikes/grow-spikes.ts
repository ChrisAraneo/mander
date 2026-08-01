import type { Tile } from '@mander/engine';
import { flow } from 'lodash-es';

import { breakLongRuns } from './break-long-runs';
import { dropLoneSpikes } from './drop-lone-spikes';
import { dropSqueezedSpikes } from './drop-squeezed-spikes';
import { dropWalledSpikes } from './drop-walled-spikes';
import { sowSpikes } from './sow-spikes';

/**
 * Spikes are grown, not placed: sow them over every block that can carry one,
 * then take back the ones that make the level worse. Each rule reads the whole
 * grid the one before it left, in the order they are written down.
 */
export const growSpikes: (tiles: Tile[][]) => Tile[][] = flow([
  sowSpikes,
  breakLongRuns,
  dropLoneSpikes,
  dropWalledSpikes,
  dropSqueezedSpikes,
]);
