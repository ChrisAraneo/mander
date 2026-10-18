import { round } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { number, string } = P;

const DECIMALS = 4;

export const formatCanvasArgument = (value: unknown): string =>
  match(value)
    .with(number, (amount) => String(round(amount, DECIMALS)))
    .with(string, (text) => text)
    .otherwise(() => 'gradient');
