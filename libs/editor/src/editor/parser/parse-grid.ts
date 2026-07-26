import type { Structure } from '@mander/generator';
import { match, P } from 'ts-pattern';
import { extractGridBody } from './extract-grid-body';

import { parseBody } from './parse-body';

const { nullish } = P;

export const parseGrid = (text: string): Structure | null =>
  match(extractGridBody(text))
    .with(nullish, () => null)
    .otherwise(parseBody);
