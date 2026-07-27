import { type Structure, AIR } from '@mander/generator';
import { match } from 'ts-pattern';
import { chain, noop } from 'lodash-es';
import { CELL, COLORS } from '../config/constants';

export const drawBlockCell = (
  context: CanvasRenderingContext2D,
  grid: Structure,
  row: number,
  column: number,
): void =>
  chain({
    x: column * CELL,
    y: row * CELL,
  })
    .tap(({ x, y }) => {
      context.fillStyle = COLORS.block;
      context.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
    })
    .thru(({ x, y }) =>
      match(row === 0 || grid[row - 1][column] === AIR)
        .with(true, () => {
          context.fillStyle = COLORS.cap;
          context.fillRect(x + 1, y + 1, CELL - 2, 4);
        })
        .otherwise(noop),
    )
    .value();
