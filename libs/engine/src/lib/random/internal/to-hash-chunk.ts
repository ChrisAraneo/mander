import { padStart } from 'lodash-es';

export const toHashChunk = (value: number): string =>
  padStart(value.toString(36), 7, '0');
