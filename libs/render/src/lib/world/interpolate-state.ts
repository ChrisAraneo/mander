import type { GameState } from '@mander/engine';
import { match } from 'ts-pattern';
import { computeInterpolatedValue } from './internal/compute-interpolated-value';
import { patchInterpolatedEnemyPositions } from './internal/patch-interpolated-enemy-positions';
import { patchInterpolatedPlayerPosition } from './internal/patch-interpolated-player-position';

export const interpolateState = (
  previous: GameState,
  current: GameState,
  alpha: number,
): GameState =>
  match(previous === current || previous.levelIndex !== current.levelIndex)
    .with(true, () => current)
    .otherwise((): GameState => ({
      ...current,
      player: patchInterpolatedPlayerPosition(
        previous.player,
        current.player,
        alpha,
      ),
      enemies: patchInterpolatedEnemyPositions(
        previous.enemies,
        current.enemies,
        alpha,
      ),
      time: computeInterpolatedValue(previous.time, current.time, alpha),
    }));
