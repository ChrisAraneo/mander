import { match } from 'ts-pattern';

export const plural = (count: number, noun: string): string =>
  match(count)
    .with(1, () => noun)
    .otherwise(() => `${noun}s`);
