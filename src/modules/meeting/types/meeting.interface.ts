import { MeetingInterface } from '@shared';
import { CreatePersonInterface } from '@module/application/types/person.interface';

export type CreateMeetingInterface = Pick<MeetingInterface, 'title' | 'link'> & { date: string; attendees: CreatePersonInterface[] };
export type UpdateMeetingInterface = Partial<CreateMeetingInterface>;
