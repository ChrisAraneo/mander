import { join } from 'lodash-es';
import { createSuffix } from './create-suffix';

export const createRunId = (
  name: string,
  playedAt: string,
  random: () => number,
): string => join([name, playedAt, createSuffix(random)], ':');
