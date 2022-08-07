import { GroupInterface } from '@shared/types';

export type CreateGroupInterface = Pick<GroupInterface, 'name' | 'description'>;
export type UpdateGroupInterface = Partial<CreateGroupInterface>;
