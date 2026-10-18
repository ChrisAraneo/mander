import type { Enemy } from '@mander/model';
import { draw } from '../canvas/draw';
import { createEnemyStep } from './create-enemy-step';

export const drawEnemy = (
  context: CanvasRenderingContext2D,
  enemy: Enemy,
  time: number,
): void => draw(context, createEnemyStep(enemy, time));
