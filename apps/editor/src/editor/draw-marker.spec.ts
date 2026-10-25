import { TILE_SIZE } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { filter, find, last, map, tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawMarker } from './draw-marker';

interface CanvasCall {
  name: string;
  args: unknown[];
}

const createRecordingContext = (
  calls: CanvasCall[],
): CanvasRenderingContext2D =>
  new Proxy(
    {},
    {
      get:
        (_, name, receiver) =>
        (...args: unknown[]): unknown =>
          tap(receiver, () => calls.push({ name: String(name), args })),
      set: (_, name, value) =>
        tap(true, () =>
          calls.push({ name: `set ${String(name)}`, args: [value] }),
        ),
    },
  ) as unknown as CanvasRenderingContext2D;

const drawRecorded = (
  cell: number,
  row: number,
  column: number,
): CanvasCall[] =>
  tap([], (calls: CanvasCall[]) =>
    drawMarker(createRecordingContext(calls), cell, row, column),
  );

describe('drawMarker', () => {
  it('should shade the cell and letter it S when the marker is the start', () => {
    const calls = drawRecorded(STRUCTURE_START, 2, 3);

    expect(find(calls, { name: 'fillRect' })?.args).toEqual([
      3 * TILE_SIZE,
      2 * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
    ]);
    expect(find(calls, { name: 'fillText' })?.args[0]).toBe('S');
  });

  it('should letter the cell E in its own colour when the marker is the end', () => {
    const calls = drawRecorded(STRUCTURE_END, 0, 0);
    const start = drawRecorded(STRUCTURE_START, 0, 0);

    expect(find(calls, { name: 'fillText' })?.args[0]).toBe('E');
    expect(find(calls, { name: 'set fillStyle' })?.args).not.toEqual(
      find(start, { name: 'set fillStyle' })?.args,
    );
  });

  it('should draw inside a saved state when it draws', () => {
    const names = map(drawRecorded(STRUCTURE_START, 0, 0), (call) => call.name);

    expect(names[0]).toBe('save');
    expect(last(names)).toBe('restore');
    expect(filter(names, (name) => name === 'strokeRect')).toHaveLength(1);
  });
});
