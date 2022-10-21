import { ApplicationInterface } from '@shared';
import { CreatePersonInterface } from './person.interface';
import { CreateStatusInterface } from './status.interface';

export type CreateApplicationInterface = Pick<ApplicationInterface, 'name' | 'description' | 'company' | 'jobUrl'> & { contact: CreatePersonInterface; status: CreateStatusInterface };
export type UpdateApplicationInterface = Partial<CreateApplicationInterface>;
