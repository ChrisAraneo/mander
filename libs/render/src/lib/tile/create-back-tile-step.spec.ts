import { type Level, TILE_AIR, TILE_BRICK, TILE_DIRT, TILE_SIZE, chain } from '@mander/model';
import { dropRight, flatMap, last, reduce, reverse, some, tap } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { createRenderTestLevel } from '../../test/create-render-test-level';
import { drawRecorded } from '../../test/draw-recorded';
import type { CanvasCall } from '../../test/types/canvas-call';
import { draw } from '../canvas/draw';
import { BACK_SHADE } from '../material/consts';
import { getMaterialStyle } from '../material/get-material-style';
import { STROKE_COLOR } from '../stroke/consts';
import type { MaterialStyle } from '../types/material-style';
import { createBackTileStep } from './create-back-tile-step';
import { isSolidAt } from './is-solid-at';

interface Fill {
  style: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FillState {
  style: string;
  stack: string[];
  fills: Fill[];
}

const EMPTY_STATE: FillState = { style: '', stack: [], fills: [] };

const patchFillState = (state: FillState, call: CanvasCall): FillState =>
  match(call.name)
    .with('set fillStyle', (): FillState => ({
      ...state,
      style: String(call.args[0]),
    }))
    .with('save', (): FillState => ({
      ...state,
      stack: [...state.stack, state.style],
    }))
    .with('restore', (): FillState => ({
      ...state,
      style: last(state.stack) ?? state.style,
      stack: dropRight(state.stack),
    }))
    .with('fillRect', (): FillState => ({
      ...state,
      fills: [
        ...state.fills,
        {
          style: state.style,
          x: Number(call.args[0]),
          y: Number(call.args[1]),
          width: Number(call.args[2]),
          height: Number(call.args[3]),
        },
      ],
    }))
    .otherwise(() => state);

const drawFills = (
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): Fill[] =>
  chain(createRecordingContext())
    .thru((recording) =>
      tap(recording, ({ context }) =>
        draw(context, createBackTileStep(level, column, row, style)),
      ),
    )
    .thru(({ calls }) => reduce(calls, patchFillState, EMPTY_STATE).fills)
    .value();

const createBackLevel = (backTile: number): Level => ({
  seed: '',
  width: 1,
  height: 1,
  tiles: [[TILE_AIR]],
  backTiles: [[backTile]],
  chestItems: [],
});

const drawBackFills = (backTile: number): Fill[] =>
  drawFills(createBackLevel(backTile), 0, 0, getMaterialStyle(backTile));

const isCovering = (fill: Fill): boolean =>
  fill.x === 0 &&
  fill.y === 0 &&
  fill.width === TILE_SIZE &&
  fill.height === TILE_SIZE;

describe('createBackTileStep', () => {
  it('should lay the material down solid when it paints a background tile, so the sky is not seen through the level', () => {
    const [base] = drawBackFills(TILE_BRICK);

    expect(base?.style).toBe(getMaterialStyle(TILE_BRICK).base);
    expect(isCovering(base)).toBe(true);
  });

  it('should shade the whole tile down last when it paints a background tile, which is what sends it to the back', () => {
    const [shade] = reverse([...drawBackFills(TILE_BRICK)]);

    expect(shade?.style).toBe(BACK_SHADE);
    expect(isCovering(shade)).toBe(true);
  });

  it('should draw no border when the tile belongs to the back layer', () => {
    expect(
      some(
        flatMap([TILE_BRICK, TILE_DIRT], drawBackFills),
        (fill) => fill.style === STROKE_COLOR,
      ),
    ).toBe(false);
  });

  it('should cap the background block when nothing stands over it', () => {
    expect(
      some(
        drawBackFills(TILE_DIRT),
        (fill) => fill.style === getMaterialStyle(TILE_DIRT).cap,
      ),
    ).toBe(true);
  });

  it('should leave the cap off when the front layer stands over it', () => {
    const covered: Level = {
      seed: '',
      width: 1,
      height: 2,
      tiles: [[TILE_BRICK], [TILE_AIR]],
      backTiles: [[TILE_AIR], [TILE_DIRT]],
      chestItems: [],
    };

    expect(isSolidAt(covered, 0, 0)).toBe(true);
    expect(
      some(
        drawFills(covered, 0, 1, getMaterialStyle(TILE_DIRT)),
        (fill) => fill.style === getMaterialStyle(TILE_DIRT).cap,
      ),
    ).toBe(false);
  });

  it('should draw the brick, its cap and the shade in order when a back tile has open air above it', () => {
    const level = createRenderTestLevel(['.'], ['B']);

    const calls = drawRecorded(
      createBackTileStep(level, 0, 0, getMaterialStyle(TILE_BRICK)),
    );

    expect(calls).toEqual([
      'save()',
      'set fillStyle(#9C4F3F)',
      'fillRect(0, 0, 32, 32)',
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(0, 8, 32, 1)',
      'fillRect(0, 16, 32, 1)',
      'fillRect(0, 24, 32, 1)',
      'fillRect(16, 0, 1, 8)',
      'fillRect(8, 8, 1, 8)',
      'fillRect(16, 16, 1, 8)',
      'fillRect(8, 24, 1, 8)',
      'set fillStyle(#B25C49)',
      'fillRect(0, 0, 32, 7)',
      'set fillStyle(#C86E59)',
      'fillRect(0, 0, 32, 3)',
      'restore()',
      'set fillStyle(RGBA(15, 13, 22, 0.46))',
      'fillRect(0, 0, 32, 32)',
    ]);
  });
});
