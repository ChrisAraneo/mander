import type { Structure } from '@mander/generator';

import { normalize } from './normalize';

export const parseGrid = (text: string): Structure | null => {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) return null;
  const body = text
    .slice(start, end + 1)
    .replaceAll(/,(?<trailing>\s*\])/gu, '$<trailing>');
  try {
    return normalize(JSON.parse(body));
  } catch {
    return null;
  }
};
