import { createWorld } from '@mander/generator';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { animationFrames } from 'rxjs';
import { onMounted, onUnmounted, type Ref } from 'vue';
import { logWorldMeta } from '../debug';
import { tryGetLocalStorage } from '../storage';
import { closeGame } from './internal/close-game';
import { createGame } from './internal/create-game';
import { startGame } from './internal/start-game';
import type { Game } from './types/game';

export const useGame = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): Game =>
  pipe(
    new Date(day),
    createWorld,
    (world) =>
      tap(world, () =>
        logWorldMeta(world, window.location.search, console.log),
      ),
    (world) => createGame(world, day, canvas, tryGetLocalStorage()),
    (game) =>
      tap(game, () =>
        onMounted(() => startGame(game, animationFrames(), window)),
      ),
    (game) => tap(game, () => onUnmounted(() => closeGame(game))),
  );
