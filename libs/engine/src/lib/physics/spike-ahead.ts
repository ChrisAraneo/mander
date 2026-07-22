import { some } from 'lodash-es';
import { isSpike, type Level } from '@mander/generator';
import { probeColumn, probeRows } from './enemy-probe';

export const spikeAhead = (level: Level, originX: number, originY: number, facing: 1 | -1): boolean =>
  some(probeRows(originY), (row) => isSpike(level, probeColumn(originX, facing), row));
