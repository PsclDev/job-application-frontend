import { GroupInterface } from '@shared';

export type CreateGroupInterface = Pick<GroupInterface, 'name' | 'description'>;
export type UpdateGroupInterface = Partial<CreateGroupInterface>;
