import { serializeDay } from './serialize-day';

export const isDay = (day: string): boolean =>
  serializeDay(new Date(day)) === day;
