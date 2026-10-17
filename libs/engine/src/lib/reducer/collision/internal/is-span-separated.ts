import type { Span } from './types/span';

export const isSpanSeparated = (span: Span, otherSpan: Span): boolean =>
  span.max <= otherSpan.min || span.min >= otherSpan.max;
