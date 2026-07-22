import type { Structure } from '@mander/generator';
import { normalize } from './normalize';

export function parseGrid(text: string): Structure | null {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start < 0 || end < 0) return null;
  const body = text.slice(start, end + 1).replace(/,(\s*[\]])/g, '$1');
  try {
    return normalize(JSON.parse(body));
  } catch {
    return null;
  }
}
