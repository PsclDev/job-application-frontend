import { ApplicationInterface } from '@shared/types';
import { CreatePersonInterface } from '@/modules/person/types/create-person.interface';

export type CreateApplicationInterface = Pick<ApplicationInterface, 'name' | 'description' | 'company' | 'jobUrl' | 'status' | 'notes'> & { contact: CreatePersonInterface };
export type UpdateApplicationInterface = Partial<CreateApplicationInterface>;
