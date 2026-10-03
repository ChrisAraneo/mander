import { type Layer, VERTICAL_BAND_HEIGHT } from '@mander/structures';
import { take } from 'lodash-es';
import { match } from 'ts-pattern';
import type { LevelType } from '../../types/level-type';

export const cutLayer = (layer: Layer, levelType: LevelType): Layer =>
  match(levelType)
    .with('HORIZONTAL', () => layer)
    .with('VERTICAL', () => take(layer, VERTICAL_BAND_HEIGHT))
    .exhaustive();
