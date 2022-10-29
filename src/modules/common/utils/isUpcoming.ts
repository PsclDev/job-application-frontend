import { DateTime } from 'luxon';
import { getFormDateFormat } from './date-format';

const startDate = DateTime.now().minus({ days: 1 });
const endDate = DateTime.now().plus({ days: 14 });

export function isUpcoming(date: Date, withinRange = true) {
  const dt = DateTime.fromFormat(date.toString().split('T')[0], getFormDateFormat());
  const afterStart = dt.toUnixInteger() >= startDate.toUnixInteger();
  const beforeEnd = dt.toUnixInteger() <= endDate.toUnixInteger();

  return withinRange ? afterStart && beforeEnd : afterStart;
}
