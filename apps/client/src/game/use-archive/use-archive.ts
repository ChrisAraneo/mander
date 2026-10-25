import { parseReplay } from '@mander/engine';
import { createWorld } from '@mander/generator';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { animationFrames } from 'rxjs';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref } from 'vue';
import { createCanvasCell, initializeCanvas } from '../canvas';
import { findGhostRuns, readSave, tryGetLocalStorage } from '../storage';
import {
  startReplay,
  type ReplaySession,
  finishReplay,
  useReplay,
} from '../use-replay';
import type { ArchiveSource } from './types/archive-source';

const { nonNullable } = P;

const startArchiveReplay = (session: ReplaySession): ReplaySession =>
  match(initializeCanvas(session.stage.cell))
    .with(nonNullable, () => startReplay(session))
    .otherwise(() => session);

export const useArchive = (
  source: ArchiveSource,
  canvas: Ref<HTMLCanvasElement | null>,
): ReplaySession =>
  pipe(
    new Date(source.day),
    createWorld,
    (world) =>
      useReplay(
        {
          kind: 'ARCHIVE',
          recording: parseReplay(source.replay, world.levels),
        },
        {
          cell: createCanvasCell(canvas),
          palette: world.palette,
          levels: world.levels,
          score: 0,
          rivals: findGhostRuns(
            readSave(tryGetLocalStorage()),
            world.name,
            source.id,
          ),
          frames: animationFrames(),
        },
      ),
    (session) =>
      tap(session, () => onMounted(() => startArchiveReplay(session))),
    (session) => tap(session, () => onUnmounted(() => finishReplay(session))),
  );
