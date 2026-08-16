import {
  createInitialState,
  type GameState,
  unpackReplay,
} from '@mander/engine';
import { generate } from '@mander/generator';
import { renderGame, syncViewport } from '@mander/render';
import { chain, withEffect } from '@mander/utils';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref } from 'vue';

import {
  type CanvasCell,
  createCanvasCell,
  openCanvas,
  withCanvas,
} from '../canvas';
import { useReplay } from '../use-replay';
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
    }))
    .thru((setup) => ({
      ...setup,
      renderState: (next: GameState): void =>
        withCanvas(setup.cell, canvas, (context, element) =>
          renderGame(context, next, setup.world.palette, syncViewport(element)),
        ),
    }))
    .thru((setup) => ({
      ...setup,
      replay: useReplay({
        replay: () => setup.recording,
        initialState: () => createInitialState(setup.world.levels[0], 0, []),
        render: setup.renderState,
        onStop: noop,
      }),
    }))
    .thru((setup) =>
      withEffect(setup, () =>
        onMounted(() => playOnMount(setup.cell, canvas, setup.replay)),
      ),
    )
    .thru((setup) =>
      withEffect(setup, () => onUnmounted(() => setup.replay.stop())),
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
