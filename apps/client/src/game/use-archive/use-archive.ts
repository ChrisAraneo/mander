import {
  createInitialState,
  type GameState,
  unpackReplay,
} from '@mander/engine';
import { generate } from '@mander/generator';
import { renderGame, syncViewport } from '@mander/render';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref } from 'vue';

import { useReplay } from '../use-replay';
import type { ReplayController } from '../use-replay';
import type { ArchiveSource } from './archive-source';

export const useArchive = (
  source: ArchiveSource,
  canvas: Ref<HTMLCanvasElement | null>,
): ReplayController => {
  const world = generate(new Date(source.day));
  const { levels, palette } = world;
  const recording = unpackReplay(source.replay, levels);

  let context: CanvasRenderingContext2D | null = null;

  const renderState = (next: GameState): void =>
    match({ element: canvas.value, context })
      .with(
        { element: P.nonNullable, context: P.nonNullable },
        ({ element, context }) =>
          renderGame(context, next, palette, syncViewport(element)),
      )
      .otherwise(() => undefined);

  const replay = useReplay({
    replay: () => recording,
    initialState: () => createInitialState(levels[0], 0, []),
    render: renderState,
    onStop: () => undefined,
  });

  onMounted(() => {
    const element = canvas.value;
    context = element?.getContext('2d') ?? null;
    match({ element, context })
      .with({ element: P.nonNullable, context: P.nonNullable }, () =>
        replay.play(),
      )
      .otherwise(() => undefined);
  });

  onUnmounted(() => replay.stop());

  return replay;
};
