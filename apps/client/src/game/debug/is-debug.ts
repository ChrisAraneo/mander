import { DEBUG_PARAM } from './consts';

export const isDebug = (): boolean =>
  new URLSearchParams(window.location.search).has(DEBUG_PARAM);
