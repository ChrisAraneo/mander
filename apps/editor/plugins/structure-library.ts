import type { IncomingMessage, ServerResponse } from 'node:http';

import { chain, withEffect } from '@mander/utils';
import { assign } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Plugin } from 'vite';

import {
  type Difficulty,
  difficultyOf,
  isStructureName,
} from './difficulty.ts';
import { isStructureText } from './is-structure-text.ts';
import { readLibrary } from './read-library.ts';
import { saveStructure } from './save-structure.ts';
import { structurePaths, type StructurePaths } from './structure-paths.ts';

const { string } = P;

export const STRUCTURE_ENDPOINT = '/api/structures';

interface SaveRequest {
  name: string;
  difficulty: Difficulty;
  text: string;
}

const send = (res: ServerResponse, status: number, body: unknown): void =>
  void chain(assign(res, { statusCode: status }))
    .thru((ready) =>
      withEffect(ready, () =>
        ready.setHeader('content-type', 'application/json'),
      ),
    )
    .thru((ready) => ready.end(JSON.stringify(body)))
    .value();

/** Collects the request stream into one string; the chunks are the state. */
const readBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) =>
    chain({ chunks: [] as Buffer[] })
      .thru((cell) =>
        withEffect(cell, () =>
          req.on('data', (chunk: Buffer) => cell.chunks.push(chunk)),
        ),
      )
      .thru((cell) =>
        withEffect(cell, () =>
          req.on('end', () =>
            resolve(Buffer.concat(cell.chunks).toString('utf8')),
          ),
        ),
      )
      .thru(() => req.on('error', reject))
      .value(),
  );

const requested = (body: string): SaveRequest | null =>
  match(JSON.parse(body) as unknown)
    .with({ name: string, text: string }, ({ name, text }) =>
      match(difficultyOf(name))
        .with(null, (): SaveRequest | null => null)
        .otherwise((difficulty): SaveRequest | null =>
          isStructureName(name)
            ? { name, difficulty, text: text.replace(/\r\n/g, '\n') }
            : null,
        ),
    )
    .otherwise((): SaveRequest | null => null);

const save = (
  paths: StructurePaths,
  res: ServerResponse,
  body: string,
): Promise<void> | void =>
  match(requested(body))
    .with(null, () =>
      send(res, 400, {
        message: 'a structure needs a NORMAL_nnn or HARD_nnn name and a grid',
      }),
    )
    .otherwise(({ name, difficulty, text }) =>
      match(isStructureText(text))
        .with(false, () =>
          send(res, 400, { message: 'the grid is not a structure literal' }),
        )
        .otherwise(async () =>
          send(res, 200, await saveStructure(paths, name, difficulty, text)),
        ),
    );

const handle = async (
  paths: StructurePaths,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> =>
  match(req.method)
    .with('GET', async () => send(res, 200, await readLibrary(paths)))
    .with('POST', async () => save(paths, res, await readBody(req)))
    .otherwise(() => send(res, 405, { message: 'GET or POST only' }));

export const structureLibrary = (): Plugin => ({
  name: 'mander:structure-library',
  configureServer(server) {
    const paths = structurePaths(server.config.root);

    server.middlewares.use(STRUCTURE_ENDPOINT, (req, res) => {
      handle(paths, req, res).catch((error: unknown) =>
        send(res, 500, { message: String(error) }),
      );
    });
  },
});
