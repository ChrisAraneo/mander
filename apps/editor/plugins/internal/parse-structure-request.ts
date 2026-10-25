import { constant, replace } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { getPool } from '../get-pool.ts';
import { isStructureName } from '../is-structure-name.ts';
import type { StructureRequest } from './types/structure-request.ts';

const { nonNullable, string } = P;

const WINDOWS_LINE_END = /\r\n/g;

const createStructureRequest = (
  name: string,
  text: string,
): StructureRequest | undefined =>
  match({ pool: getPool(name), isNamed: isStructureName(name) })
    .with(
      { pool: nonNullable, isNamed: true },
      ({ pool }): StructureRequest => ({
        name,
        pool,
        text: replace(text, WINDOWS_LINE_END, '\n'),
      }),
    )
    .otherwise(constant(undefined));

export const parseStructureRequest = (
  body: unknown,
): StructureRequest | undefined =>
  match(body)
    .with({ name: string, text: string }, ({ name, text }) =>
      createStructureRequest(name, text),
    )
    .otherwise(constant(undefined));
