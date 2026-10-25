import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { createStructureRequest } from './create-structure-request.ts';
import type { StructureRequest } from './types/structure-request.ts';

const { string } = P;

export const parseStructureRequest = (
  body: unknown,
): StructureRequest | undefined =>
  match(body)
    .with({ name: string, text: string }, ({ name, text }) =>
      createStructureRequest(name, text),
    )
    .otherwise(constant(undefined));
