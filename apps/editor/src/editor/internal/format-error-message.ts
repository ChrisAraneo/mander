import { match, P } from 'ts-pattern';

const { instanceOf } = P;

export const formatErrorMessage = (error: unknown): string =>
  match(error)
    .with(instanceOf(Error), (thrown) => thrown.message)
    .otherwise((thrown) => String(thrown));
