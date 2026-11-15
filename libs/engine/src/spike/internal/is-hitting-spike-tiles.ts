import type { Level, Rectangle } from '@mander/model';
import { some } from 'lodash-es';
import { computeBoxTiles } from '../../collision/compute-box-tiles';
import { isHittingSpikeTile } from './is-hitting-spike-tile';

export const isHittingSpikeTiles = (level: Level, box: Rectangle): boolean =>
  some(computeBoxTiles(box), (tile) => isHittingSpikeTile(level, box, tile));
