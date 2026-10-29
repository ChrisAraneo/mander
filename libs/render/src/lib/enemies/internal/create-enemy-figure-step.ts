import type { Enemy } from '@mander/model';
import { match } from 'ts-pattern';
import type { CanvasStep } from '../../types/canvas-step';
import { createBeartrapStep } from './create-beartrap-step';
import { createEnemyCreatureStep } from './create-enemy-creature-step';
import type { EnemyPalette } from './types/enemy-palette';

export const createEnemyFigureStep = (
  enemy: Enemy,
  palette: EnemyPalette,
  isDying: boolean,
  time: number,
): CanvasStep =>
  match(enemy.kind)
    .with('BEARTRAP', () =>
      createBeartrapStep(!enemy.statuses.isGrounded || isDying),
    )
    .with('HOPPING', () =>
      createEnemyCreatureStep(enemy, palette, isDying, time),
    )
    .with('HORNED', () =>
      createEnemyCreatureStep(enemy, palette, isDying, time),
    )
    .with('FAST', () => createEnemyCreatureStep(enemy, palette, isDying, time))
    .with('SHOOTER', () =>
      createEnemyCreatureStep(enemy, palette, isDying, time),
    )
    .with('FLYING', () =>
      createEnemyCreatureStep(enemy, palette, isDying, time),
    )
    .exhaustive();
