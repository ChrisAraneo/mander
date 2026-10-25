import { TILE_AIR, TILE_DIRT, TILE_SIZE } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { filter, head, map, tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawStructure } from './draw-structure';

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

const SKETCH = {
  tiles: [
    [STRUCTURE_START, TILE_AIR, STRUCTURE_END],
    [TILE_DIRT, TILE_DIRT, TILE_DIRT],
  ],
  backTiles: [
    [TILE_AIR, TILE_AIR, TILE_AIR],
    [TILE_AIR, TILE_AIR, TILE_AIR],
  ],
};

describe('drawStructure', () => {
  it('should clear the whole sector first and give the context back when it draws', () => {
    const calls: CanvasCall[] = [];
    const context = createRecordingContext(calls);

    expect(drawStructure(context, SKETCH)).toBe(context);
    expect(head(calls)).toEqual({
      name: 'clearRect',
      args: [0, 0, 3 * TILE_SIZE, 2 * TILE_SIZE],
    });
  });

  it('should letter the start and the end when the sector marks them', () => {
    const calls: CanvasCall[] = [];

    drawStructure(createRecordingContext(calls), SKETCH);

    expect(
      map(
        filter(calls, (call) => call.name === 'fillText'),
        (call) => call.args[0],
      ),
    ).toEqual(['S', 'E']);
  });

  it('should only clear the canvas when the sketch is empty', () => {
    const calls: CanvasCall[] = [];

    drawStructure(createRecordingContext(calls), { tiles: [], backTiles: [] });

    expect(head(calls)).toEqual({ name: 'clearRect', args: [0, 0, 0, 0] });
    expect(filter(calls, (call) => call.name === 'fillText')).toEqual([]);
  });
});
