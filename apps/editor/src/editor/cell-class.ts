import {
  BRICK,
  CERAMIC,
  ENEMY,
  SPIKE,
  SPIKE_CEILING,
  STONE,
  WOOD,
} from '@mander/generator';
import { match } from 'ts-pattern';

/**
 * Pattern overlay for a cell. Material base colours come from `cellStyle`;
 * these classes only add the texture that identifies the material.
 */
export const cellClass = (value: number): string =>
  match(value)
    .with(BRICK, () => 'mat-brick')
    .with(STONE, () => 'mat-stone')
    .with(WOOD, () => 'mat-wood')
    .with(CERAMIC, () => 'mat-ceramic')
    .with(ENEMY, () => 'mat-enemy')
    .with(SPIKE, () => 'mat-spike')
    .with(SPIKE_CEILING, () => 'mat-spike-ceiling')
    .otherwise(() => 'mat-air');
