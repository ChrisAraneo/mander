import { match } from 'ts-pattern';
import type { LevelType } from '../../types/level-type';
import type { Spot } from '../../types/spot';
import { isColumnApart } from './is-column-apart';
import { isSpotApart } from './is-spot-apart';

export const isGemApart = (
  levelType: LevelType,
  picked: Spot[],
  candidate: Spot,
): boolean =>
  match(levelType)
    .with('HORIZONTAL', () => isColumnApart(picked, candidate))
    .with('VERTICAL', () => isSpotApart(picked, candidate))
    .exhaustive();
