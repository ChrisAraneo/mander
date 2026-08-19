import { match } from 'ts-pattern';

export const withEffect = <T>(value: T, effect: (value: T) => void): T =>
  match(effect(value)).otherwise(() => value);
