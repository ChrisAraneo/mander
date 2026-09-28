import { match } from 'ts-pattern';
import type { Spot } from '../../find-standing-spots';
import type { LevelType } from '../../get-level-type';
import { isColumnApart } from './is-column-apart';
import { isSpotApart } from './is-spot-apart';

export const isGemApart = (
  levelType: LevelType,
  picked: Spot[],
  candidate: Spot,
) =>
  match(levelType)
    .with('HORIZONTAL', () => isColumnApart(picked, candidate))
    .with('VERTICAL', () => isSpotApart(picked, candidate))
    .exhaustive();
