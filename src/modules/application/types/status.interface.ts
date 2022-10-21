import { StatusInterface } from '@shared';

export type CreateStatusInterface = Pick<StatusInterface, 'state'> & { date: string };
export type UpdateStatusInterface = Partial<CreateStatusInterface>;
