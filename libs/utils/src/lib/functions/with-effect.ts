import { match } from 'ts-pattern';

/**
 * Runs `effect` for its side effect and hands the value straight back, so a
 * pipeline can carry out an effect mid-chain without breaking into statements.
 * Keep it for edge work — subscriptions, rendering, storage — not for shaping
 * data, which the surrounding steps should stay pure enough to do themselves.
 */
export const withEffect = <T>(value: T, effect: (value: T) => void): T =>
  match(effect(value)).otherwise(() => value);
