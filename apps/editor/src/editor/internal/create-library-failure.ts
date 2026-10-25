import { constant, get } from 'lodash-es';

export const createLibraryFailure = (response: Response): Promise<never> =>
  response
    .json()
    .then((body: unknown): unknown => get(body, 'message'), constant(undefined))
    .then((message) =>
      Promise.reject(
        new Error(
          String(message ?? `the editor server answered ${response.status}`),
        ),
      ),
    );
