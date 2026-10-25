import { DEBUG_PARAM } from './consts';

export const isDebug = (search: string): boolean =>
  new URLSearchParams(search).has(DEBUG_PARAM);
