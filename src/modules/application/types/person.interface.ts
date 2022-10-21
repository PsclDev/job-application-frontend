import { PersonInterface } from '@shared';

export type CreatePersonInterface = Pick<PersonInterface, 'name' | 'position' | 'email' >;
export type UpdatePersonInterface = Partial<CreatePersonInterface>;
