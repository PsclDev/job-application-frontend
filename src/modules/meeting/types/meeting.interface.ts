import { MeetingInterface } from '@shared';
import { CreatePersonInterface } from '@/modules/application/types/person.interface';

export type CreateMeetingInterface = Pick<MeetingInterface, 'title' | 'link'> & { date: string; attendees: CreatePersonInterface[] };
export type UpdateMeetingInterface = Partial<CreateMeetingInterface>;
