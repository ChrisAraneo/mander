import { match, P } from 'ts-pattern';
import { isStructureText } from '../is-structure-text.ts';
import type { Pool } from '../types/pool.ts';
import type { StructurePaths } from '../types/structure-paths.ts';
import { writeStructureFiles } from '../write-structure-files.ts';
import type { StructureRequest } from './types/structure-request.ts';
import type { StructureResponse } from './types/structure-response.ts';

const { when } = P;

const UNNAMED_RESPONSE: StructureResponse = {
  status: 400,
  body: {
    message: 'a structure needs a NORMAL_nnn or HARD_nnn name and a grid',
  },
};

const SHAPELESS_RESPONSE: StructureResponse = {
  status: 400,
  body: { message: 'the grid is not a structure literal' },
};

const writeSavedResponse = (
  paths: StructurePaths,
  name: string,
  pool: Pool,
  text: string,
): Promise<StructureResponse> =>
  writeStructureFiles(paths, name, pool, text).then(
    (saved): StructureResponse => ({ status: 200, body: saved }),
  );

export const writeRequestedStructure = (
  paths: StructurePaths,
  request: StructureRequest | undefined,
): Promise<StructureResponse> =>
  match(request)
    .with(undefined, () => Promise.resolve(UNNAMED_RESPONSE))
    .with({ text: when(isStructureText) }, ({ name, pool, text }) =>
      writeSavedResponse(paths, name, pool, text),
    )
    .otherwise(() => Promise.resolve(SHAPELESS_RESPONSE));
