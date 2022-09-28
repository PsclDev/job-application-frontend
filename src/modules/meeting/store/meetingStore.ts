import { defineStore } from 'pinia';
import axios from 'axios';
import { MeetingInterface } from '@shared';
import { DateTime } from 'luxon';
import { CreateMeetingInterface, UpdateMeetingInterface } from '../types/create-meeting.interface';
import { apiDateTimeFormat, pickerDateTimeFormat } from '../util/date-time-format';
import { Logger } from '@/modules/common/utils/logger';
import { useApplicationStore } from '@/modules/application/store/applicationStore';

export const useMeetingStore = defineStore('meeting', {
  state: () => {
    return {
      logger: new Logger('ApplicationStore'),
      loading: false,
      error: null as String | null,
      resultData: `
        id
        applicationId
        title
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
    async createMeeting(applicationId: string, meeting: CreateMeetingInterface) {
      try {
        const attendees = `attendees: [
          ${meeting.attendees.map(attendee => (`{
            name: "${attendee.name}"
            position: "${attendee.position}"
            email: "${attendee.email}"
          },`)).toString()}
        ]`;

        const res = await axios.post<{ createMeeting: MeetingInterface }>('', {
          query: `
          mutation {
            createMeeting(
              input: {
                applicationId: "${applicationId}"
                title: "${meeting.title}"
                date: "${DateTime.fromFormat(meeting.date, pickerDateTimeFormat).toFormat(apiDateTimeFormat)}"
                ${attendees}
                link: "${meeting.link}"
              }
            ) {
              ${this.resultData}
            }
          }
          `,
        });
        this.logger.info('createMeeting', res.data.createMeeting);
        const applicationStore = useApplicationStore();
        applicationStore.updateMeeting(applicationId, res.data.createMeeting, 'ADD');
      } catch (e) {
        this.error = `Failed to create meeting ${meeting}`;
        this.logger.error('createMeeting', e);
      }
    },
    async updateMeeting(applicationId: string, id: string, meeting: UpdateMeetingInterface) {
      try {
        const attendees = meeting.attendees
          ? `attendees: [
          ${meeting.attendees.map(attendee => (`{
            name: "${attendee.name}"
            position: "${attendee.position}"
            email: "${attendee.email}"
          },`)).toString()}
        ]`
          : '';

        const res = await axios.post<{ updateMeeting: MeetingInterface }>('', {
          query: `
          mutation {
            updateMeeting(
              id: "${id}"
              input: {
                title: "${meeting.title}"
                date: "${DateTime.fromFormat(meeting.date!, pickerDateTimeFormat).toFormat(apiDateTimeFormat)}"
                ${attendees}
                link: "${meeting.link}"
              }
            ) {
              ${this.resultData}
            }
          }
          `,
        });
        this.logger.info('updateMeeting', res.data.updateMeeting);
        const { updateMeeting } = useApplicationStore();
        updateMeeting(applicationId, res.data.updateMeeting, 'UPDATE');
      } catch (e) {
        this.error = `Failed to update meeting ${meeting}`;
        this.logger.error('updateMeeting', e);
      }
    },
    async deleteMeeting(applicationId: string, id: string) {
      try {
        const res = await axios.post<{ deleteMeeting: boolean }>('', {
          query: `
          mutation {
            deleteMeeting(id: "${id}")
          }
          `,
        });
        this.logger.info('deleteMeeting', res.data);
        const { updateMeeting } = useApplicationStore();
        updateMeeting(applicationId, id, 'DELETE');
      } catch (e) {
        this.error = 'Failed to delete meeting';
        this.logger.error('deleteMeeting', e);
      }
    },
  },
});
