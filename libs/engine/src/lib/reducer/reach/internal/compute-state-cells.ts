import { type Level, type Player } from '@mander/model';
import { computeBodyCells } from './compute-body-cells';
import { computeFootingCells } from './compute-footing-cells';

export const computeStateCells = (level: Level, player: Player): number[] => [
  ...computeBodyCells(level, player),
  ...computeFootingCells(level, player),
];
