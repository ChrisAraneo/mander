import { type Level, MAX_TICK_SECONDS, type Player } from '@mander/model';
import { min } from 'lodash-es';
import { patchDyingPlayerStep } from './internal/patch-dying-player-step';

export const patchDyingPlayer = (
  level: Level,
  player: Player,
  death: number,
  elapsedSeconds: number,
): Player =>
  patchDyingPlayerStep(
    level,
    player,
    death,
    min([elapsedSeconds, MAX_TICK_SECONDS]),
  );
