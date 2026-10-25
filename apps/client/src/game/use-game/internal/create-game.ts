import { type Action, createRecorder } from '@mander/engine';
import type { RenderedWorld } from '@mander/render';
import { pipe } from 'remeda';
import { animationFrames, Subject, type Subscription } from 'rxjs';
import { type Ref, shallowRef } from 'vue';
import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { findGhostRuns, readSave } from '../../storage';
import { createStartState, useReplay } from '../../use-replay';
import type { Game } from '../types/game';
import { createGameStartFrame } from './create-game-start-frame';

export const createGame = (
  world: RenderedWorld,
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
  storage: Storage | undefined,
): Game =>
  pipe(
    createStartState(world.levels, world.score),
    (initial) => ({
      initial,
      state: shallowRef(initial),
      recorder: shallowRef(createRecorder(world.name)),
    }),
    ({ initial, state, recorder }): Game => ({
      world,
      day,
      storage,
      state,
      frame: shallowRef(createGameStartFrame(initial)),
      actions: new Subject<Action>(),
      recorder,
      isRunSaved: shallowRef(false),
      keyboard: shallowRef<Keyboard | null>(null),
      subscription: shallowRef<Subscription | null>(null),
      replay: useReplay(
        { kind: 'GAME', recorder, state },
        {
          cell: createCanvasCell(canvas),
          palette: world.palette,
          levels: world.levels,
          score: world.score,
          rivals: findGhostRuns(readSave(storage), world.name, ''),
          frames: animationFrames(),
        },
      ),
    }),
  );
