import {
  BLOCK,
  BRICK,
  CERAMIC,
  ENEMY,
  SPIKE,
  SPIKE_CEILING,
  STONE,
  WOOD,
} from '@mander/generator';
import { match } from 'ts-pattern';

export const cellClass = (value: number): string =>
  match(value)
    .with(BLOCK, () => 'mat-dirt')
    .with(BRICK, () => 'mat-brick')
    .with(STONE, () => 'mat-stone')
    .with(WOOD, () => 'mat-wood')
    .with(CERAMIC, () => 'mat-ceramic')
    .with(ENEMY, () => 'mat-enemy')
    .with(SPIKE, () => 'mat-spike')
    .with(SPIKE_CEILING, () => 'mat-spike-ceiling')
    .otherwise(() => 'mat-air');
