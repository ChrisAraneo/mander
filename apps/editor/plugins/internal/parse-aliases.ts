import { map, uniq } from 'lodash-es';

const TOKEN = /[A-Za-z_][A-Za-z0-9_]*/g;

export const parseAliases = (text: string): string[] =>
  uniq(map([...text.matchAll(TOKEN)], ([alias]) => alias));
