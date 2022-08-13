import { PersonInterface } from '@shared/types';

export type CreatePersonInterface = Pick<PersonInterface, 'name' | 'position' | 'email'>;
export type UpdatePersonInterface = Partial<PersonInterface>;
