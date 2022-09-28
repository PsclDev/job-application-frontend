import { ApplicationInterface } from '@shared';
import { CreatePersonInterface } from '@/modules/person/types/create-person.interface';
import { CreateStatusInterface } from '@/modules/status/types/create-status.interface';

export type CreateApplicationInterface = Pick<ApplicationInterface, 'name' | 'description' | 'company' | 'jobUrl' | 'notes'> & { contact: CreatePersonInterface; status: CreateStatusInterface };
export type UpdateApplicationInterface = Partial<CreateApplicationInterface>;
