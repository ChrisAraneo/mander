import { nth, split } from 'lodash-es';

export const parseStructureNumber = (name: string): number =>
  Number(nth(split(name, '_'), 1) ?? 0);
