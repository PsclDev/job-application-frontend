import { MeetingInterface } from '@shared';
import { CreatePersonInterface } from '@/modules/person/types/create-person.interface';

export type CreateMeetingInterface = Pick<MeetingInterface, 'title' | 'date' | 'notes'> & { attendees: CreatePersonInterface[] };
export type UpdateMeetingInterface = Partial<CreateMeetingInterface>;
