import { includes } from 'lodash-es';
import { VERTICAL_LEVELS } from '../consts';

export const isVertical = (levelNumber: number): boolean =>
  includes(VERTICAL_LEVELS, levelNumber);
