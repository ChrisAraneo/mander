import {
  createInitialState,
  type GameState,
  type Replay,
  unpackReplay,
} from '@mander/engine';
import { generate } from '@mander/generator';
import { getPlayerFocus, renderGame, syncViewport } from '@mander/render';
import { chain, tapEffect } from '@mander/utils';
import { map, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref } from 'vue';

import {
  type CanvasCell,
  createCanvasCell,
  drawWithCanvas,
  openCanvas,
} from '../canvas';
import { findGhostRuns, loadSave } from '../storage';
import { getLevelGhosts, useReplay } from '../use-replay';
import type { ReplayController } from '../use-replay';
import type { ArchiveSource } from './archive-source';

const { nonNullable } = P;

export const useArchive = (
  source: ArchiveSource,
  canvas: Ref<HTMLCanvasElement | null>,
): ReplayController =>
  chain(generate(new Date(source.day)))
    .thru((world) => ({
      world,
      cell: createCanvasCell(),
      recording: unpackReplay(source.replay, world.levels),
      rivals: findGhostRuns(loadSave(), world.name, source.id),
    }))
    .thru((setup) => ({
      ...setup,
      renderState: (next: GameState, ghosts: GameState[] = []): void =>
        drawWithCanvas(setup.cell, canvas, (context, element) =>
          renderGame(
            context,
            next,
            setup.world.palette,
            syncViewport(element),
            getPlayerFocus(next),
            getLevelGhosts(next, ghosts),
          ),
        ),
    }))
    .thru((setup) => ({
      ...setup,
      replay: useReplay({
        getReplay: () => setup.recording,
        getGhosts: (): Replay[] =>
          map(setup.rivals, (run) =>
            unpackReplay(run.replay, setup.world.levels),
          ),
        getInitialState: () => createInitialState(setup.world.levels[0], 0, []),
        render: setup.renderState,
        handleStop: noop,
      }),
    }))
    .thru((setup) =>
      tapEffect(setup, () =>
        onMounted(() => playOnMount(setup.cell, canvas, setup.replay)),
      ),
    )
    .thru((setup) =>
      tapEffect(setup, () => onUnmounted(() => setup.replay.stop())),
    )
    .thru(({ replay }) => replay)
    .value();

const playOnMount = (
  cell: CanvasCell,
  canvas: Ref<HTMLCanvasElement | null>,
  replay: ReplayController,
): void =>
  match(openCanvas(cell, canvas))
    .with(nonNullable, () => replay.play())
    .otherwise(noop);
