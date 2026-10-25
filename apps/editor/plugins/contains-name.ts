import { includes } from 'lodash-es';
import { splitNames } from './split-names.ts';

export const containsName = (list: string, name: string): boolean =>
  includes(splitNames(list), name);
