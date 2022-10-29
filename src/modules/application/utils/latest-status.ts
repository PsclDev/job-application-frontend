import { StatusInterface } from '@shared';

export function getLatestStatus(status: StatusInterface[]) {
  return status.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}
