import { trimEnd } from 'lodash-es';

export const addDeclaration = (source: string, declaration: string): string =>
  `${trimEnd(source)}\n\n${declaration}\n`;
