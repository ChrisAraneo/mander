import { hashString } from '../rng';
import { dailyDate } from './daily-date';

export function dailySeed(date?: Date): string {
  return hashString(dailyDate(date));
}
