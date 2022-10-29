import { PersonInterface } from '@shared';

// localId is used to have an unique identifier for the meeting modal, so attendees can be added or removed accordingly
export type CreatePersonInterface = Pick<PersonInterface, 'name' | 'position' | 'email' > & { localId: number };
export type UpdatePersonInterface = Partial<CreatePersonInterface>;
