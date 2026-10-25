import { size } from 'lodash-es';

const LAYER_END = /^ {2}\],$/m;

export const findBoundary = (text: string): number =>
  LAYER_END.exec(text)?.index ?? size(text);
