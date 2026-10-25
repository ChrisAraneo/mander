import type { IncomingMessage } from 'node:http';
import { buffer } from 'node:stream/consumers';

export const readRequestBody = (request: IncomingMessage): Promise<string> =>
  buffer(request).then((body) => body.toString('utf8'));
