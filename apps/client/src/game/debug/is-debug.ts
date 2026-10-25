const DEBUG_PARAM = 'debug';

export const isDebug = (search: string): boolean =>
  new URLSearchParams(search).has(DEBUG_PARAM);
