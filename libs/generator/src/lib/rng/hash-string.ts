import { xmur3 } from './xmur3';

export const hashString = (input: string): string => {
  const hash = xmur3(input);
  return (
    hash().toString(36).padStart(7, '0') + hash().toString(36).padStart(7, '0')
  ).toUpperCase();
};
