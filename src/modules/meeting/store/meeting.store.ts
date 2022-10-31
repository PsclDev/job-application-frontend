import { defineStore } from 'pinia';
import axios from 'axios';
import { MeetingInterface } from '@shared';
import { Logger } from '@module/common/utils/logger';
import { error as ErrorNotifiaction, success as SuccessNotifiaction } from '@global/NotificationPlugin';
import { CreatePersonInterface } from '@module/application/types/person.interface';
import { CreateMeetingInterface, UpdateMeetingInterface } from '@/modules/meeting/types/meeting.interface';

export const useMeetingStore = defineStore('meeting', {
  state: () => {
    return {
      logger: new Logger('MeetingStore'),
      meetings: [] as MeetingInterface[],
      loading: false,
      resultData: `
        id
        applicationId
        title
        date
        link
        attendees {
            name
            position
            email
        }
        notes
        `,
    };
  },
  actions: {
    async loadAll() {
      try {
        this.loading = true;
        const res = await axios.post<{ meetings: MeetingInterface[] }>('', {
          query: `
          query {
            meetings {
              ${this.resultData}
            }
          }
          `,
        });
        this.meetings = res.data.meetings;
        this.sortMeetings();
        this.loading = false;
      } catch (err) {
        this.catchError('loadAll', err, 'Couldn\'t load meetings');
      }
    },
    async loadOne(id: string) {
      try {
        this.loading = true;

        const res = await axios.post<{ meeting: MeetingInterface }>('', {
          query: `
          query {
            meeting(id: "${id}") {
              ${this.resultData}
            }
          }
          `,
        });
        this.meetings.push(res.data.meeting);
        this.sortMeetings();
        this.actionSucceeded('loadAll', `Loaded meeting: ${res.data.meeting.title}`, res.data.meeting);
      } catch (err) {
        this.catchError('loadAll', err, `Couldn\'t load meeting by id ${id}`);
      }
    },
    async create(applicaitonId: string, meeting: CreateMeetingInterface) {
      try {
        const attendees = this.attendeesArrayToString(meeting.attendees);

        const res = await axios.post<{ createMeeting: MeetingInterface }>('', {
          query: `
          mutation {
            createMeeting(
              input: {
                applicationId: "${applicaitonId}"
                title: "${meeting.title}"
                date: "${meeting.date}"
                link: "${meeting.link}"
                attendees: ${attendees}
              }
            ) {
              ${this.resultData}
            }
          }
          `,
        });
        this.meetings.push(res.data.createMeeting);
        this.sortMeetings();
        this.actionSucceeded('create', `New meeting created: '${meeting.title}'`, meeting);
      } catch (err) {
        this.catchError('create', err, 'Failed to create meeting');
      }
    },
    async edit(id: string, update: UpdateMeetingInterface) {
      try {
        const attendees = this.attendeesArrayToString(update.attendees);

        const res = await axios.post<{ updateMeeting: MeetingInterface }>('', {
          query: `
          mutation {
            updateMeeting(
              id: "${id}",
              input: {
                title: "${update.title}"
                date: "${update.date}"
                link: "${update.link}"
                attendees: ${attendees}
              }
            ) {
              ${this.resultData}
            }
          }
          `,
        });
        this.meetings = this.meetings.map((meeting) => {
          if (meeting.id === id) {
            meeting = res.data.updateMeeting;
          }
          return meeting;
        });
        this.sortMeetings();
        this.actionSucceeded('edit', `Updated meeting: '${update.title}'`, update);
      } catch (err) {
        this.catchError('edit', err, `Update meeting failed: '${update.title}'`);
      }
    },
    attendeesArrayToString(attendees: CreatePersonInterface[] | undefined) {
      return !attendees || attendees!.length === 0 ? '[]' : `[${attendees!.map(attendee => `{ name: "${attendee.name}", position: "${attendee.position}", email: "${attendee.email}" },`)}]`;
    },
    async editNotes(id: string, notes: string) {
      try {
        const res = await axios.post<{ updateMeeting: MeetingInterface }>('', {
          query: `
          mutation {
            updateMeetingNotes(
              id: "${id}",
              notes: "${JSON.stringify(notes).slice(1, -1)}"
            ) {
              ${this.resultData}
            }
          }
          `,
        });
        this.meetings = this.meetings.map((meeting) => {
          if (meeting.id === id) {
            meeting = res.data.updateMeeting;
          }
          return meeting;
        });
        this.actionSucceeded('editNotes', 'Updated notes', res.data.updateMeeting);
      } catch (err) {
        this.catchError('editNotes', err, 'Failed to update notes');
      }
    },
    async remove(id: string, name: string) {
      try {
        const res = await axios.post<{ deleteMeeting: boolean }>('', {
          query: `
          mutation {
            deleteMeeting(id: "${id}")
          }
          `,
        });

        this.meetings = this.meetings.filter(meeting => meeting.id !== id);
        this.actionSucceeded('remove', `Removed meeting: '${name}'`, res.data.deleteMeeting);
      } catch (err) {
        this.catchError('remove', err, `Couldn\'t remove meeting: '${name}'`);
      }
    },
    actionSucceeded(action: string, msg: string, ...args: unknown[]) {
      this.loading = false;
      this.logger.info(action, args);
      SuccessNotifiaction(msg);
    },
    catchError(action: string, err: unknown, errMsg: string) {
      this.loading = false;
      this.logger.error(action, err);
      ErrorNotifiaction(errMsg);
    },
    sortMeetings() {
      const sortMeetings = (a: MeetingInterface, b: MeetingInterface) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      };
      this.meetings = this.meetings.sort(sortMeetings);
    },
  },
  getters: {
    meetingById: (state) => {
      return (id: string): MeetingInterface | undefined => state.meetings.find(meeting => meeting.id === id);
    },
    meetingsByApplicationId: (state) => {
      return (applicationId: string): MeetingInterface[] => state.meetings.filter(meeting => meeting.applicationId === applicationId);
    },
  },
});
