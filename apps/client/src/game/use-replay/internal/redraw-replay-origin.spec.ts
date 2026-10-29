import { createRecorder, type GameLevel, type Replay } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import { createReplaySession } from '../create-replay-session';
import { createStartState } from '../create-start-state';
import type { ReplayOrigin } from '../types/replay-origin';
import type { ReplaySession } from '../types/replay-session';
import { redrawReplayOrigin } from './redraw-replay-origin';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
};

const RECORDING: Replay = { worldName: 'ABC', steps: 10, entries: [] };

const CONTEXT = {} as unknown as CanvasRenderingContext2D;

const createSession = (
  origin: ReplayOrigin,
  canvas: HTMLCanvasElement | null,
): ReplaySession =>
  createReplaySession(origin, {
    cell: createCanvasCell(ref(canvas)),
    palette: {} as unknown as Palette,
    levels: [LEVEL],
    score: 0,
    rivals: [],
    frames: NEVER,
  });

describe('redrawReplayOrigin', () => {
  it('should draw nothing when the game canvas is not mounted', () => {
    const session = createSession(
      {
        kind: 'GAME',
        recorder: shallowRef(createRecorder('ABC')),
        state: shallowRef(createStartState([LEVEL], 0)),
      },
      null,
    );

    expect(redrawReplayOrigin(session)).toBeUndefined();
  });

  it('should leave the canvas alone when the game canvas has no drawing context yet', () => {
    const canvas = {} as unknown as HTMLCanvasElement;
    const session = createSession(
      {
        kind: 'GAME',
        recorder: shallowRef(createRecorder('ABC')),
        state: shallowRef(createStartState([LEVEL], 0)),
      },
      canvas,
    );

    redrawReplayOrigin(session);

    expect(canvas).toEqual({});
  });

  it('should leave the canvas alone when the replay comes from the archive', () => {
    const canvas = {} as unknown as HTMLCanvasElement;
    const session = createSession(
      { kind: 'ARCHIVE', recording: RECORDING },
      canvas,
    );
    session.stage.cell.context.value = CONTEXT;

    redrawReplayOrigin(session);

    expect(canvas).toEqual({});
    expect(CONTEXT).toEqual({});
  });
});
