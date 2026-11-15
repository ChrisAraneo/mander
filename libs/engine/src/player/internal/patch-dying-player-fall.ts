import type { Player } from '@mander/model';
import { pipe } from 'remeda';
import { computeDyingPlayerDrop } from './compute-dying-player-drop';
import { computeDyingPlayerFall } from './compute-dying-player-fall';
import { patchDyingPlayerDrop } from './patch-dying-player-drop';

export const patchDyingPlayerFall = (
  player: Player,
  death: number,
  deltaSeconds: number,
): Player =>
  pipe(
    { player, death, deltaSeconds },
    computeDyingPlayerFall,
    computeDyingPlayerDrop,
    patchDyingPlayerDrop,
  );
